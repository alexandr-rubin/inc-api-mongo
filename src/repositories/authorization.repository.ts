import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models/User";

@Injectable()
export class AuthorizationRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

}