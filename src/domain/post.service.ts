import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Post, PostDocument, PostInputModel, PostViewModel } from "../models/Post";
import { BlogQueryRepository } from "../queryRepositories/blog.query-repository";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, protected blogQueryRepository: BlogQueryRepository){}

  async addPost(post: PostInputModel): Promise<PostViewModel>{
    const blog = await this.blogQueryRepository.getBlogById(post.blogId)

    const newPost = new this.postModel({id: new mongoose.Types.ObjectId().toString(), ...post, blogName: blog.name, createdAt: new Date().toISOString(),
    extendedLikesInfo: { likesCount: 0, dislikesCount: 0}})
    const save = (await newPost.save()).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, ...result } = {...save, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }

  async deletePostById(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndDelete(id)
    return !!result
  }

  async updatePostById(id: string, post: PostInputModel): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(id, post)
    return !!result
  }

  async deletePostsTesting(): Promise<boolean> {
    const result = await this.postModel.deleteMany({})
    return !!result
  }
}