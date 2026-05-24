import { Request, Response, NextFunction } from "express";
import { SensorService } from './sensors.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { BadRequestError, NotFoundError } from "../../errors";
import { SensorThresholdDto, SensorThresholdSchema } from "./sensors.dto";

const sensorService = new SensorService();

export class SensorController {
    async getSensorThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const result = await sensorService.getSensorThreshold(userId);
            res.json(new ApiResponse(result, "Get sensor threshold successfully"));
        } catch (error) {
            next(error);
        }   
    };

    async updateSensorThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const data: SensorThresholdDto = SensorThresholdSchema.parse(req.body);
            const result = await sensorService.updateSensorThreshold(userId, data);
            res.json(new ApiResponse(result, "Update sensor threshold successfully"));
        } catch (error) {
            next(error);
        }
    };

    async resetSensorThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const result = await sensorService.resetSensorThreshold(userId);
            res.json(new ApiResponse(result, "Reset sensor threshold successfully"));
        } catch (error) {
            next(error);
        }   
    };

    async getLatestSensorData(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await sensorService.getLatestSensorData();
            res.json(new ApiResponse(result, "Get latest sensor data successfully"));
        } catch (error) {
            next(error);
        }   
    };

    async getSensorHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, range } = req.query;
            if (typeof type !== 'string' || typeof range !== 'string' || !['day', 'week', 'month'].includes(range)) {
                throw new BadRequestError("Invalid query parameters");
            }
            const result = await sensorService.getSensorHistory(type, range as 'day' | 'week' | 'month');
            res.json(new ApiResponse(result, "Get sensor history successfully"));
        } catch (error) {
            next(error);
        }
    }
};