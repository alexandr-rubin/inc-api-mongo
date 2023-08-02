import { Controller, Delete, Res } from "@nestjs/common";
import { UserService } from "../domain/user.service";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { PostService } from "../domain/post.service";
import { BlogService } from "../domain/blog.service";
import { CommentService } from "../domain/comment.service";
import { Public } from "../decorators/public.decorator";
import { SecurityService } from "src/domain/security.service";
import { SkipThrottle } from "@nestjs/throttler";

@SkipThrottle()
@Controller('testing/all-data')
export class TestingController {
  constructor(private userService: UserService, private postService: PostService, private blogService: BlogService, private commentService: CommentService, private securityService: SecurityService){}
  @Public()
  @Delete()
  async deleteAllDataTesting(@Res() res: Response) {
    await this.userService.deleteUsersTesting()
    await this.postService.deletePostsTesting()
    await this.blogService.deleteBlogsTesting()
    await this.commentService.deleteCommentTesting()
    await this.securityService.deleteAllAPILogsTesting()

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }
}