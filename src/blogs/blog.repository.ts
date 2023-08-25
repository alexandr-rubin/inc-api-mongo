import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostRepository } from "../posts/post.repository";
import { BlogInputModel } from "./models/input/BlogInputModel";
import { Blog, BlogDocument } from "./models/schemas/Blog";
import { Post, PostDocument } from "../posts/models/schemas/Post";
import { BlogBannedUsers } from "./models/input/BlogBannedUsersInputModel";

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, private postRepository: PostRepository){}

  // типизация
  async addBlog(blog: Blog){
    const newBlog = new this.blogModel(blog)
    await newBlog.save()
    return newBlog
  }

  async addPostForSpecificBlog(post: Post): Promise<PostDocument>{
    //
    const newPost = await this.postRepository.addPost(post)
    return newPost
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await this.blogModel.findByIdAndDelete(id)
    return !!result
  }

  async updateBlogById(id: string, blog: BlogInputModel): Promise<boolean> {
    const result = await this.blogModel.findByIdAndUpdate(id, blog)
    return !!result
  }

  async deleteBlogsTesting(): Promise<boolean> {
    const result = await this.blogModel.deleteMany({})
    return !!result
  }

  async bindBlogWithUser(blogId: string, userId: string): Promise<boolean>{
    const result = await this.blogModel.findByIdAndUpdate(blogId, {userId: userId})  
    return !!result
  }

  async banOrUnbanBlogById(blogId: string, isBanned: boolean, banDate: string): Promise<boolean> {
    const result = await this.blogModel.findByIdAndUpdate(blogId, {banInfo: {isBanned: isBanned, banDate: banDate}})
    return !!result
  }

  async banNewUserForBlog(blogId: string, newBannedUserInfo: BlogBannedUsers) {
    const blog = await this.blogModel.findById(blogId)
    blog.blogBannedUsers.push(newBannedUserInfo)
    return await blog.save()
  }

  async banExistingUserForBlog(userId: string, blogId: string, newBannedUserInfo: BlogBannedUsers) {
    const blog = await this.blogModel.findById(blogId)
    if(!blog){
      throw new NotFoundException('Blog is not found')
    }
    const bannedUserInfo = blog.blogBannedUsers.find(user => user.userId === userId)
    if(bannedUserInfo){
      bannedUserInfo.banDate = newBannedUserInfo.banDate
      bannedUserInfo.banReason = newBannedUserInfo.banReason
      bannedUserInfo.isBanned = newBannedUserInfo.isBanned
    }
    else{
      throw new NotFoundException('Banned user is not found.')
    }
    blog.markModified('blogBannedUsers')
    return await blog.save()
  }
}