import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { BlogExistValidator } from './BlogExistValidator';

@Injectable()
export class BlogIdValidationPipe implements PipeTransform {
  constructor(private readonly blogExistValidator: BlogExistValidator) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && metadata.data === 'blogId') {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      if (!isValidObjectId) {
        throw new NotFoundException('Invalid blogId. It should be a valid ObjectId.')
      }

      const isValid = await this.blogExistValidator.validate(value);
      if (!isValid) {
        throw new NotFoundException(`Blog with id "${value}" does not exist.`);
      }
    }

    return value;
  }
}