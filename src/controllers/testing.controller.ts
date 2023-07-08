import { Controller, Delete, Res } from "@nestjs/common";
import { UserService } from "src/domain/user.service";
import { HttpStatusCode } from "src/helpers/httpStatusCode";
import { Response } from "express";

@Controller('testing/all-data')
export class TestingController {
  constructor(private readonly userService: UserService){}
  @Delete()
  async deleteUsersTesting(@Res() res: Response) {
    const isDeleted = await this.userService.deleteUsersTesting()
    if(!isDeleted)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }
}