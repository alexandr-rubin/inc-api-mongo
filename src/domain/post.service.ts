import { Injectable, NotFoundException } from "@nestjs/common";
import { Post, PostInputModel, PostViewModel } from "../models/Post";
import { PostRepository } from "../repositories/post.repository";
import { Comment, CommentViewModel } from "src/models/Comment";
import { LikeStatuses } from "../helpers/likeStatuses";
import { BlogQueryRepository } from "../queryRepositories/blog.query-repository";
import { PostQueryRepository } from "../queryRepositories/post.query-repository";

@Injectable()
export class PostService {///////////
  constructor(private postRepository: PostRepository, private blogQueryRepository: BlogQueryRepository, private postQueryRepository: PostQueryRepository){}

  async addPost(post: PostInputModel): Promise<PostViewModel>{
    //
    const blog = await this.blogQueryRepository.getBlogById(post.blogId)
    if(!blog){
      throw new NotFoundException('Blog is not found')
    }
    const newPost: Post = {...post, blogName: blog.name, createdAt: new Date().toISOString(),
    likesAndDislikesCount: { likesCount: 0, dislikesCount: 0}, likesAndDislikes: []}
    const savedPost = await this.postRepository.addPost(newPost)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, _id, likesAndDislikesCount, likesAndDislikes, ...result } = {id: savedPost._id.toString(), ...savedPost, extendedLikesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [/*{ addedAt: '', login: '', userId: ''}*/]}}
    return result
  }

  async deletePostById(id: string): Promise<boolean> {
    const isDeleted = await this.postRepository.deletePostById(id)
    if(!isDeleted){
      throw new NotFoundException()
    }
    return isDeleted
  }

  async updatePostById(id: string, post: PostInputModel): Promise<boolean> {
    const isUpdated = await this.postRepository.updatePostById(id, post)
    if(!isUpdated){
      throw new NotFoundException()
    }
    return isUpdated
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
    const {postId, _id, __v, likesAndDislikesCount, likesAndDislikes, ...result} = 
    ({id: savedComment._id, ...savedComment, commentatorInfo: 
    {userId: savedComment.commentatorInfo.userId, userLogin: savedComment.commentatorInfo.userLogin}, 
    likesInfo: {likesCount: savedComment.likesAndDislikesCount.likesCount, 
    dislikesCount: savedComment.likesAndDislikesCount.dislikesCount , myStatus: LikeStatuses.None}})

    return result
  }

  async updatePostLikeStatus(postId: string, likeStatus: string, userId:string, login: string): Promise<boolean> {
    const post = await this.postQueryRepository.getPostgByIdNoView(postId)
    if(!post){
      throw new NotFoundException()
    }

    const like = post.likesAndDislikes.find(likeOrDislike => likeOrDislike.userId === userId)

    if(!like){
      if(likeStatus === LikeStatuses.None){
        return true
      }
      post.likesAndDislikes.push({userId: userId, login: login, addedAt: new Date().toISOString(), likeStatus: likeStatus})
      await this.postRepository.updateFirstLike(likeStatus, post)
      return true
    }
    if(like.likeStatus === likeStatus){
      return true
    }
    if(likeStatus === LikeStatuses.None){
      await this.postRepository.updateNoneLikeStatus(like.likeStatus, likeStatus, postId, userId)
      return true
    }
    if(like.likeStatus !== likeStatus){
      await this.postRepository.updateLikeStatus(like.likeStatus, likeStatus, postId, userId)
      return true
    }

    return true
  }
}