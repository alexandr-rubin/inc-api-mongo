import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
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

export class BlogInputModel {
  @Prop()
  name!: string
  @Prop()
  description!: string
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