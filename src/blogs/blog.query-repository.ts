import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery } from "../helpers/pagination";
import { BlogViewModel } from "./models/view/BlogViewModel";
import { Blog, BlogDocument } from "./models/schemas/Blog";
import { BlogAdminViewModel } from "./models/view/BlogAdminViewModel";

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>){}
  async getBlogs(params: QueryParamsModel, userId: string | null): Promise<Paginator<BlogViewModel>> {
    const query = createPaginationQuery(params)
    // remove double filter.(getBlogsWithFilter)
    const filter: any = userId === null ? {} : {userId: userId}
    const blogs = await this.getBlogsWithFilter(query, userId)
    
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transformedBlogs = blogs.map(({ _id, userId, ...rest }) => ({ id: _id.toString(), ...rest }))

    const count = await this.blogModel.countDocuments(filter)
    const result = Paginator.createPaginationResult(count, query, transformedBlogs)
    
    return result
  }

  // add filter to params
  private async getBlogsWithFilter(query: QueryParamsModel, userId: string | null){
    const filter: any = userId === null ? {} : {userId: userId}
    if (query.searchNameTerm !== null) {
      filter.name = { $regex: query.searchNameTerm, $options: 'i' }
    }
    const skip = (query.pageNumber - 1) * query.pageSize
    //
    const blogs = await this.blogModel.find(filter, { __v: false })
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip).limit(query.pageSize).lean()

    return blogs
  }

  async getSuperAdminBlogs(params: QueryParamsModel): Promise<Paginator<BlogAdminViewModel>> {
    const query = createPaginationQuery(params)
    const blogs = await this.getBlogsWithFilter(query, null)
    const count = await this.blogModel.countDocuments({})
    const transformedBlogs = blogs.map(({ _id, userId, ...rest }) => ({ id: _id.toString(), ...rest, blogOwnerInfo: {userId: userId, userLogin: null} }))
    const result = Paginator.createPaginationResult(count, query, transformedBlogs)
    return result
  }

  async getBlogById(blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogModel.findById(blogId, { __v: false, userId: false })
    if (!blog){
      throw new NotFoundException()
    }
    const { _id, ...rest } = blog.toJSON()
    const id = _id.toString()
    return { id, ...rest }
  }

  async getBlogByIdNoView(blogId: string): Promise<Blog | null> {
    const blog = await this.blogModel.findById(blogId, { __v: false })
    if (!blog){
      return null
    }
    return blog
  }

  // async getPostsForSpecifiedBlog(blogId: string, params: QueryParamsModel, userId: string): Promise<Paginator<PostViewModel>>{
  //   const blog = await this.getBlogById(blogId)
  //   if(!blog){
  //     throw new NotFoundException()
  //   }
  //   //////////
  //   const result = await this.postQueryRepository.getPostsForSpecifiedBlog(blogId, params)
  //   return await this.postQueryRepository.editPostToViewModel(result, userId)
  // }
}