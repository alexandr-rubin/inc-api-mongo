import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HttpStatusCode } from "src/helpers/httpStatusCode";
import { Response } from "express";
import { BlogService } from "src/domain/blog.service";
import { BlogInputModel } from "src/models/Blogs";
import { QueryParamsModel } from "src/models/PaginationQuery";
import { BlogQueryRepository } from "src/queryRepositories/blog.query-repository";
import { PostInputModel } from "src/models/Post";

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
  async createPostForSecificBlog(@Param('blogId') blogId: string, @Body() post: PostInputModel, @Res() res: Response) {
    const result = await this.postService.addPostForSpecificBlog(blogId, post)
    if(!result){
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.CREATED_201).send(result)
  }

  @Delete(':id')
  async deleteBlogById(@Param('id') id: string, @Res() res: Response) {
    const isDeleted = await this.blogService.deleteBlogById(id)
    if(!isDeleted)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.blogQueryRepository.getBlogById(id)
    if(!result){
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result)
  }

  @Put(':id')
  async updateBlogById(@Param('id') id: string, @Body() blog: BlogInputModel, @Res() res: Response) {
    const isUpdated = await this.blogService.updateBlogById(id, blog)
    if(!isUpdated)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204) 
  }

  @Get(':blogId/posts')
  async getPostsForSpecifiBlog(@Query() params: QueryParamsModel, @Param('blogId') blogId: string, @Res() res: Response) {
    // add userID
    const result = await this.blogQueryRepository.getPostsForSpecifiedBlog(blogId, params, '')
    if(!result)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result)
  }
}