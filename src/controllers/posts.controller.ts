import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { PostInputModel } from "../models/Post";
import { PostService } from "../domain/post.service";
import { PostQueryRepository } from "../queryRepositories/post.query-repository";
import { QueryParamsModel } from "../models/PaginationQuery";
import { CommentInputModel } from "src/models/Comment";
import { BlogIdForPostValidationPipe } from "src/validation/pipes/body-blog-id-validation.pipe";
import { PostIdValidationPipe } from "src/validation/pipes/post-Id-validation.pipe";

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository){}
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    // add userID
    return await this.postQueryRepository.getPosts(params, '')
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

  @Get(':postId')
  async getPostById(@Param('postId', PostIdValidationPipe) id: string) {
    // userID
    return await this.postQueryRepository.getPostgById(id, '')
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

  @Get(':postId/comments')
  async getCommentForSpecifedPost(@Param('postId', PostIdValidationPipe) postId: string, @Query() params: QueryParamsModel) {
    // userId
    return await this.postQueryRepository.getCommentsForSpecifiedPost(postId, params, 'userId')
  }
}