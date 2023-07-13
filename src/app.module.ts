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
import { CommentLike, CommentLikeSchema, PostLikeSchema, PosttLike } from './models/Like';
import { PostQueryRepository } from './queryRepositories/post.query-repository';
import { Comment, CommentSchema } from './models/Comment';
import { CommentController } from './controllers/comments.controller';
import { CommentQueryRepository } from './queryRepositories/comment.query-repository';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    MongooseModule.forFeature([{ name: PosttLike.name, schema: PostLikeSchema }]),
    MongooseModule.forFeature([{ name: CommentLike.name, schema: CommentLikeSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  controllers: [AppController, UsersController, TestingController, BlogsController, PostsController, CommentController],
  providers: [AppService, UserService, BlogService, UserQueryRepository, BlogQueryRepository, PostService,
    PostQueryRepository, CommentQueryRepository],
})
export class AppModule {}
