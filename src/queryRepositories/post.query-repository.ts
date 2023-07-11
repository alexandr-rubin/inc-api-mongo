import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Paginator } from "../models/Paginator";
import { QueryParamsModel } from "../models/PaginationQuery";
import { createPaginationQuery, createPaginationResult } from "../helpers/pagination";
import { Post, PostDocument, PostViewModel } from "../models/Post";
import { PostLikeDocument } from "../models/Like";
import { LikeStatuses } from "../helpers/likeStatuses";

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(Post.name) private postLikeModel: Model<PostLikeDocument>){}
  async getPosts(params: QueryParamsModel, userId: string): Promise<Paginator<Post>> {
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
        const newestLikes = await this.postLikeModel.find({postId: postId, likeStatus: LikeStatuses.Like}, { __v: false }).sort({ date: -1, login: -1 }).limit(3).lean()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, ...rest } = {...objPost, extendedLikesInfo: {likesCount: post.extendedLikesInfo.likesCount, dislikesCount: post.extendedLikesInfo.dislikesCount, 
        myStatus: likeStatus, newestLikes: newestLikes }}
        const id = _id.toString()
        return { id, ...rest }
  }

  public async editPostToViewModel(post: Paginator<Post>, userId: string): Promise<Paginator<PostViewModel>>  {
    const newArray: Paginator<PostViewModel> = {...post, items: post.items.map(({...rest }) => ({
        ...rest,
        extendedLikesInfo: { likesCount: rest.extendedLikesInfo.likesCount, dislikesCount: rest.extendedLikesInfo.dislikesCount, 
          myStatus: LikeStatuses.None.toString(), newestLikes: [] }
    }))}
    for(let i = 0; i < newArray.items.length; i++){
        const newestLikes = await this.postLikeModel.find({createdAt: newArray.items[i].createdAt, likeStatus: LikeStatuses.Like}).sort({ addedAt: -1 }).select('-_id -__v -id -postId -likeStatus').limit(3).lean()
        if(newestLikes){
            newArray.items[i].extendedLikesInfo.newestLikes = newestLikes
        }
        const status = await this.postLikeModel.findOne({createdAt: newArray.items[i].createdAt, userId: userId})
        if(status){
            newArray.items[i].extendedLikesInfo.myStatus = status.likeStatus
        }
    }
    return newArray 
}
}