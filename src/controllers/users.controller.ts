import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { UserInputModel } from "../models/User";
import { UserService } from "../domain/user.service";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { QueryParamsModel } from "../models/PaginationQuery";
import { UserQueryRepository } from "../queryRepositories/user.query-repository";
import { UserIdValidationPipe } from "../validation/pipes/user-Id-validation.pipe";
import { Public } from "src/decorators/public.decorator";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService, private readonly userQueryRepository: UserQueryRepository){}
  @Public()
  @Get()
  async getUsers(@Query() params: QueryParamsModel) {
    return await this.userQueryRepository.getUsers(params)
  }

  @HttpCode(HttpStatusCode.CREATED_201)
  @Post()
  async createUser(@Body() user: UserInputModel) {
    return await this.userService.createUser(user)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete(':id')
  async deleteUserById(@Param('id', UserIdValidationPipe) id: string) {
    return await this.userService.deleteUserById(id) 
  }
}