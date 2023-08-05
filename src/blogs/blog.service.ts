import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogRepository } from "./blog.repository";
import { BlogQueryRepository } from "./blog.query-repository";
import { BlogInputModel } from "./models/input/BlogInputModel";
import { BlogViewModel } from "./models/view/BlogViewModel";
import { Blog } from "./models/schemas/Blog";
import { PostForSpecBlogInputModel } from "../posts/models/input/PostForSpecBlog";
import { PostViewModel } from "../posts/models/view/Post";
import { Post } from "../posts/models/schemas/Post";

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository, private blogQueryRepository: BlogQueryRepository){}

  async addBlog(blog: BlogInputModel): Promise<BlogViewModel>{
    const newBlog: Blog = {...blog, createdAt: new Date().toISOString(), isMembership: false}
    const savedBlog = (await this.blogRepository.addBlog(newBlog)).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, ...result } = {id: savedBlog._id.toString(), ...savedBlog}
    return result
  }

  async addPostForSpecificBlog(blogId: string, post: PostForSpecBlogInputModel): Promise<PostViewModel>{
    const blog = await this.blogQueryRepository.getBlogById(blogId)
    if(!blog){
      throw new NotFoundException()
    }
    const newPost: Post = {...post, blogId: blogId, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: [] }
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