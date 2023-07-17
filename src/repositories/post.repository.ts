import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "../models/Post";
import { Blog, BlogDocument } from "src/models/Blogs";
import { Comment, CommentDocument } from "src/models/Comment";

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  @InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  // типизация
  async addPost(post: Post){
    const newPost = new this.postModel(post)
    await newPost.save()
    return newPost
  }

  async createComment(comment: Comment){
    const newComment = new this.commentModel(comment)
    await newComment.save()
    return newComment
  }
}