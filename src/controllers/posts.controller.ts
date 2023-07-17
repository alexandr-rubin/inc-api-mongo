import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { PostInputModel } from "../models/Post";
import { PostService } from "../domain/post.service";
import { PostQueryRepository } from "../queryRepositories/post.query-repository";
import { QueryParamsModel } from "../models/PaginationQuery";
import { CommentInputModel } from "src/models/Comment";

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository){}
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    // add userID
    return await this.postQueryRepository.getPosts(params, '')
  }

  @Post()
  async createPost(@Body() post: PostInputModel) {
    return await this.postService.addPost(post)
  }

  @Delete(':id')
  async deletePostById(@Param('id') id: string, @Res() res: Response) {
    const isDeleted = await this.postService.deletePostById(id)
    if(!isDeleted)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.postQueryRepository.getPostgById(id, '')
    if(!result){
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result)
  }

  @Put(':id')
  async updatePostById(@Param('id') id: string, @Body() post: PostInputModel, @Res() res: Response) {
    const isUpdated = await this.postService.updatePostById(id, post)
    if(!isUpdated)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204) 
  }

  //add comment valid
  @Post(':postId/comments')
  async createComment(@Param('postId') postId: string, @Body() content: CommentInputModel) {
    return await this.postService.createComment('id', 'login', content.content, postId)
  }

  @Get(':postId/comments')
  async getCommentForSpecifedPost(@Param('postId') postId: string, @Query() params: QueryParamsModel) {
    return await this.postQueryRepository.getCommentsForSpecifiedPost(postId, params, 'userId')
  }
}