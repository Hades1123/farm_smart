import { Request, Response, NextFunction } from "express";
import { DeviceService } from "./device.service";
import {
  CreateDeviceDto,
  UpdateDeviceDto,
  CreateDeviceSchema,
  UpdateDeviceSchema,
  querySchema,
} from "./device.dto";
import { BadRequestError, NotFoundError } from "../../errors";
import { ApiResponse } from "../../utils/ApiResponse";

const deviceService = new DeviceService();

export class DeviceController {
  async getAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = querySchema.parse(req.query);
      const result = await deviceService.getAllDevices(
        parsed.page,
        parsed.limit,
      );
      res.json(new ApiResponse(result, "Get all my devides"));
    } catch (error) {
      next(error);
    }
  }
  async getDeviceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID");
      }

      const device = await deviceService.getDeviceById(id);
      res.json(new ApiResponse(device, "Get devides by "));
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message);
      }
      next(error);
    }
  }
    async createDevice(req: Request, res: Response, next: NextFunction) {
        try {
            const data: CreateDeviceDto = CreateDeviceSchema.parse(req.body);

      const newDevice = await deviceService.createDevice(data);
      res
        .status(201)
        .json(new ApiResponse(newDevice, "Device created successfully"));
    } catch (error) {
      next(error);
    }
    }
  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID");
      }

      const data: UpdateDeviceDto = UpdateDeviceSchema.parse(req.body);
      const updatedDevice = await deviceService.updateDevice(id, data);
      res.json(new ApiResponse(updatedDevice, "Device updated successfully"));
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message);
      }
      next(error);
    }
  }
  async deleteDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        throw new BadRequestError("Invalid device ID");
      }

      const result = await deviceService.deleteDevice(id);
      res.json(new ApiResponse(result, "Device deleted successfully"));
    } catch (error) {
      if (error instanceof Error && error.message === "Device not found") {
        throw new NotFoundError(error.message);
      }
      next(error);
    }
}}
