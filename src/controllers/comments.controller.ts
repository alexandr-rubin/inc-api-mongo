import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HttpStatusCode } from "src/helpers/httpStatusCode";
import { Response } from "express";
import { CommentQueryRepository } from "src/queryRepositories/comment.query-repository";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository){}
  @Get(':id')
  async getCommentById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.commentQueryRepository.getCommentById(id, '')
    if(!result){
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result)
  }
}