import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './testing/testing.controller';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlogsController } from './blogs/blogs.controller';
import { JwtAuthService } from './domain/JWT.service';
import { BlogService } from './blogs/blog.service';
import { BlogQueryRepository } from './blogs/blog.query-repository';
import { BlogRepository } from './blogs/blog.repository';
import { BlogExistValidator } from './validation/BlogExistValidator';
//import { BlogIdForPostValidationPipe } from './validation/pipes/body-blog-id-validation.pipe';
import { CommentRepository } from './comments/comment.repository';
import { CommentService } from './comments/comment.service';
import { CommentQueryRepository } from './comments/comment.query-repository';
import { CommentExistValidator } from './validation/CommentExistValidator';
import { PostsController } from './posts/posts.controller';
import { PostService } from './posts/post.service';
import { PostQueryRepository } from './posts/post.query-repository';
import { PostRepository } from './posts/post.repository';
import { PostExistValidator } from './validation/PostExistValidator';
import { UsersController } from './users/super-admin.users.controller';
import { UserService } from './users/user.service';
import { UserQueryRepository } from './users/user.query-repository';
import { UserRepository } from './users/user.repository';
import { UserExistValidator } from './validation/UserExistValidator';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailAdapter } from './authorization/adapters/email.adapter';
import { EmailService } from './authorization/email.service';
import { EmailConfirmationCodeValidator } from './validation/EmailConfirmationCodeValidator';
import { JwtModule } from '@nestjs/jwt';
import { Device, DeviceSchema } from './models/Device';
import { AuthorizationController } from './authorization/authorization.controller';
import { SecurityController } from './security/security.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { SecurityService } from './security/security.service';
import { SecurityQueryRepository } from './security/security.query-repository';
import { AuthorizationRepository } from './authorization/authorization.repository';
import { SecurityRepository } from './security/security.repository';
import { LoginValidation } from './validation/login';
//import { AuthGuard } from './guards/auth.guard';
import { CommentController } from './comments/comments.controller';
import { IsBlogIdValidConstraint } from './decorators/isBlogIdValid';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Comment, CommentSchema } from './comments/models/schemas/Comment';
import { Blog, BlogSchema } from './blogs/models/schemas/Blog';
import { Post, PostSchema } from './posts/models/schemas/Post';
import { APILog, APILogSchema } from './security/models/schemas/APILohs';
import { getConfiguration } from './config/configuration';
import { User, UserSchema } from './users/models/schemas/User';
import { PublicBlogsController } from './blogs/public.bogs.controller';
import { SuperAdminBlogsController } from './blogs/super-admin.blogs.controller';

@Module({
  imports: [
    //UsersModule,
    //PostsModule,
    //BlogsModule,
    //CommentsModule,
    //EmailModule,
    //AuthModule,
    ConfigModule.forRoot({
      load: [getConfiguration]
    }),
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
      // через конфиг когда добавлю отдельный модуль 
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10m' },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: APILog.name, schema: APILogSchema }
    ]),
  ],
  controllers: [AppController, TestingController, BlogsController, PostsController, UsersController, CommentController, AuthorizationController, SecurityController,
    PublicBlogsController, SuperAdminBlogsController],
  providers: [AppService, IsBlogIdValidConstraint, JwtStrategy, JwtAuthGuard,
    JwtAuthService,
    BlogService, BlogQueryRepository, BlogRepository, BlogExistValidator,
    CommentService, CommentQueryRepository, CommentRepository, CommentExistValidator,
    PostService, PostQueryRepository, PostRepository, PostExistValidator,
    UserService, UserQueryRepository, UserRepository, UserExistValidator,
    EmailAdapter, EmailService, EmailConfirmationCodeValidator,
    AuthorizationService, AuthorizationRepository,
    LoginValidation, SecurityService, SecurityRepository, SecurityQueryRepository],
})

export class AppModule {}
