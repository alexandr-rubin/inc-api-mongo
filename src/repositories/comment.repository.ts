import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentDocument, CommentInputModel, Comment } from "src/models/Comment";

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
}