import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './controllers/testing.controller';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Post, PostSchema } from './models/Post';
import { BlogsController } from './controllers/blogs.controller';
import { JwtAuthService } from './domain/JWT.service';
import { BlogService } from './domain/blog.service';
import { BlogQueryRepository } from './queryRepositories/blog.query-repository';
import { BlogRepository } from './repositories/blog.repository';
import { BlogExistValidator } from './validation/BlogExistValidator';
//import { BlogIdForPostValidationPipe } from './validation/pipes/body-blog-id-validation.pipe';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './domain/comment.service';
import { CommentQueryRepository } from './queryRepositories/comment.query-repository';
import { CommentExistValidator } from './validation/CommentExistValidator';
import { PostsController } from './controllers/posts.controller';
import { PostService } from './domain/post.service';
import { PostQueryRepository } from './queryRepositories/post.query-repository';
import { PostRepository } from './repositories/post.repository';
import { PostExistValidator } from './validation/PostExistValidator';
import { UsersController } from './controllers/users.controller';
import { UserService } from './domain/user.service';
import { UserQueryRepository } from './queryRepositories/user.query-repository';
import { UserRepository } from './repositories/user.repository';
import { UserExistValidator } from './validation/UserExistValidator';
import { Blog, BlogSchema } from './models/Blogs';
import { Comment, CommentSchema } from './models/Comment';
import { User, UserSchema } from './models/User';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailAdapter } from './adapters/email.adapter';
import { EmailService } from './domain/email.service';
import { EmailConfirmationCodeValidator } from './validation/EmailConfirmationCodeValidator';
import { JwtModule } from '@nestjs/jwt';
import { Device, DeviceSchema } from './models/Device';
import { AuthorizationController } from './controllers/authorization.controller';
import { SecurityController } from './controllers/security.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationService } from './domain/authorization.service';
import { SecurityService } from './domain/security.service';
import { SecurityQueryRepository } from './queryRepositories/security.query-repository';
import { AuthorizationRepository } from './repositories/authorization.repository';
import { SecurityRepository } from './repositories/security.repository';
import { LoginValidation } from './validation/login';
import { AuthGuard } from './guards/auth.guard';
import { CommentController } from './controllers/comments.controller';
import { IsBlogIdValidConstraint } from './decorators/isBlogIdValid';
import { APILog, APILogSchema } from './models/APILogs';
import { ThrottlerModule } from '@nestjs/throttler';
import { LogAPIThrottlerGuard } from './guards/logAPIThrottlerGuard';

dotenv.config()


const MONGODB_URI = process.env.MONGODB_URI ||  'mongodb://localhost:27017/testDb'
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secretkey'

@Module({
  imports: [
    //UsersModule,
    //PostsModule,
    //BlogsModule,
    //CommentsModule,
    //EmailModule,
    //AuthModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'rubinyourhead@gmail.com',
          pass: 'kixbxpkqgkdbabte',
        },
      },
      defaults: {
        from: 'homework <rubinyourhead@gmail.com>',
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '10s' },
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: APILog.name, schema: APILogSchema }
    ]),
  ],
  controllers: [AppController, TestingController, BlogsController, PostsController, UsersController, CommentController, AuthorizationController, SecurityController],
  providers: [AppService, IsBlogIdValidConstraint,
    JwtAuthService,
    BlogService, BlogQueryRepository, BlogRepository, BlogExistValidator,
    CommentService, CommentQueryRepository, CommentRepository, CommentExistValidator,
    PostService, PostQueryRepository, PostRepository, PostExistValidator,
    UserService, UserQueryRepository, UserRepository, UserExistValidator,
    EmailAdapter, EmailService, EmailConfirmationCodeValidator,
    AuthorizationService, AuthorizationRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LogAPIThrottlerGuard
    },
    LoginValidation, SecurityService, SecurityRepository, SecurityQueryRepository],
})

export class AppModule {}
