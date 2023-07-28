import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from 'src/controllers/posts.controller';
import { PostService } from 'src/domain/post.service';
import { Post, PostSchema } from 'src/models/Post';
import { PostQueryRepository } from 'src/queryRepositories/post.query-repository';
import { PostRepository } from 'src/repositories/post.repository';
import { PostExistValidator } from 'src/validation/PostExistValidator';
import { BlogsModule } from './blogs.module';
import { CommentsModule } from './comments.module';
import { JwtAuthService } from 'src/domain/JWT.service';

@Module({
  imports: [
    BlogsModule,
    CommentsModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
],
  controllers: [PostsController],
  providers: [PostService, PostQueryRepository, PostRepository, PostExistValidator, JwtAuthService],
  exports: [PostService, PostQueryRepository, PostRepository, PostExistValidator, MongooseModule],
})
export class PostsModule {}
