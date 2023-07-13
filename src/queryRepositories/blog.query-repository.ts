import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery, createPaginationResult } from "../helpers/pagination";
import { Blog, BlogDocument, BlogViewModel } from "../models/Blogs";
import { Post, PostDocument } from "../models/Post";
import { PostQueryRepository } from "./post.query-repository";

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, @InjectModel(Post.name) private postModel: Model<PostDocument>, private postQueryRepository: PostQueryRepository){}
  async getBlogs(params: QueryParamsModel): Promise<Paginator<Blog>> {
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    //
    const blogs = await this.blogModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, { __v: false, _id: false })
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip).limit(query.pageSize).lean()

    const count = await this.blogModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
    const result = createPaginationResult(count, query, blogs)
    
    return result
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.blogModel.findById(blogId, { __v: false, _id: false })
    if (!blog){
      return null
    }

    return blog
  }

  async getPostsForSpecifiedBlog(blogId: string, params: QueryParamsModel, userId: string): Promise<Paginator<Post> | null>{
    const isFinded = await this.getBlogById(blogId) === null
    if(isFinded){
        return null
    }
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    const posts = await this.postModel.find(query.searchNameTerm === null ? {blogId: blogId} : {blogId: blogId, name: {$regex: query.searchNameTerm, $options: 'i'}}, { __v: false, _id: false })
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip)
    .limit(query.pageSize).lean()
    const count = await this.postModel.countDocuments({blogId: blogId})
    const result = createPaginationResult(count, query, posts)
    return await this.postQueryRepository.editPostToViewModel(result, userId)
}
}