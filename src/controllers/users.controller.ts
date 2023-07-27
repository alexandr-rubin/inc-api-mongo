import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { UserService } from "src/domain/user.service";
import { HttpStatusCode } from "../helpers/httpStatusCode";
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
  
  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createUser(@Body() user: UserInputModel) {
    return await this.userService.createUser(user)
  }

  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':id')
  async deleteUserById(@Param('id', UserIdValidationPipe) id: string) {
    return await this.userService.deleteUserById(id) 
  }
}