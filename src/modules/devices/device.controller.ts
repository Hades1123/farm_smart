import { Request, Response, NextFunction } from "express";
import { DeviceService } from "./device.service";
import { CreateDeviceDto, UpdateDeviceDto, CreateDeviceSchema, UpdateDeviceSchema, querySchema } from "./device.dto";
import { BadRequestError, NotFoundError } from "../../errors";

const deviceService = new DeviceService();

export class DeviceController {
  async getAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = querySchema.parse(req.query);
      const result = await deviceService.getAllDevices(parsed.page, parsed.limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDeviceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID")
      }

      const device = await deviceService.getDeviceById(id);
      res.status(200).json({ data: device });
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message)
      }
      next(error);
    }
  }

  async createDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateDeviceDto = CreateDeviceSchema.parse(req.body);

      const newDevice = await deviceService.createDevice(data);
      res.status(201).json({ data: newDevice, message: "Device created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID")
      }

      const data: UpdateDeviceDto = UpdateDeviceSchema.parse(req.body);
      const updatedDevice = await deviceService.updateDevice(id, data);
      res.status(200).json({ data: updatedDevice, message: "Device updated successfully" });
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message)
      }
      next(error);
    }
  }

  async deleteDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID")
      }

      await deviceService.deleteDevice(id);
      res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message)
      }
      next(error);
    }
  }
}
