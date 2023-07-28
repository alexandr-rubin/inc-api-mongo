import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { PostInputModel } from "../models/Post";
import { PostService } from "../domain/post.service";
import { PostQueryRepository } from "../queryRepositories/post.query-repository";
import { QueryParamsModel } from "../models/PaginationQuery";
import { CommentInputModel } from "src/models/Comment";
import { BlogIdForPostValidationPipe } from "src/validation/pipes/body-blog-id-validation.pipe";
import { PostIdValidationPipe } from "src/validation/pipes/post-Id-validation.pipe";
import { AccessTokenVrifyModel } from "src/models/Auth";
import { Request } from 'express'
import { JwtService } from "@nestjs/jwt";
import * as dotenv from 'dotenv'
import { Public } from "src/decorators/public.decorator";

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secretkey'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository, private jwtService: JwtService){}
  @Public()
  @Get()
  async getUsers(@Query() params: QueryParamsModel, @Req() req: Request) {
    let userId = ''
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(' ')[1]
        //FIX
        const verifyedToken = await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET_KEY,
        })
        userId = verifyedToken.userId
    }
    // add userID
    return await this.postQueryRepository.getPosts(params, userId)
  }

  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createPost(@Body(BlogIdForPostValidationPipe) post: PostInputModel) {
    return await this.postService.addPost(post)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':postId')
  async deletePostById(@Param('postId', PostIdValidationPipe) id: string) {
    return await this.postService.deletePostById(id)
  }

  @Public()
  @Get(':postId')
  async getPostById(@Param('postId', PostIdValidationPipe) id: string, @Req() req: Request) {
    let userId = ''
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(' ')[1]
        //FIX
        const verifyedToken = await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET_KEY,
        })
        userId = verifyedToken.userId
    }
    // userID
    return await this.postQueryRepository.getPostgById(id, userId)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':postId')
  async updatePostById(@Param('postId', PostIdValidationPipe) id: string, @Body() post: PostInputModel) {
    return await this.postService.updatePostById(id, post) 
  }

  //add comment valid
  @HttpCode(HttpStatusCode.CREATED_201)
  @Post(':postId/comments')
  async createComment(@Param('postId', PostIdValidationPipe) postId: string, @Body() content: CommentInputModel) {
    return await this.postService.createComment('id', 'login', content.content, postId)
  }

  @Public()
  @Get(':postId/comments')
  async getCommentForSpecifedPost(@Param('postId', PostIdValidationPipe) postId: string, @Query() params: QueryParamsModel,@Req() req: Request) {
    let userId = ''
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(' ')[1]
        //FIX
        const verifyedToken = await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET_KEY,
        })
        userId = verifyedToken.userId
    }
    // userId
    return await this.postQueryRepository.getCommentsForSpecifiedPost(postId, params, userId)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put('/:postId/like-status')
  async updateLikeStatus(@Param('postId', PostIdValidationPipe) postId: string, @Body() likeStatus: {likeStatus: string}, @Req() req: AccessTokenVrifyModel) {
    return await this.postService.updatePostLikeStatus(postId, likeStatus.likeStatus, req.user.userId, req.user.login)
  }
}