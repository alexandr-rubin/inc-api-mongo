import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SecurityRepository } from "../repositories/security.repository";
import { APILog } from "src/models/APILogs";

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

  async addLog(logEntry: APILog): Promise<APILog> {
    return await this.securityRepository.addLog(logEntry)
  }

  async countDoc(filter:any): Promise<number> {
    return await this.securityRepository.countDoc(filter)
  }

  async deleteAllAPILogsTesting() {
    const result = await this.securityRepository.deleteAllAPILogsTesting()
    return result
  }

  async deleteAllDevicesTesting(): Promise<boolean> {
    const result = await this.securityRepository.deleteAllDevicesTesting()
    return !!result
  }
}