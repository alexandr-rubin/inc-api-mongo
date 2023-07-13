import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeStatuses } from "../helpers/likeStatuses";
import { Comment, CommentDocument, CommentViewModel } from "../models/Comment";
import { CommentLikeDocument } from "../models/Like";

@Injectable()
export class CommentQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, @InjectModel(Comment.name) private commentLikeModel: Model<CommentLikeDocument>){}

  async getCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    const like = await this.commentLikeModel.findOne({commentId: commentId , userId: userId}).lean()
    const likeStatus = like === null ? LikeStatuses.None : like.likeStatus
    const comment = await this.commentModel.findById(commentId, { __v: false, postId: false, _id: false }).lean()
    if (!comment){
      return null
    }
    // 
    const result = {...comment, likesInfo: {likesCount: comment.likesInfo.likesCount, dislikesCount: comment.likesInfo.dislikesCount, myStatus: likeStatus}}
    return result
  }
}