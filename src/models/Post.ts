import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Matches, MaxLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { IsBlogIdValid } from '../decorators/IsBlogIdValid';

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
  likesAndDislikesCount!: { likesCount: number, dislikesCount: number }
  @Prop({ default: () => [] })
  likesAndDislikes!: PostLike[]
}

export class PostLike {
  @Prop()
  userId!: string
  @Prop()
  login!: string
  @Prop()
  addedAt!: string
  @Prop()
  likeStatus!: string
}


export class PostInputModel {
  @IsString()
  @MaxLength(30)
  @Matches(/[^ ]+/, { message: 'Name field should not contain only whitespaces' })
  title!: string
  @IsString()
  @MaxLength(100)
  @Matches(/[^ ]+/, { message: 'Name field should not contain only whitespaces' })
  shortDescription!: string
  @IsString()
  @MaxLength(1000)
  @Matches(/[^ ]+/, { message: 'Name field should not contain only whitespaces' })
  content!: string
  @IsString()
  // @IsBlogIdValid()
  blogId!: string
}

export class PostForSpecBlogInputModel {
  @IsString()
  @MaxLength(30)
  @Prop()
  title!: string
  @IsString()
  @MaxLength(100)
  @Prop()
  shortDescription!: string
  @IsString()
  @MaxLength(1000)
  @Prop()
  content!: string
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