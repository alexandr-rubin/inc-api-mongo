import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards } from "@nestjs/common";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { SecurityQueryRepository } from "src/queryRepositories/security.query-repository";
import { Request } from "express";
import { SecurityService } from "src/domain/security.service";
import { RefreshTokenGuard } from "src/guards/refreshToken.guard";

@Controller('security')
export class SecurityController {
  constructor(private readonly securityQueryRepository: SecurityQueryRepository, private securityService: SecurityService){}
  @UseGuards(RefreshTokenGuard)
  @Get()
  async getActiveDevices(@Req() req: Request) {
    return this.securityQueryRepository.getActiveDevices(req.cookies.refreshToken)
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete('devices')
  async deleteDevices(@Req() req: Request) {
    const isTerminated = await this.securityService.terminateAllDeviceSessions(req.cookies.refreshToken)
    return isTerminated
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Delete('devices/:deviceId')
  async deleteSpecificDevice(@Req() req: Request, @Param('deviceId') deviceId: string) {
    const isTerminated = await this.securityService.terminateSpecifiedDeviceSessions(deviceId, req.cookies.refreshToken)
    return isTerminated
  }
}