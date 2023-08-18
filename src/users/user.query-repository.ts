import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery } from "../helpers/pagination";
import { User, UserDocument } from "./models/schemas/User";
import { BlogAdminViewModel } from "../blogs/models/view/BlogAdminViewModel";

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
  async getUsers(params: QueryParamsModel): Promise<Paginator<User>> {
    //
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    //
    const search : any = {}
    if(query.searchLoginTerm != null){
        search.login = {$regex: query.searchLoginTerm, $options: 'i'}
    }
    if(query.searchEmailTerm != null){
        search.email = {$regex: query.searchEmailTerm, $options: 'i'}
    }
    const searchTermsArray = Object.keys(search).map(key => ({ [key]: search[key] }))
    const users = await this.userModel.find({$or: searchTermsArray.length === 0 ? [{}] : searchTermsArray}, { password: false, confirmationEmail: false, confirmationPassword: false, __v: false, role: false, banInfo: {_id: false} })
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip).limit(query.pageSize).lean()
    //
    const transformedUsers = users.map((user) => {
      const { _id, ...rest } = user
      const id = _id.toString()
      return { id, ...rest }
    })

    const count = await this.userModel.countDocuments({$or: searchTermsArray.length === 0 ? [{}] : searchTermsArray})
    const result = Paginator.createPaginationResult(count, query, transformedUsers)
    
    return result
  }

  async getUsergByIdNoView(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId, { __v: false }).lean()
    if(!user){
      return null
    }
    return user
  }

  async findUserByConfirmationEmailCode(code: string): Promise<UserDocument | null>{
    const user = await this.userModel.findOne({'confirmationEmail.confirmationCode': code})
    return user
  }

  async findUserByConfirmationPasswordCode(code: string): Promise<UserDocument | null>{
    const user = await this.userModel.findOne({'confirmationPassword.confirmationCode': code})
    return user
  }

  async getUsergByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({email: email})
    if(!user){
      return null
    }
    return user
  }

  // rename method
  async getUsersForAdminBlogs(blogs: BlogAdminViewModel[]) {
    for(const blog of blogs){
      const user = await this.getUsergByIdNoView(blog.blogOwnerInfo.userId)
      if(!user){
        throw new NotFoundException() 
      }

      blog.blogOwnerInfo.userLogin = user.login
    }

    return blogs
  }

  async getUsergByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({login: login})
    if(!user){
      return null
    }
    return user
  }

  async getBannedUsersId(): Promise<string[]> {
    const bannedUsers = await this.userModel.find({'banInfo.isBanned': true}, '_id')
    const bannedUserIds = bannedUsers.map(user => user._id.toString());
    return bannedUserIds
  }
}