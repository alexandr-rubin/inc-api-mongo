import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument, BlogInputModel, BlogViewModel } from "../models/Blogs";
import { Post, PostDocument, PostForSpecBlogInputModel, PostViewModel } from "../models/Post";
import { BlogRepository } from "../repositories/blog.repository";

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, @InjectModel(Post.name) private postModel: Model<PostDocument>,
  private blogRepository: BlogRepository){}

  async addBlog(blog: BlogInputModel): Promise<BlogViewModel>{
    const newBlog: Blog = {...blog, createdAt: new Date().toISOString(), isMembership: false}
    const savedBlog = (await this.blogRepository.addBlog(newBlog)).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, ...result } = {id: savedBlog._id.toString(), ...savedBlog}
    return result
  }

  async addPostForSpecificBlog(blogId: string, post: PostForSpecBlogInputModel): Promise<PostViewModel>{
    const blog = await this.blogModel.findById(blogId, { __v: false })
    if(!blog){
      throw new NotFoundException()
    }
    const newPost = new this.postModel({...post, blogId: blogId, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: [] })
    const save = await this.blogRepository.addPostForSpecificBlog(newPost)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: save._id.toString(), ...save, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await this.blogRepository.deleteBlogById(id)
    if(!result){
      throw new NotFoundException()
    }
    
    return result
  }

  async updateBlogById(id: string, blog: BlogInputModel): Promise<boolean> {
    const isUpdated = await this.blogRepository.updateBlogById(id, blog)
    if(!isUpdated){
      throw new NotFoundException()
    }
    return isUpdated
  }

  async deleteBlogsTesting(): Promise<boolean> {
    const result = await this.blogRepository.deleteBlogsTesting()
    return !!result
  }
}