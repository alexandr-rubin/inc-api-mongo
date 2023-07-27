import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument, CommentInputModel } from "src/models/Comment";
import { CommentRepository } from "src/repositories/comment.repository";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, private commentRepository: CommentRepository){}

  async deleteCommentById(id: string): Promise<boolean> {
    const isDeleted = await this.commentRepository.deleteCommentById(id)
    if(!isDeleted){
      throw new NotFoundException()
    }
    return isDeleted
  }

  async updateCommentById(id: string, post: CommentInputModel): Promise<boolean> {
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
}