import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeStatuses } from "../helpers/likeStatuses";
import { Comment, CommentDocument, CommentViewModel } from "../models/Comment";

@Injectable()
export class CommentQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async getCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    const comment = await this.commentModel.findById(commentId, { __v: false, postId: false }).lean()
    const like = comment.likesAndDislikes.find(like => like.userId === userId)
    // const like = await this.commentLikeModel.findOne({commentId: commentId , userId: userId}).lean()
    const likeStatus = like === null ? LikeStatuses.None : like.likeStatus
    if (!comment){
      return null
    }
    // 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, likesAndDislikesCount, likesAndDislikes, ...rest } = {...comment, likesInfo: {likesCount: comment.likesAndDislikesCount.likesCount, dislikesCount: comment.likesAndDislikesCount.dislikesCount, myStatus: likeStatus}}
    const id = _id.toString()
    return { id, ...rest }
  }
}