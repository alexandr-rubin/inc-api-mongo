import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel, UserViewModel } from "../models/User";
import { UserRepository } from "src/repositories/user.repository";

@Injectable()
export class AuthorizationService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private userRepository: UserRepository){}

}