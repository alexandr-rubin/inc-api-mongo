import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Device, DeviceDocument } from "../models/Device";

@Injectable()
export class SecurityRepository {
  constructor(@InjectModel(Device.name) private deviceModel: Model<DeviceDocument>) {}
  async terminateAllDeviceSessions(userId: string, deviceId: string): Promise<boolean> {
    const isTerminated = (await this.deviceModel.deleteMany({userId: userId, deviceId: {$ne: deviceId}})).acknowledged
    return isTerminated
  }

  async terminateSpecifiedDeviceSessions(deviceId: string, userId: string): Promise<boolean | null> {
    // возвращать объект как в комментах
    const device = await this.deviceModel.findOne({deviceId: deviceId})
    if(!device){
      throw new NotFoundException()
    }
    if(device.userId !== userId) {
      throw new UnauthorizedException()
    }
    const isTerminated = (await this.deviceModel.deleteOne({deviceId: deviceId})).acknowledged
    return isTerminated
  }
}