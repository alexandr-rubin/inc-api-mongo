import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { BlogService } from "../domain/blog.service";
import { BlogInputModel } from "../models/Blogs";
import { QueryParamsModel } from "../models/PaginationQuery";
import { BlogQueryRepository } from "../queryRepositories/blog.query-repository";
import { PostForSpecBlogInputModel } from "../models/Post";
import { BlogIdValidationPipe } from "../validation/pipes/blog-Id-validation.pipe";
import { Public } from "../decorators/public.decorator";
import { Request } from 'express'
import { JwtAuthService } from "../domain/JWT.service";

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService,  private readonly postService: BlogService,private readonly blogQueryRepository: BlogQueryRepository,
    private readonly jwtAuthService: JwtAuthService){}
  @Public()
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    return await this.blogQueryRepository.getBlogs(params)
  }

  @Public()
  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createBlog(@Body() blog: BlogInputModel) {
    return await this.blogService.addBlog(blog)
  }

  @Public()
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

  @Public()
  @Get(':blogId')
  async getBlogById(@Param('blogId', BlogIdValidationPipe) id: string) {
    return await this.blogQueryRepository.getBlogById(id)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':blogId')
  async updateBlogById(@Param('blogId', BlogIdValidationPipe) id: string, @Body() blog: BlogInputModel) {
    return await this.blogService.updateBlogById(id, blog)
  }

  @Public()
  @Get(':blogId/posts')
  async getPostsForSpecifiBlog(@Query() params: QueryParamsModel, @Param('blogId', BlogIdValidationPipe) blogId: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    return await this.blogQueryRepository.getPostsForSpecifiedBlog(blogId, params, userId)
  }
}