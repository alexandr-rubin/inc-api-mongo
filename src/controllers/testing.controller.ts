import { Controller, Delete, Res } from "@nestjs/common";
import { UserService } from "src/domain/user.service";
import { HttpStatusCode } from "src/helpers/httpStatusCode";
import { Response } from "express";
import { PostService } from "src/domain/post.service";
import { BlogService } from "src/domain/blog.service";

@Controller('testing/all-data')
export class TestingController {
  constructor(private userService: UserService, private postService: PostService, private blogService: BlogService){}
  @Delete()
  async deleteAllDataTesting(@Res() res: Response) {
    await this.userService.deleteUsersTesting()
    await this.postService.deletePostsTesting()
    await this.blogService.deleteBlogsTesting()

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }
}