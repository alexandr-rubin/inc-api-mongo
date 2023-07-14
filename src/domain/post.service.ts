import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument, PostInputModel, PostViewModel } from "../models/Post";
import { Blog, BlogDocument } from "src/models/Blogs";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>){}

  async addPost(post: PostInputModel): Promise<PostViewModel>{
    const blog = await this.blogModel.findById(post.blogId, { __v: false })
    const newPost = new this.postModel({...post, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: []})
    const save = (await newPost.save()).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: save._id.toString(), ...save, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
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