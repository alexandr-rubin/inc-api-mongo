import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument, BlogInputModel } from "../models/Blogs";
import { Post, PostDocument } from "../models/Post";

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, @InjectModel(Post.name) private postModel: Model<PostDocument>){}

  // типизация
  async addBlog(blog: Blog){
    const newBlog = new this.blogModel(blog)
    await newBlog.save()
    return newBlog
  }

  async addPostForSpecificBlog(post: Post): Promise<PostDocument>{
    const newPost = new this.postModel(post)
    const save = (await newPost.save()).toJSON()
    return save
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
}