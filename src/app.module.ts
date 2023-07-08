import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/User';
import { UserService } from './domain/user.service';
import { TestingController } from './controllers/testing.controller';

const MONGODB_URI = /*process.env.MONGODB_URI */  'mongodb://localhost:27017/testDb'

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AppController, UsersController, TestingController],
  providers: [AppService, UserService],
})
export class AppModule {}
