import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Matches, MaxLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop()
  name!: string
  @Prop()
  description!: string
  @Prop()
  websiteUrl!: string
  @Prop()
  createdAt!: string
  @Prop()
  isMembership!: boolean
}

export class BlogInputModel {
  @IsString()
  @MaxLength(15)
  @Prop()
  name!: string
  @IsString()
  @MaxLength(500)
  @Prop()
  description!: string
  @IsString()
  @MaxLength(100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: 'Invalid website URL format',
  })
  @Prop()
  websiteUrl!: string
}

export class BlogViewModel {
  @Prop()
  id!: string
  @Prop()
  name!: string
  @Prop()
  description!: string
  @Prop()
  websiteUrl!: string
  @Prop()
  createdAt!: string
  @Prop()
  isMembership!: boolean
}

export const BlogSchema = SchemaFactory.createForClass(Blog)