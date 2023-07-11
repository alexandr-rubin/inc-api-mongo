import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
  @Prop()
  commentId!: string
  @Prop()
  userId!: string
  @Prop()
  likeStatus!: string
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike)

export type PostLikeDocument = HydratedDocument<PosttLike>;

@Schema()
export class PosttLike {
  @Prop()
  postId!: string
  @Prop()
  userId!: string
  @Prop()
  login!: string
  @Prop()
  addedAt!: string
  @Prop()
  likeStatus!: string
}

export const PostLikeSchema = SchemaFactory.createForClass(PosttLike)