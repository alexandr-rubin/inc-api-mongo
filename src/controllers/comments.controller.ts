import { Body, Controller, Delete, Get, Param, Put, Res } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentService } from "src/domain/comment.service";
import { CommentInputModel } from "src/models/Comment";
import { IdValidationPipe } from "src/validation/pipes/params-id-custom-validation.pipe";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository, private readonly commentService: CommentService){}
  @Get(':commentId')
  async getCommentById(@Param('commentId', IdValidationPipe) id: string, @Res() res: Response) {
    const result = await this.commentQueryRepository.getCommentById(id, '')
    if(!result){
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result)
  }

  @Delete(':commentId')
  async deleteCommentById(@Param('commentId', IdValidationPipe) commentId: string, @Res() res: Response) {
    const isDeleted = await this.commentService.deleteCommentById(commentId)
    if(!isDeleted)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }

  @Put(':commentId')
  async updateCommentById(@Param('commentId', IdValidationPipe) commentId: string, @Body() comment: CommentInputModel, @Res() res: Response) {
    const isUpdated = await this.commentService.updateCommentById(commentId, comment)
    if(!isUpdated)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204) 
  }
}