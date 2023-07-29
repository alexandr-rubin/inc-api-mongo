import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery } from "../helpers/pagination";
import { Post, PostDocument, PostViewModel } from "../models/Post";
import { LikeStatuses } from "../helpers/likeStatuses";
import { Comment, CommentDocument, CommentViewModel } from "../models/Comment";
import { WithId } from 'mongodb' 

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}
  async getPosts(params: QueryParamsModel, userId: string): Promise<Paginator<PostViewModel>> {
    // fix
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    const posts = await this.postModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}, {__v: false})
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip).limit(query.pageSize).lean()
    const count = await this.postModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
    //
    const transformedPosts = posts.map((post) => {
      const { _id, ...rest } = post
      const id = _id.toString()
      return { id, ...rest }
    })
    const result = Paginator.createPaginationResult(count, query, transformedPosts)

    return await this.editPostToViewModel(result, userId)
  }

  async getPostgById(postId: string, userId: string): Promise<PostViewModel | null> {
    const post = await this.postModel.findById(postId, { __v: false })
    if(!post){
      throw new NotFoundException()
    }
    const like = post.likesAndDislikes.find(like => like.userId === userId)
    const likeStatus = like === undefined ? LikeStatuses.None : like.likeStatus
    const objPost = post.toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newestLikes = (post.likesAndDislikes.filter((element) => element.likeStatus === 'Like')).slice(-3).map((element) => element).map(({ likeStatus, ...rest }) => rest)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, likesAndDislikesCount, likesAndDislikes, ...rest } = {...objPost, extendedLikesInfo: {likesCount: post.likesAndDislikesCount.likesCount, dislikesCount: post.likesAndDislikesCount.dislikesCount, 
    myStatus: likeStatus, newestLikes: newestLikes }}
    const id = _id.toString()
    return { id, ...rest }
  }

  public async editPostToViewModel(post: Paginator<Post>, userId: string): Promise<Paginator<PostViewModel>>  {
    const newArray: Paginator<PostViewModel> = {
      ...post,
      items: post.items.map(({ likesAndDislikesCount, ...rest }) => {
        delete rest.likesAndDislikes
        return {
          ...rest,
          extendedLikesInfo: {
            likesCount: likesAndDislikesCount.likesCount,
            dislikesCount: likesAndDislikesCount.dislikesCount,
            myStatus: LikeStatuses.None.toString(),
            newestLikes: []
          }
        };
      })
    };
    for(let i = 0; i < newArray.items.length; i++){
      //
      const newestLikes = post.items[i].likesAndDislikes
      .filter((element) => element.likeStatus === 'Like')
      .slice(-3)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ likeStatus, ...rest }) => rest)
      newArray.items[i].extendedLikesInfo.newestLikes = newestLikes
      // const status = await this.postLikeModel.findOne({createdAt: newArray.items[i].createdAt, userId: userId})
      const status = post.items[i].likesAndDislikes.find(element => element.userId === userId)
      if(status){
          newArray.items[i].extendedLikesInfo.myStatus = status.likeStatus
      }
    }
    return newArray 
  }

  async getCommentsForSpecifiedPost(postId: string, params: QueryParamsModel, userId: string): Promise<Paginator<CommentViewModel> | null>{
    const isFinded = await this.postModel.findById(postId)
    if(!isFinded){
      throw new NotFoundException()
    }
    const query = createPaginationQuery(params)
    const skip = (query.pageNumber - 1) * query.pageSize
    const comments = await this.commentModel.find({postId: postId}, {postId: false, __v: false})
    .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
    .skip(skip)
    .limit(query.pageSize).lean()
    const count = await this.commentModel.countDocuments({postId: postId})
    const result = Paginator.createPaginationResult(count, query, comments)

    return await this.editCommentToViewModel(result, userId)
  }

  private async editCommentToViewModel(comment: Paginator<WithId<Comment>>, userId: string): Promise<Paginator<CommentViewModel>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newArray = {...comment, items: comment.items.map(({ _id, likesAndDislikesCount, likesAndDislikes, ...rest }) => ({
        id: _id.toString(), ...rest, commentatorInfo: {userId: rest.commentatorInfo.userId, userLogin: rest.commentatorInfo.userLogin},
        likesInfo: { likesCount: likesAndDislikesCount.likesCount,  dislikesCount: likesAndDislikesCount.dislikesCount, myStatus: LikeStatuses.None.toString() }
    }))}
    for(let i = 0; i < newArray.items.length; i++){
        const status = comment.items[i].likesAndDislikes.find(element => element.userId === userId)
        if(status){
            newArray.items[i].likesInfo.myStatus = status.likeStatus
        }
    }
    return newArray
  }

  async getPostgByIdNoView(postId: string): Promise<PostDocument | null> {
    const post = await this.postModel.findById(postId)
    if(!post){
      return null
    }
    return post
  }
}