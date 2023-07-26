import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel } from "../models/User";
import { UserRepository } from "src/repositories/user.repository";
import { EmailService } from "./email.service";
import { UserQueryRepository } from "src/queryRepositories/user.query-repository";
import { v4 as uuidv4 } from 'uuid'
import { genExpirationDate } from "src/helpers/genCodeExpirationDate";
import { generateHash } from "src/helpers/generateHash";
import { LoginValidation } from "src/validation/login";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
//////////////////
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secretkey'

@Injectable()
export class AuthorizationService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private userRepository: UserRepository,
  private emailService: EmailService, private readonly userQueryRepository: UserQueryRepository, private jwtService: JwtService){}

  async createUser(userDto: UserInputModel): Promise<User> {
    const newUser: User = await User.createUser(userDto, false)
    // какой репо
    const createdUser = await this.userRepository.createUser(newUser)
    await this.emailService.sendRegistrationConfirmationEmail(newUser.email, newUser.confirmationEmail.confirmationCode)
    return createdUser
  }

  async confrmEmail(code: string): Promise<boolean>{
    const user = await this.userQueryRepository.findUserByConfirmationEmailCode(code)
    //ныжны ли проверки если есть проверка в мидлваре
    if (!user)
      return false
    if (user.confirmationEmail.isConfirmed)
      return false
    if(new Date(user.confirmationEmail.expirationDate) < new Date()){
      return false
    }
    
    const isUpdated = await this.userRepository.updateConfirmation(user._id.toString())
    return isUpdated
  }
  async resendEmail(email: string): Promise<boolean>{
    const user = await this.userQueryRepository.getUsergByEmail(email)
    // middlware
    if (!user)
        return false
    if (user.confirmationEmail.isConfirmed === false)
        return false
    if(new Date(user.confirmationEmail.expirationDate) < new Date()){
        return false
    }
    const code = uuidv4()
    const isUpdated = await this.userRepository.updateConfirmationCode(user._id.toString(), code)
    await this.emailService.sendRegistrationConfirmationEmail(email, code)
    return isUpdated
  }

  async recoverPassword(email: string): Promise<boolean> {
    const user = await this.userQueryRepository.getUsergByEmail(email)
    if(!user){
        return false
    }

    const code = uuidv4()
    const expirationDate = genExpirationDate(1, 3)

    const isUpdated = await this.userRepository.updateconfirmationPasswordData(email, code, expirationDate)

    if(!isUpdated){
        return false
    }
    
    await this.emailService.sendPasswordRecoverEmail(email, code)

    return true
  }

  async updatePassword(password: string, code: string): Promise<boolean>{
    const passwordHash = await generateHash(password)
    const isUpdated = await this.userRepository.updatePassword(passwordHash, code)
    if(!isUpdated){
        return false
    }

    return true
  }

  async verifyUser(loginData: LoginValidation): Promise<string | null> {
    const user = await this.userRepository.verifyUser(loginData)
    if(user){
      try {
        const isMatch = await bcrypt.compare(loginData.password, user.password)
        if(isMatch){
          return user._id.toString()
        }
        return null
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return null
      }
      
    }
    
    return null
  }

  /////
  async createJWT(userId: string, deviceId: string, issuedAt: string){
    const accessTokenPayload = { userId: userId, JWT_SECRET_KEY }
    const refreshTokenPayload = { deviceId: deviceId, userId: userId, issuedAt: issuedAt }
    return {
      accessToken: await this.jwtService.signAsync(accessTokenPayload),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '20s' })
    };
  }

  async signIn(userId: string){
    const deviceId = uuidv4()
    const issuedAt = new Date().toISOString()
    return await this.createJWT(userId, deviceId, issuedAt)
  }
}