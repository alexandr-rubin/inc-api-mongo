import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { add } from "date-fns";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel, UserViewModel } from "../models/User";
import { v4 as uuidv4 } from 'uuid'
import { generateHash } from "../helpers/generateHash";
import { UserRepository } from "src/repositories/user.repository";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private userRepository: UserRepository){}

  async createUser(userDto: UserInputModel): Promise<UserViewModel> {
    const passwordHash = await generateHash(userDto.password)
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3
    })
    const newUser: User = {...userDto, password: passwordHash, createdAt: new Date().toISOString(), 
      confirmationEmail: { confirmationCode: uuidv4(), expirationDate: expirationDate.toISOString(), isConfirmed: true},
      confirmationPassword: { confirmationCode: uuidv4(), expirationDate: expirationDate.toISOString() }
    }

    const user = (await this.userRepository.createUser(newUser)).toJSON()
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmationEmail, confirmationPassword, password,__v, _id, ...result} = {id: user._id.toString(), ...user}
    return result
  }
  //
  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id)
    return !!result
  }
  //
  async deleteUsersTesting(): Promise<boolean> {
    const result = await this.userModel.deleteMany({})
    return !!result
  }
}