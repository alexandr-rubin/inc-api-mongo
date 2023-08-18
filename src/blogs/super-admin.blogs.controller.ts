import { Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { QueryParamsModel } from "../models/PaginationQuery";
import { BlogQueryRepository } from "./blog.query-repository";
import { PostQueryRepository } from "../posts/post.query-repository";
import { BasicAuthGuard } from "src/guards/basic-auth.guard";
import { UserQueryRepository } from "src/users/user.query-repository";
import { BlogIdValidationPipe } from "src/validation/pipes/blog-Id-validation.pipe";
import { UserIdValidationPipe } from "src/validation/pipes/user-Id-validation.pipe";
import { Roles } from "src/decorators/roles.decorator";
import { UserRoles } from "src/helpers/userRoles";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.Admin)
@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(private readonly blogQueryRepository: BlogQueryRepository, private readonly blogService: BlogService, private readonly postQueryRepository: PostQueryRepository,
    private readonly userQueryRepository: UserQueryRepository){}

  @Get()
  async getBlogs(@Query() params: QueryParamsModel) {
    const blogs = await this.blogQueryRepository.getSuperAdminBlogs(params)
    return await this.userQueryRepository.getUsersForAdminBlogs(blogs.items)
  }

  @Put(':blogId/bind-with-user/:userId')
  async bindBlogWithUser(@Param('blogId', BlogIdValidationPipe) blogId: string, @Param('userId', UserIdValidationPipe) userId: string) {
    return await this.blogService.bindBlogWithUser(blogId, userId)
  }
}