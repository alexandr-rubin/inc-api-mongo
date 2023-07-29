import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SecurityRepository } from "../repositories/security.repository";

@Injectable()
export class SecurityService {
  constructor(private jwtService: JwtService, private securityRepository: SecurityRepository){}

  async terminateAllDeviceSessions(token: string): Promise<boolean>{
    const decodedToken = await this.jwtService.verifyAsync(token)
    const isTerminated = await this.securityRepository.terminateAllDeviceSessions(decodedToken.userId, decodedToken.deviceId)
    return isTerminated
  }

  async terminateSpecifiedDeviceSessions(deviceId: string, token: string): Promise<boolean | null>{
    const decodedToken= await this.jwtService.verifyAsync(token)
    const isTerminated = await this.securityRepository.terminateSpecifiedDeviceSessions(deviceId, decodedToken.userId)
    return isTerminated
  }
}