import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { BlogService } from "./blog.service";
import { QueryParamsModel } from "../models/PaginationQuery";
import { BlogQueryRepository } from "./blog.query-repository";
import { BlogIdValidationPipe } from "../validation/pipes/blog-Id-validation.pipe";
import { Request } from 'express'
import { JwtAuthService } from "../domain/JWT.service";
import { PostQueryRepository } from "../posts/post.query-repository";
import { BlogInputModel } from "./models/input/BlogInputModel";
import { PostForSpecBlogInputModel } from "../posts/models/input/PostForSpecBlog";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AccessTokenVrifyModel } from "src/authorization/models/input/Auth";

@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService,  private readonly postService: BlogService, private readonly blogQueryRepository: BlogQueryRepository,
  private readonly jwtAuthService: JwtAuthService, private readonly postQueryRepository: PostQueryRepository){}

  @Get()
  async getBlogs(@Query() params: QueryParamsModel) {
    return await this.blogQueryRepository.getBlogs(params)
  }

  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createBlog(@Body() blog: BlogInputModel, @Req() req: AccessTokenVrifyModel) {
    return await this.blogService.addBlog(blog, req.user.userId)
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
  async getPostsForSpecifiBlog(@Query() params: QueryParamsModel, @Param('blogId', BlogIdValidationPipe) blogId: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    return await this.postQueryRepository.getPostsForSpecifiedBlog(blogId, params, userId)
  }
}