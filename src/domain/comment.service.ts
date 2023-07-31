import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeStatuses } from "../helpers/likeStatuses";
import { Comment, CommentDocument, CommentInputModel } from "../models/Comment";
import { CommentQueryRepository } from "../queryRepositories/comment.query-repository";
import { CommentRepository } from "../repositories/comment.repository";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, private commentRepository: CommentRepository,
  private commentQueryRepository: CommentQueryRepository){}

  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    const comment = await this.commentQueryRepository.getCommentByIdNoView(id)
    if(comment && comment.commentatorInfo.userId !== userId){
      throw new ForbiddenException()
    }
    
    const isDeleted = await this.commentRepository.deleteCommentById(id)
    if(!isDeleted){
      throw new NotFoundException()
    }
    return isDeleted
  }

  async updateCommentById(id: string, post: CommentInputModel, userId: string): Promise<boolean> {
    const comment = await this.commentQueryRepository.getCommentByIdNoView(id)
    if(comment && comment.commentatorInfo.userId !== userId){
      throw new ForbiddenException()
    }
    const isUpdated = await this.commentRepository.updateCommentById(id, post)
    if(!isUpdated){
      throw new NotFoundException()
    }
    return isUpdated
  }

  async deleteCommentTesting(): Promise<boolean> {
    const result = await this.commentRepository.deleteCommentTesting()
    return result
  }

  async updatePostLikeStatus(commentId: string, likeStatus: string, userId:string): Promise<boolean> {
    const comment = await this.commentQueryRepository.getCommentByIdNoView(commentId)
    if(!comment){
      throw new NotFoundException()
    }

    const like = comment.likesAndDislikes.find(likeOrDislike => likeOrDislike.userId === userId)

    if(!like){
      if(likeStatus === LikeStatuses.None){
        return true
      }
      comment.likesAndDislikes.push({userId: userId, addedAt: new Date().toISOString(), likeStatus: likeStatus})
      await this.commentRepository.updateFirstLike(likeStatus, comment)
      return true
    }
    if(like.likeStatus === likeStatus){
      return true
    }
    if(likeStatus === LikeStatuses.None){
      await this.commentRepository.updateNoneLikeStatus(like.likeStatus, likeStatus, commentId, userId)
      return true
    }
    if(like.likeStatus !== likeStatus){
      await this.commentRepository.updateLikeStatus(like.likeStatus, likeStatus, commentId, userId)
      return true
    }

    return true
  }
}