import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from 'src/controllers/blogs.controller';
import { BlogService } from 'src/domain/blog.service';
import { Blog, BlogSchema } from 'src/models/Blogs';
import { BlogQueryRepository } from 'src/queryRepositories/blog.query-repository';
import { BlogRepository } from 'src/repositories/blog.repository';
import { BlogExistValidator } from 'src/validation/BlogExistValidator';
import { PostsModule } from './posts.module';
import { BlogIdForPostValidationPipe } from 'src/validation/pipes/body-blog-id-validation.pipe';

@Module({
  imports: [
    //
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
],
  controllers: [BlogsController],
  providers: [BlogService, BlogQueryRepository, BlogRepository, BlogExistValidator, BlogIdForPostValidationPipe],
  exports: [BlogService, BlogQueryRepository, BlogRepository, BlogExistValidator, BlogIdForPostValidationPipe, MongooseModule],
})
export class BlogsModule {}
