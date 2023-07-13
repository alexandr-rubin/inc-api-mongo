import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  title!: string
  @Prop()
  shortDescription!: string
  @Prop()
  content!: string
  @Prop()
  blogId!: string
  @Prop()
  blogName!: string
  @Prop()
  createdAt!: string
  // откуда _id
  @Prop({type: {
    likesCount: Number, 
    dislikesCount: Number
  }})
  extendedLikesInfo: {likesCount: number, dislikesCount: number}
}

export class PostInputModel {
  @Prop()
  title!: string
  @Prop()
  shortDescription!: string
  @Prop()
  content!: string
  @Prop()
  blogId!: string
}

export class NewestLikes {
  @Prop()
  addedAt!: string
  @Prop()
  userId!: string
  @Prop()
  login!: string
}

export class PostViewModel {
  @Prop()
  title!: string
  @Prop()
  shortDescription!: string
  @Prop()
  content!: string
  @Prop()
  blogId!: string
  @Prop()
  blogName!: string
  @Prop()
  createdAt!: string
  @Prop({type: {
    likesCount: Number, 
    dislikesCount: Number,
    myStatus: String,
    newestLikes: [NewestLikes]
  }})
  extendedLikesInfo: {likesCount: number, dislikesCount: number, myStatus: string,
    newestLikes: NewestLikes[]}
}

export const PostSchema = SchemaFactory.createForClass(Post)