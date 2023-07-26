import { Body, Controller, Delete, Get, Param, Post, Query, Res } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { UserService } from "src/domain/user.service";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { QueryParamsModel } from "../models/PaginationQuery";
import { UserQueryRepository } from "../queryRepositories/user.query-repository";
import { UserIdValidationPipe } from "src/validation/pipes/user-Id-validation.pipe";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService, private readonly userQueryRepository: UserQueryRepository){}
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    return await this.userQueryRepository.getUsers(params)
  }
  
  @Post()
  async createUser(@Body() user: UserInputModel) {
    return await this.userService.createUser(user)
  }

  @Delete(':id')
  async deleteUserById(@Param('id', UserIdValidationPipe) id: string, @Res() res: Response) {
    const isDeleted = await this.userService.deleteUserById(id)
    if(!isDeleted)
    {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)  
  }
}