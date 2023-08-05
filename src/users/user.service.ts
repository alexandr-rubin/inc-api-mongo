import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserInputModel, UserViewModel } from "./models/User";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private userRepository: UserRepository){}

  async createUser(userDto: UserInputModel): Promise<UserViewModel> {
    const newUser: User = await User.createUser(userDto, true)

    const user = await this.userRepository.createUser(newUser)
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmationEmail, confirmationPassword, password,__v, _id, ...result} = {id: user._id.toString(), ...user}
    return result
  }
  //
  async deleteUserById(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.deleteUserById(id)
    if(!isDeleted){
      throw new NotFoundException()
    }
    return isDeleted
  }
  //
  async deleteUsersTesting(): Promise<boolean> {
    const result = await this.userRepository.deleteUsersTesting()
    return result
  }
}