import { Body, Controller, Delete, Get, Param, Put, Res } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentService } from "src/domain/comment.service";
import { CommentInputModel } from "src/models/Comment";
import { CommentIdValidationPipe } from "src/validation/comment-custom-validation.pipe";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository, private readonly commentService: CommentService){}
  @Get(':commentId')
  async getCommentById(@Param('commentId', CommentIdValidationPipe) id: string, @Res() res: Response) {
    const result = await this.commentQueryRepository.getCommentById(id, '')

    return res.status(HttpStatusCode.OK_200).send(result)
  }

  @Delete(':commentId')
  async deleteCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string, @Res() res: Response) {
    await this.commentService.deleteCommentById(commentId)

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }

  @Put(':commentId')
  async updateCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string, @Body() comment: CommentInputModel, @Res() res: Response) {
    await this.commentService.updateCommentById(commentId, comment)

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204) 
  }
}