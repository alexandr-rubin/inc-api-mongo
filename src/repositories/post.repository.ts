import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument, PostInputModel } from "../models/Post";
import { Blog, BlogDocument } from "src/models/Blogs";
import { Comment, CommentDocument } from "src/models/Comment";

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  @InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async addPost(post: Post): Promise<PostDocument>{
    const newPost = new this.postModel(post)
    const save = (await newPost.save()).toJSON()
    return save
  }

  async createComment(comment: Comment){
    const newComment = new this.commentModel(comment)
    await newComment.save()
    return newComment
  }

  async deletePostById(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndDelete(id)
    return !!result
  }

  async updatePostById(id: string, post: PostInputModel): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(id, post)
    return !!result
  }

  async deletePostsTesting(): Promise<boolean> {
    const result = await this.postModel.deleteMany({})
    return !!result
  }
}