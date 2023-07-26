import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/models/Comment';
import { CommentController } from 'src/controllers/comments.controller';
import { CommentService } from 'src/domain/comment.service';
import { CommentQueryRepository } from 'src/queryRepositories/comment.query-repository';
import { CommentRepository } from 'src/repositories/comment.repository';
import { CommentExistValidator } from 'src/validation/CommentExistValidator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
],
  controllers: [CommentController],
  providers: [CommentService, CommentQueryRepository, CommentRepository, CommentExistValidator],
  exports: [CommentService, CommentQueryRepository, CommentRepository, CommentExistValidator, MongooseModule],
})
export class CommentsModule {}
