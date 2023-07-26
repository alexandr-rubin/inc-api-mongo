import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './controllers/testing.controller';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users.module';
import { PostsModule } from './modules/posts.module';
import { BlogsModule } from './modules/blogs.module';
import { CommentsModule } from './modules/comments.module';
import { EmailModule } from './modules/email.module';
import { AuthModule } from './modules/auth.module';

dotenv.config()


const MONGODB_URI = process.env.MONGODB_URI ||  'mongodb://localhost:27017/testDb'

@Module({
  imports: [
    UsersModule,
    PostsModule,
    BlogsModule,
    CommentsModule,
    EmailModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MONGODB_URI),
  ],
  controllers: [AppController, TestingController],
  providers: [AppService],
})

export class AppModule {}
