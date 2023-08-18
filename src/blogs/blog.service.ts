import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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

  async addBlog(blog: BlogInputModel, creatorId: string): Promise<BlogViewModel>{
    const newBlog: Blog = {...blog, createdAt: new Date().toISOString(), isMembership: false, userId: creatorId}
    const savedBlog = (await this.blogRepository.addBlog(newBlog)).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, userId, ...result } = {id: savedBlog._id.toString(), ...savedBlog}
    return result
  }

  async addPostForSpecificBlog(blogId: string, post: PostForSpecBlogInputModel, userId: string): Promise<PostViewModel>{
    const blog = await this.blogQueryRepository.getBlogByIdNoView(blogId)
    if(!blog){
      throw new NotFoundException()
    }
    if(blog.userId !== userId){
      throw new ForbiddenException()
    }
    const newPost: Post = {...post, blogId: blogId, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: [] }
    const save = await this.blogRepository.addPostForSpecificBlog(newPost)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: save._id.toString(), ...save, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }

  async deleteBlogById(id: string, userId: string): Promise<boolean> {
    await this.validateBlogUser(id, userId)
    const result = await this.blogRepository.deleteBlogById(id)
    // throw error after getting blog above?
    if(!result){
      throw new NotFoundException()
    }
    
    return result
  }

  async updateBlogById(id: string, newblog: BlogInputModel, userId: string): Promise<boolean> {
    await this.validateBlogUser(id, userId)
    const isUpdated = await this.blogRepository.updateBlogById(id, newblog)
    // throw error after getting blog above?
    if(!isUpdated){
      throw new NotFoundException()
    }
    return isUpdated
  }

  async validateBlogUser(blogId: string, userId: string) {
    const blog = await this.blogQueryRepository.getBlogByIdNoView(blogId)
    if(blog && blog.userId !== userId){
      throw new ForbiddenException()
    }
  }

  async bindBlogWithUser(blogId: string, userId: string): Promise<boolean> {
    const blog = await this.blogQueryRepository.getBlogByIdNoView(blogId)
    if(!blog){
      throw new BadRequestException('Incorrect blog id')
    }
    //
    if(blog.userId === userId || blog.userId !== null || blog.userId.length !== 0) {
      throw new BadRequestException('User Id is already binded')
    }

    return await this.blogRepository.bindBlogWithUser(blogId, userId)
  }

  async deleteBlogsTesting(): Promise<boolean> {
    const result = await this.blogRepository.deleteBlogsTesting()
    return !!result
  }
}