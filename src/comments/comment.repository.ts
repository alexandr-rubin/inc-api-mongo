import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeStatuses } from "../helpers/likeStatuses";
import { CommentInputModel } from "./models/input/CommentInputModel";
import { Comment, CommentDocument } from "./models/schemas/Comment";

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await this.commentModel.findByIdAndDelete(id)
    return !!result
  }

  async updateCommentById(id: string, post: CommentInputModel): Promise<boolean> {
    const result = await this.commentModel.findByIdAndUpdate(id, post)
    return !!result
  }

  async deleteCommentTesting(): Promise<boolean> {
    const result = await this.commentModel.deleteMany({})
    return !!result
  }

  private async incLike(commentId: string){
    await this.commentModel.updateOne({_id: commentId}, {$inc: {'likesAndDislikesCount.likesCount': 1} })
  }

  private async decLike(commentId: string){
    await this.commentModel.updateOne({_id: commentId}, {$inc: {'likesAndDislikesCount.likesCount': -1} })
  }

  private async incDisLike(commentId: string){
    await this.commentModel.updateOne({_id: commentId}, {$inc: {'likesAndDislikesCount.dislikesCount': 1} })
  }

  private async decDisLike(commentId: string){
    await this.commentModel.updateOne({_id: commentId}, {$inc: {'likesAndDislikesCount.dislikesCount': -1} })
  }
  private async updatePostLikeStatus(commentId: string, likeStatus: string, userId: string) {
    const comment = await this.commentModel.findOne({_id: commentId})
    const like = comment.likesAndDislikes.find(likeOrDislike => likeOrDislike.userId === userId)
    like.likeStatus = likeStatus
    comment.markModified('likesAndDislikes')
    await comment.save()
  }

  async updateFirstLike(likeStatus: string, comment: CommentDocument) {
    await comment.save()
    if(likeStatus === LikeStatuses.Like){
      await this.incLike(comment.id)
    }
    else{
      await this.incDisLike(comment.id)
    }
  }

  async updateNoneLikeStatus(likeLikeStatus: string, likeStatus:string, commentId: string, userId: string){
    if(likeLikeStatus === LikeStatuses.Like){
      await this.decLike(commentId)
      await this.updatePostLikeStatus(commentId, likeStatus, userId)
    }
    else if(likeLikeStatus === LikeStatuses.Dislike){
      await this.decDisLike(commentId)
      await this.updatePostLikeStatus(commentId, likeStatus, userId)
    }

    return true
  }

  async updateLikeStatus(likeLikeStatus: string, likeStatus: string, commentId: string, userId: string) {
    if(likeLikeStatus === LikeStatuses.None){
      if(likeStatus === LikeStatuses.Like){
        await this.incLike(commentId)
      }
      else{
        await this.incDisLike(commentId)
      }
    }
    else if(likeStatus === LikeStatuses.Like){
        await this.incLike(commentId)
        await this.decDisLike(commentId)
    }
    else{
        await this.decLike(commentId)
        await this.incDisLike(commentId)
    }
    await this.updatePostLikeStatus(commentId, likeStatus, userId)
    return true
  }
}