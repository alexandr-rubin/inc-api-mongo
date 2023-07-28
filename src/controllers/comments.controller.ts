import { Body, Controller, Delete, Get, HttpCode, Param, Put, Req } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentService } from "src/domain/comment.service";
import { CommentInputModel } from "src/models/Comment";
import { CommentIdValidationPipe } from "src/validation/pipes/comment-Id-validation.pipe";
import { Public } from "src/decorators/public.decorator";
import { Request } from 'express'
import { AccessTokenVrifyModel } from "src/models/Auth";
import { JwtAuthService } from "src/domain/JWT.service";

@Controller('comments')
export class CommentController {
  constructor(private readonly commentQueryRepository: CommentQueryRepository, private readonly commentService: CommentService, private readonly jwtAuthService: JwtAuthService){}
  @Public()
  @Get(':commentId')
  async getCommentById(@Param('commentId', CommentIdValidationPipe) id: string, @Req() req: Request) {
    let userId = ''
    const bearer = req.headers.authorization
    if(bearer){
      userId = await this.jwtAuthService.verifyToken(bearer)
    }
    // userID
    return await this.commentQueryRepository.getCommentById(id, userId)
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

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Put('/:commentId/like-status')
  async updateLikeStatus(@Param('commentId', CommentIdValidationPipe) commentId: string, @Body() likeStatus: {likeStatus: string}, @Req() req: AccessTokenVrifyModel) {
    return await this.commentService.updatePostLikeStatus(commentId, likeStatus.likeStatus, req.user.userId)
  }
}