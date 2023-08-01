import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery } from "../helpers/pagination";
import { Blog, BlogDocument, BlogViewModel } from "../models/Blogs";
import { PostViewModel } from "../models/Post";
import { PostQueryRepository } from "./post.query-repository";

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, 
  private postQueryRepository: PostQueryRepository){}
  async getBlogs(params: QueryParamsModel): Promise<Paginator<Blog>> {
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    //
    const blogs = await this.blogModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, { __v: false })
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip).limit(query.pageSize).lean()
    //
    const transformedBlogs = blogs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }))

    const count = await this.blogModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
    const result = Paginator.createPaginationResult(count, query, transformedBlogs)
    
    return result
  }

  async getBlogById(blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogModel.findById(blogId, { __v: false })
    if (!blog){
      throw new NotFoundException()
    }
    const { _id, ...rest } = blog.toJSON()
    const id = _id.toString()
    return { id, ...rest }
  }

  async getBlogByIdNoView(blogId: string): Promise<boolean> {
    const blog = await this.blogModel.findById(blogId, { __v: false })
    if (!blog){
      return false
    }
    return true
  }

  async getPostsForSpecifiedBlog(blogId: string, params: QueryParamsModel, userId: string): Promise<Paginator<PostViewModel>>{
    const blog = await this.getBlogById(blogId)
    if(!blog){
      throw new NotFoundException()
    }
    //////////
    const result = await this.postQueryRepository.getPostsForSpecifiedBlog(blogId, params)
    return await this.postQueryRepository.editPostToViewModel(result, userId)
  }
}