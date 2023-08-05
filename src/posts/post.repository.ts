import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LikeStatuses } from "../helpers/likeStatuses";
import { Comment, CommentDocument } from "../comments/models/schemas/Comment";
import { PostInputModel } from "./models/input/Post";
import { Post, PostDocument } from "./models/schemas/Post";

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
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

  private async incLike(postId: string){
    await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.likesCount': 1} })
  }

  private async decLike(postId: string){
    await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.likesCount': -1} })
  }

  private async incDisLike(postId: string){
    await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.dislikesCount': 1} })
  }

  private async decDisLike(postId: string){
    await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.dislikesCount': -1} })
  }
  private async updatePostLikeStatus(postId: string, likeStatus: string, userId: string) {
    const post = await this.postModel.findOne({_id: postId})
    const like = post.likesAndDislikes.find(likeOrDislike => likeOrDislike.userId === userId)
    like.likeStatus = likeStatus
    post.markModified('likesAndDislikes')
    await post.save()
  }

  async updateFirstLike(likeStatus: string, post: PostDocument) {
    await post.save()
    if(likeStatus === LikeStatuses.Like){
      await this.incLike(post.id)
    }
    else{
      await this.incDisLike(post.id)
    }
  }

  async updateNoneLikeStatus(likeLikeStatus: string, likeStatus:string, postId: string, userId: string){
    if(likeLikeStatus === LikeStatuses.Like){
      await this.decLike(postId)
      await this.updatePostLikeStatus(postId, likeStatus, userId)
    }
    else if(likeLikeStatus === LikeStatuses.Dislike){
      await this.decDisLike(postId)
      await this.updatePostLikeStatus(postId, likeStatus, userId)
    }

    return true
  }

  async updateLikeStatus(likeLikeStatus: string, likeStatus: string, postId: string, userId: string) {
    if(likeLikeStatus === LikeStatuses.None){
      if(likeStatus === LikeStatuses.Like){
        await this.incLike(postId)
      }
      else{
        await this.incDisLike(postId)
      }
    }
    else if(likeStatus === LikeStatuses.Like){
        await this.incLike(postId)
        await this.decDisLike(postId)
    }
    else{
        await this.decLike(postId)
        await this.incDisLike(postId)
    }
    await this.updatePostLikeStatus(postId, likeStatus, userId)
    return true
  }

//   async updatessPostLikeStatus(postId: string, likeStatus: string, userId:string, login: string): Promise<boolean> {
//     const post = await this.postModel.findById(postId)
//     if(!post){
//       return false
//     }
//     const like = post.likesAndDislikes.find(likeOrDislike => likeOrDislike.userId === userId)
//     if(!like){
//       post.likesAndDislikes.push({userId: userId, login: login, addedAt: new Date().toISOString(), likeStatus: likeStatus})
//       if(likeStatus === 'Like'){
//         await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.likesCount': 1} })
//           //post.likesAndDislikesCount.likesCount +=1
//       }
//       else{
//         await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.dislikesCount': 1} })
//           // post.likesAndDislikesCount.dislikesCount +=1
//       }
//       //await post.save()
      
//       return true
//     }
//     if(like.likeStatus === likeStatus){
//         return true
//     }
//     if(likeStatus === 'None'){
//         if(like.likeStatus === 'Like'){
//           await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.likesCount': -1} })
//             //post.likesAndDislikesCount.likesCount -= 1
//         }
//         else if(like.likeStatus === 'Dislike'){
//           await this.postModel.updateOne({_id: postId}, {$inc: {'likesAndDislikesCount.dislikesCount': -1} })
//             //post.likesAndDislikesCount.dislikesCount -= 1
//         }
//         like.likeStatus = likeStatus
//         post.markModified('likesAndDislikes')
//         await post.save()
//         return true
//     }
//     if(like.likeStatus !== likeStatus){
//         if(like.likeStatus === 'None'){
//           if(likeStatus === 'Like'){
//             post.likesAndDislikesCount.likesCount += 1
//           }
//           else{
//             post.likesAndDislikesCount.dislikesCount += 1
//           }
//         }
//         else if(likeStatus === 'Like'){
//             post.likesAndDislikesCount.likesCount += 1
//             post.likesAndDislikesCount.dislikesCount -= 1
//         }
//         else{
//             post.likesAndDislikesCount.likesCount -= 1
//             post.likesAndDislikesCount.dislikesCount += 1
//         }
//         like.likeStatus = likeStatus
//         post.markModified('likesAndDislikes')
//         await post.save()
//         return true
//     }
//     return true
// }
}