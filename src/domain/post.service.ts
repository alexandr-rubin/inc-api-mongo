import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument, PostInputModel, PostViewModel } from "../models/Post";
import { Blog, BlogDocument } from "src/models/Blogs";
import { PostRepository } from "src/repositories/post.repository";
import { Comment, CommentViewModel } from "src/models/Comment";
import { LikeStatuses } from "src/helpers/likeStatuses";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  private postRepository: PostRepository){}

  async addPost(post: PostInputModel): Promise<PostViewModel>{
    const blog = await this.blogModel.findById(post.blogId, { __v: false })
    const newPost: Post = {...post, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: []}
    const savedPost = await this.postRepository.addPost(newPost)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: savedPost._id.toString(), ...savedPost, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }

  async deletePostById(id: string): Promise<boolean> {
    const result = await this.postRepository.deletePostById(id)
    return result
  }

  async updatePostById(id: string, post: PostInputModel): Promise<boolean> {
    const result = await this.postRepository.updatePostById(id, post)
    return result
  }

  async deletePostsTesting(): Promise<boolean> {
    const result = await this.postRepository.deletePostsTesting()
    return result
  }

  async createComment(userId: string, userLogin: string, content: string, pId: string): Promise<CommentViewModel | null> {
    const comment: Comment = {content: content, commentatorInfo: {userId: userId, userLogin: userLogin}, createdAt: new Date().toISOString(), postId: pId,
    likesAndDislikesCount: {likesCount: 0, dislikesCount: 0}, likesAndDislikes: []}

    const savedComment = (await this.postRepository.createComment(comment)).toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {postId, _id, __v, likesAndDislikesCount, likesAndDislikes, ...result} = ({id: savedComment._id, ...savedComment, commentatorInfo: {userId: savedComment.commentatorInfo.userId, userLogin: savedComment.commentatorInfo.userLogin}, likesInfo: {likesCount: savedComment.likesAndDislikesCount.likesCount, 
    dislikesCount: savedComment.likesAndDislikesCount.dislikesCount , myStatus: LikeStatuses.None}})

    return result
}
}