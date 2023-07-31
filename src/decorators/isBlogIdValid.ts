import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogQueryRepository } from 'src/queryRepositories/blog.query-repository';

@ValidatorConstraint({ name: 'IsBlogIdValid', async: false })
@Injectable()
export class IsBlogIdValidConstraint implements ValidatorConstraintInterface {
  constructor(private blogQueryRepository: BlogQueryRepository) {}

  async validate(blogId: string) {
    return await this.blogQueryRepository.getBlogByIdNoView(blogId);
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
      validator: IsBlogIdValidConstraint,
    });
  };
}

