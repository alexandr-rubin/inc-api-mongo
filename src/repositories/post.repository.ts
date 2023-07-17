import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument, PostInputModel, PostViewModel } from "../models/Post";
import { Blog, BlogDocument } from "src/models/Blogs";

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>){}

  // типизация
  async addPost(post: Post){
    const newPost = new this.postModel(post)
    await newPost.save()
    return newPost
  }
}