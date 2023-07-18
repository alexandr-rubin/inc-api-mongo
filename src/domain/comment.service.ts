import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument, CommentInputModel } from "src/models/Comment";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await this.commentModel.findByIdAndDelete(id)
    if(!result){
      throw new NotFoundException(`Comment with id "${id}" does not exist.`)
    }
    return !!result
  }

  async updateCommentById(id: string, post: CommentInputModel): Promise<boolean> {
    const result = await this.commentModel.findByIdAndUpdate(id, post)
    if(!result){
      throw new NotFoundException(`Comment with id "${id}" does not exist.`)
    }
    return !!result
  }

  async deleteCommentTesting(): Promise<boolean> {
    const result = await this.commentModel.deleteMany({})
    return !!result
  }
}