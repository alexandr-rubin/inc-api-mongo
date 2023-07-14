import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { add } from "date-fns";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel, UserViewModel } from "../models/User";
import { v4 as uuidv4 } from 'uuid'
import { generateHash } from "../helpers/generateHash";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async createUser(userDto: UserInputModel): Promise<UserViewModel> {
    const passwordHash = await generateHash(userDto.password)
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3
    })
    const newUser = new this.userModel({...userDto, password: passwordHash, createdAt: new Date().toISOString(), 
      confirmationEmail: { confirmationCode: uuidv4(), expirationDate: expirationDate, isConfirmed: true},
      confirmationPassword: { confirmationCode: uuidv4(), expirationDate: expirationDate }
    })
    const save = (await newUser.save()).toJSON()
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmationEmail, confirmationPassword, password,__v, _id, ...result} = {...save, id: save._id.toString()}
    return result
  }
  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id)
    return !!result
  }
  async deleteUsersTesting(): Promise<boolean> {
    const result = await this.userModel.deleteMany({})
    return !!result
  }
}