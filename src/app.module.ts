import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/User';
import { UserService } from './domain/user.service';
import { TestingController } from './controllers/testing.controller';
import { Blog, BlogSchema } from './models/Blogs';
import { BlogsController } from './controllers/blogs.controller';
import { BlogService } from './domain/blog.service';
import { UserQueryRepository } from './queryRepositories/user.query-repository';
import { BlogQueryRepository } from './queryRepositories/blog.query-repository';
import { PostService } from './domain/post.service';
import { PostsController } from './controllers/posts.controller';
import { Post, PostSchema } from './models/Post';
import { PostQueryRepository } from './queryRepositories/post.query-repository';
import { Comment, CommentSchema } from './models/Comment';
import { CommentController } from './controllers/comments.controller';
import { CommentQueryRepository } from './queryRepositories/comment.query-repository';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserRepository } from './repositories/user.repository';
import { PostRepository } from './repositories/post.repository';
import { BlogRepository } from './repositories/blog.repository';
import { CommentService } from './domain/comment.service';
import { BlogExistValidator } from './validation/BlogExistValidator';
import { BlogIdValidationPipe } from './validation/blog-custom-validation.pipe';
import { PostExistValidator } from './validation/PostExistValidator';
import { PostIdValidationPipe } from './validation/post-custom-validation.pipe';
import { CommentExistValidator } from './validation/CommentExistValidator';
import { CommentIdValidationPipe } from './validation/comment-custom-validation.pipe';

dotenv.config()


const MONGODB_URI = process.env.MONGODB_URI ||  'mongodb://localhost:27017/testDb'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  controllers: [AppController, UsersController, TestingController, BlogsController, PostsController, CommentController],
  providers: [AppService, UserService, BlogService, UserQueryRepository, BlogQueryRepository, PostService,
    PostQueryRepository, CommentQueryRepository, UserRepository,  PostRepository, BlogRepository, CommentService, 
    BlogExistValidator, BlogIdValidationPipe, PostExistValidator, PostIdValidationPipe, CommentExistValidator, CommentIdValidationPipe],
})
export class AppModule {}
