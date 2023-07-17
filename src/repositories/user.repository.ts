import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel, UserViewModel } from "../models/User";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
  // типизация
  async createUser(newUser: User) {
    const user = new this.userModel(newUser)
    await user.save()
    return user
  }
}