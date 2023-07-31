import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { PostInputModel } from "../models/Post";
import { PostService } from "../domain/post.service";
import { PostQueryRepository } from "../queryRepositories/post.query-repository";
import { QueryParamsModel } from "../models/PaginationQuery";
import { CommentInputModel } from "../models/Comment";
import { BlogIdForPostValidationPipe } from "../validation/pipes/body-blog-id-validation.pipe";
import { PostIdValidationPipe } from "../validation/pipes/post-Id-validation.pipe";
import { AccessTokenVrifyModel } from "../models/Auth";
import { Request } from 'express'
import { Public } from "../decorators/public.decorator";
import { JwtAuthService } from "../domain/JWT.service";
import { BasicAuthGuard } from "../guards/basic-auth.guard";
import { likeStatusValidation } from "../validation/likeStatus";

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository, private readonly jwtAuthService: JwtAuthService){}
  @Public()
  @Get()
  async getUsers(@Query() params: QueryParamsModel, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    // add userID
    return await this.postQueryRepository.getPosts(params, userId)
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createPost(@Body(BlogIdForPostValidationPipe) post: PostInputModel) {
    return await this.postService.addPost(post)
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':postId')
  async deletePostById(@Param('postId', PostIdValidationPipe) id: string) {
    return await this.postService.deletePostById(id)
  }

  @Public()
  @Get(':postId')
  async getPostById(@Param('postId', PostIdValidationPipe) id: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    // userID
    return await this.postQueryRepository.getPostgById(id, userId)
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':postId')
  async updatePostById(@Param('postId', PostIdValidationPipe) id: string, @Body() post: PostInputModel) {
    return await this.postService.updatePostById(id, post) 
  }

  //add comment valid
  @HttpCode(HttpStatusCode.CREATED_201)
  @Post(':postId/comments')
  async createComment(@Param('postId', PostIdValidationPipe) postId: string, @Body() content: CommentInputModel, @Req() req: AccessTokenVrifyModel) {
    return await this.postService.createComment(req.user.userId, req.user.login, content.content, postId)
  }

  @Public()
  @Get(':postId/comments')
  async getCommentForSpecifedPost(@Param('postId', PostIdValidationPipe) postId: string, @Query() params: QueryParamsModel,@Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    // userId
    return await this.postQueryRepository.getCommentsForSpecifiedPost(postId, params, userId)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put('/:postId/like-status')
  async updateLikeStatus(@Param('postId', PostIdValidationPipe) postId: string, @Body() likeStatus: likeStatusValidation, @Req() req: AccessTokenVrifyModel) {
    return await this.postService.updatePostLikeStatus(postId, likeStatus.likeStatus, req.user.userId, req.user.login)
  }
}