import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from 'src/controllers/users.controller';
import { UserService } from 'src/domain/user.service';
import { User, UserSchema } from 'src/models/User';
import { UserQueryRepository } from 'src/queryRepositories/user.query-repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserExistValidator } from 'src/validation/UserExistValidator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
],
  controllers: [UsersController],
  providers: [UserService, UserQueryRepository, UserRepository, UserExistValidator],
  exports: [UserService, UserQueryRepository, UserRepository, UserExistValidator,   MongooseModule],
})
export class UsersModule {}
