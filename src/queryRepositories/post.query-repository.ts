import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery, createPaginationResult } from "../helpers/pagination";
import { Post, PostDocument, PostViewModel } from "../models/Post";
import { LikeStatuses } from "../helpers/likeStatuses";

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>){}
  async getPosts(params: QueryParamsModel, userId: string): Promise<Paginator<PostViewModel>> {
    // fix
    const query = createPaginationQuery(params)
        const skip = (query.pageNumber - 1) * query.pageSize
        const posts = await this.postModel.find(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}}).select('-__v')
        .sort({[query.sortBy]: query.sortDirection === 'asc' ? 1 : -1})
        .skip(skip).limit(query.pageSize).lean()
        const count = await this.postModel.countDocuments(query.searchNameTerm === null ? {} : {name: {$regex: query.searchNameTerm, $options: 'i'}})
        //
        const transformedPosts = posts.map((post) => {
          const { _id, ...rest } = post
          const id = _id.toString()
          return { id, ...rest }
        })
        const result = createPaginationResult(count, query, transformedPosts)

        return await this.editPostToViewModel(result, userId)
  }

  async getPostgById(postId: string): Promise<PostViewModel | null> {
    const like = null/* await this.postLikeModel.findOne({postId: postId , userId: userId}).lean() */
        const likeStatus = like === null ? LikeStatuses.None : like.likeStatus
        const post = await this.postModel.findById(postId)
        if(!post){
          return null
        }
        const objPost = post.toJSON()
        const newestLikes = (post.likesAndDislikes.filter((element) => element.likeStatus === 'Like')).slice(-3).map((element) => element)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, likesAndDislikesCount, likesAndDislikes, ...rest } = {...objPost, extendedLikesInfo: {likesCount: post.likesAndDislikesCount.likesCount, dislikesCount: post.likesAndDislikesCount.dislikesCount, 
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
      const newestLikes = (post.items[i].likesAndDislikes.filter((element) => element.likeStatus === 'Like')).slice(-3).map((element) => element)
      newArray.items[i].extendedLikesInfo.newestLikes = newestLikes
      // const status = await this.postLikeModel.findOne({createdAt: newArray.items[i].createdAt, userId: userId})
      const status = post.items[i].likesAndDislikes.find(element => element.userId === userId)
      if(status){
          newArray.items[i].extendedLikesInfo.myStatus = status.likeStatus
      }
    }
    return newArray 
}
}