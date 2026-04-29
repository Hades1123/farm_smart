import { prisma } from "../../config/prisma";
import { CreateDeviceDto, UpdateDeviceDto } from "./device.dto";
import { DeviceType } from "@prisma/client";

export class DeviceService {
  async getAllDevices(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.device.count(),
    ]);

    return {
      data: devices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDeviceById(id: number) {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        sensorData: { take: 5, orderBy: { recordedAt: 'desc' } }, // optionally include some recent data
      }
    });

    if (!device) {
      throw new Error("Device not found");
    }

    return device;
  }

  async createDevice(data: CreateDeviceDto) {
    return prisma.device.create({
      data: {
        userId: data.userId,
        deviceName: data.deviceName,
        deviceType: data.deviceType as DeviceType,
        location: data.location,
      },
    });
  }

  async updateDevice(id: number, data: UpdateDeviceDto) {
    // First verify device exists
    await this.getDeviceById(id);

    return prisma.device.update({
      where: { id },
      data: {
        deviceName: data.deviceName,
        location: data.location,
      },
    });
  }

  async deleteDevice(id: number) {
    // First verify device exists
    await this.getDeviceById(id);

    return prisma.device.delete({
      where: { id },
    });
  }
}