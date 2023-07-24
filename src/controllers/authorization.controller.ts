import { Body, Controller, Delete, Get, Param, Post, Query, Res } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { UserService } from "src/domain/user.service";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { Response } from "express";
import { QueryParamsModel } from "../models/PaginationQuery";
import { UserQueryRepository } from "../queryRepositories/user.query-repository";
import { IdValidationPipe } from "src/validation/pipes/params-id-custom-validation.pipe";
import { AuthorizationService } from "src/domain/authorization.service";

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService){}

}