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
import { PostExistValidator } from './validation/PostExistValidator';
import { CommentExistValidator } from './validation/CommentExistValidator';
import { IdValidationPipe } from './validation/pipes/params-id-custom-validation.pipe';
import { UserExistValidator } from './validation/UserExistValidator';
import { AuthorizationController } from './controllers/authorization.controller';
import { AuthorizationService } from './domain/authorization.service';
import { CommentRepository } from './repositories/comment.repository';
import { AuthorizationRepository } from './repositories/authorization.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailAdapter } from './adapters/email.adapter';
import { EmailService } from './domain/email.service';
import { EmailConfirmationCodeValidator } from './validation/EmailConfirmationCodeValidator';
import { EmailConfirmationCodePipe } from './validation/pipes/email-confirmation-code.pipe';
import { PasswordRecoveryCodeExistValidator } from './validation/passwordRecCodeValid';
import { PasswordRecoveryCodeValidPipe } from './validation/pipes/password-recovery-code-valid.pipe';
import { EmailOrLoginExistsPipe } from './validation/pipes/email-login-exist.pipe';

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
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
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
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController, UsersController, TestingController, BlogsController, PostsController, CommentController,
    AuthorizationController],
  providers: [AppService, UserService, BlogService, UserQueryRepository, BlogQueryRepository, PostService,
    PostQueryRepository, CommentQueryRepository, UserRepository,  PostRepository, BlogRepository, CommentService, 
    BlogExistValidator, PostExistValidator, CommentExistValidator, IdValidationPipe, UserExistValidator, 
    AuthorizationService, CommentRepository, AuthorizationRepository, EmailAdapter, EmailService, 
    EmailConfirmationCodeValidator, EmailConfirmationCodePipe, PasswordRecoveryCodeExistValidator, PasswordRecoveryCodeValidPipe,
    EmailOrLoginExistsPipe],
})

export class AppModule {}
