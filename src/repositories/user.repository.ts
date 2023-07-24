import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models/User";
import { add } from "date-fns";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
  async createUser(newUser: User): Promise<UserDocument> {
    const user = new this.userModel(newUser)
    const save = (await user.save()).toJSON()
    return save
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id)
    return !!result
  }
  //
  async deleteUsersTesting(): Promise<boolean> {
    const result = await this.userModel.deleteMany({})
    return !!result
  }

  async updateConfirmation(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndUpdate(id, {'confirmationEmail.isConfirmed': true})
    return !!result
  }

  async updateConfirmationCode(id: string, code: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndUpdate(id, {'confirmationEmail.confirmationCode': code, 'confirmationEmail.expirationDate': add(new Date(), { hours: 1, minutes: 3})})
    return !!result
}
}