import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { BlogService } from "../domain/blog.service";
import { BlogInputModel } from "../models/Blogs";
import { QueryParamsModel } from "../models/PaginationQuery";
import { BlogQueryRepository } from "../queryRepositories/blog.query-repository";
import { PostForSpecBlogInputModel } from "../models/Post";
import { BlogIdValidationPipe } from "src/validation/blog-custom-validation.pipe";

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService,  private readonly postService: BlogService,private readonly blogQueryRepository: BlogQueryRepository){}
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    return await this.blogQueryRepository.getBlogs(params)
  }

  @Post()
  async createBlog(@Body() blog: BlogInputModel) {
    return await this.blogService.addBlog(blog)
  }

  @Post(':blogId/posts')
  async createPostForSecificBlog(@Param('blogId', BlogIdValidationPipe) blogId: string, @Body() post: PostForSpecBlogInputModel, @Res() res: Response) {
    const result = await this.postService.addPostForSpecificBlog(blogId, post)

    return res.status(HttpStatusCode.CREATED_201).send(result)
  }

  @Delete(':blogId')
  async deleteBlogById(@Param('blogId', BlogIdValidationPipe) id: string, @Res() res: Response) {
    await this.blogService.deleteBlogById(id)

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId', BlogIdValidationPipe) id: string, @Res() res: Response) {
    const result = await this.blogQueryRepository.getBlogById(id)

    return res.status(HttpStatusCode.OK_200).send(result)
  }

  @Put(':blogId')
  async updateBlogById(@Param('blogId', BlogIdValidationPipe) id: string, @Body() blog: BlogInputModel, @Res() res: Response) {
    await this.blogService.updateBlogById(id, blog)

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204) 
  }

  @Get(':blogId/posts')
  async getPostsForSpecifiBlog(@Query() params: QueryParamsModel, @Param('blogId', BlogIdValidationPipe) blogId: string, @Res() res: Response) {
    // add userID
    const result = await this.blogQueryRepository.getPostsForSpecifiedBlog(blogId, params, 'userId')

    return res.status(HttpStatusCode.OK_200).send(result)
  }
}