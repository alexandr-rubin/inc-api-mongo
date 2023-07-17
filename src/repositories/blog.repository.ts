import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument, BlogInputModel, BlogViewModel } from "../models/Blogs";
import { Post, PostDocument, PostInputModel, PostViewModel } from "../models/Post";

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, @InjectModel(Post.name) private postModel: Model<PostDocument>){}

  // типизация
  async addBlog(blog: Blog){
    const newBlog = new this.blogModel(blog)
    await newBlog.save()
    return newBlog
  }

  async addPostForSpecificBlog(blogId: string, post: PostInputModel): Promise<PostViewModel | null>{
    const blog = await this.blogModel.findById(blogId, { __v: false })
    if(!blog){
      return null
    }
    const newPost = new this.postModel({...post, blogId: blogId, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: [] })
    const save = (await newPost.save()).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: save._id.toString(), ...save, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }
}