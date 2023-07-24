import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument, CommentInputModel } from "src/models/Comment";
import { CommentRepository } from "src/repositories/comment.repository";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, private commentRepository: CommentRepository){}

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await this.commentRepository.deleteCommentById(id)
    return result
  }

  async updateCommentById(id: string, post: CommentInputModel): Promise<boolean> {
    const result = await this.commentRepository.updateCommentById(id, post)
    return result
  }

  async deleteCommentTesting(): Promise<boolean> {
    const result = await this.commentRepository.deleteCommentTesting()
    return result
  }
}