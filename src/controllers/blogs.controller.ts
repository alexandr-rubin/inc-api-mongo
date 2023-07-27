import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { BlogService } from "../domain/blog.service";
import { BlogInputModel } from "../models/Blogs";
import { QueryParamsModel } from "../models/PaginationQuery";
import { BlogQueryRepository } from "../queryRepositories/blog.query-repository";
import { PostForSpecBlogInputModel } from "../models/Post";
import { BlogIdValidationPipe } from "src/validation/pipes/blog-Id-validation.pipe";

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService,  private readonly postService: BlogService,private readonly blogQueryRepository: BlogQueryRepository){}
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    return await this.blogQueryRepository.getBlogs(params)
  }

  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createBlog(@Body() blog: BlogInputModel) {
    return await this.blogService.addBlog(blog)
  }

  @HttpCode(HttpStatusCode.CREATED_201)
  @Post(':blogId/posts')
  async createPostForSecificBlog(@Param('blogId', BlogIdValidationPipe) blogId: string, @Body() post: PostForSpecBlogInputModel) {
    const result = await this.postService.addPostForSpecificBlog(blogId, post)

    return result
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':blogId')
  async deleteBlogById(@Param('blogId', BlogIdValidationPipe) id: string) {
    return await this.blogService.deleteBlogById(id)
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId', BlogIdValidationPipe) id: string) {
    return await this.blogQueryRepository.getBlogById(id)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':blogId')
  async updateBlogById(@Param('blogId', BlogIdValidationPipe) id: string, @Body() blog: BlogInputModel) {
    return await this.blogService.updateBlogById(id, blog)
  }

  @Get(':blogId/posts')
  async getPostsForSpecifiBlog(@Query() params: QueryParamsModel, @Param('blogId', BlogIdValidationPipe) blogId: string) {
    // add userID
    return await this.blogQueryRepository.getPostsForSpecifiedBlog(blogId, params, '')
  }
}