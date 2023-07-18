import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  content!: string
  @Prop({type: {
    userId: String,
    userLogin: String
  }})
  commentatorInfo!: {userId: string, userLogin: string}
  @Prop()
  createdAt!: string
  @Prop()
  postId!: string
  @Prop({type: {
    likesCount: Number, 
    dislikesCount: Number
  }})
  likesAndDislikesCount!: { likesCount: number, dislikesCount: number }
  @Prop({ default: () => [] })
  likesAndDislikes!: CommentLike[]
}

@Schema()
export class CommentLike {
  @Prop()
  commentId!: string
  @Prop()
  userId!: string
  @Prop()
  likeStatus!: string
}

export class CommentViewModel {
  @Prop()
  id!: string
  @Prop()
  content!: string
  @Prop({type: {
    userId: String,
    userLogin: String
  }})
  commentatorInfo!: {userId: string, userLogin: string}
  @Prop()
  createdAt!: string
  @Prop({type: {
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String
  }})
  likesInfo: {likesCount: number, dislikesCount: number, myStatus: string}
}

export class CommentInputModel {
  @IsString()
  @Length(20, 300)
  @Prop()
  content!: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)