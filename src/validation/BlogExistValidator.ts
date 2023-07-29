import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogQueryRepository } from '../queryRepositories/blog.query-repository';

@ValidatorConstraint({ async: true })
export class BlogExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}

  async validate(blogId: string) {
    const blog = await this.blogQueryRepository.getBlogById(blogId);
    return !!blog;
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog with id "${args.value}" does not exist.`;
  }
}