import { Body, Controller, Delete, Get, HttpCode, Param, Put } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentService } from "src/domain/comment.service";
import { CommentInputModel } from "src/models/Comment";
import { CommentIdValidationPipe } from "src/validation/pipes/comment-Id-validation.pipe";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository, private readonly commentService: CommentService){}
  @Get(':commentId')
  async getCommentById(@Param('commentId', CommentIdValidationPipe) id: string) {
    // userID
    return await this.commentQueryRepository.getCommentById(id, '')
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':commentId')
  async deleteCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string) {
    return await this.commentService.deleteCommentById(commentId)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':commentId')
  async updateCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string, @Body() comment: CommentInputModel) {
    return await this.commentService.updateCommentById(commentId, comment) 
  }
}