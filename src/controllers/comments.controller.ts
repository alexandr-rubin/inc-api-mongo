import { Body, Controller, Delete, Get, HttpCode, Param, Put, Req, UseGuards } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentService } from "../domain/comment.service";
import { CommentInputModel } from "../models/Comment";
import { CommentIdValidationPipe } from "../validation/pipes/comment-Id-validation.pipe";
import { Request } from 'express'
import { AccessTokenVrifyModel } from "../models/Auth";
import { JwtAuthService } from "../domain/JWT.service";
import { likeStatusValidation } from "../validation/likeStatus";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository, private readonly commentService: CommentService, private readonly jwtAuthService: JwtAuthService){}
  @Get(':commentId')
  async getCommentById(@Param('commentId', CommentIdValidationPipe) id: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    return await this.commentQueryRepository.getCommentById(id, userId)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':commentId')
  async deleteCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    return await this.commentService.deleteCommentById(commentId, userId)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put(':commentId')
  async updateCommentById(@Param('commentId', CommentIdValidationPipe) commentId: string, @Body() comment: CommentInputModel, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    return await this.commentService.updateCommentById(commentId, comment, userId) 
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put('/:commentId/like-status')
  async updateLikeStatus(@Param('commentId', CommentIdValidationPipe) commentId: string, @Body() likeStatus: likeStatusValidation, @Req() req: AccessTokenVrifyModel) {
    return await this.commentService.updatePostLikeStatus(commentId, likeStatus.likeStatus, req.user.userId)
  }
}