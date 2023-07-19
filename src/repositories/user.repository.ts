import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models/User";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
  async createUser(newUser: User): Promise<UserDocument> {
    const user = new this.userModel(newUser)
    const save = (await user.save()).toJSON()
    return save
  }
}