import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogQueryRepository } from '../queryRepositories/blog.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/models/Post';
import { Model } from 'mongoose';
import { PostService } from 'src/domain/post.service';
import { PostRepository } from 'src/repositories/post.repository';
import { BlogService } from 'src/domain/blog.service';
import { CommentService } from 'src/domain/comment.service';
import { BlogExistValidator } from 'src/validation/BlogExistValidator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBlogIdValidConstraint implements ValidatorConstraintInterface {
  constructor(private blogExistValidator: BlogExistValidator /*private blogQueryRepository: BlogQueryRepository*/ /*private postRepository: PostService*/) {}

  async validate(blogId: string) {
    //return await this.blogQueryRepository.getBlogByIdNoView(blogId);
    return true
  }

  defaultMessage() {
    return 'Blog with id does not exist.';
  }
}

export function IsBlogIdValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogIdValidConstraint,
    });
  };
}

