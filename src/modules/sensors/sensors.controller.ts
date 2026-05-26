import { Request, Response, NextFunction } from 'express';
import { SensorService } from './sensors.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { BadRequestError, NotFoundError } from '../../errors';
import { SensorThresholdDto, SensorThresholdSchema } from './sensors.dto';
import { DataType } from '@prisma/client';

const sensorService = new SensorService();

export class SensorController {
    async getSensorThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await sensorService.getSensorThreshold();
            res.json(
                new ApiResponse(result, 'Get sensor threshold successfully'),
            );
        } catch (error) {
            next(error);
        }
    }

    async updateSensorThreshold(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const data: SensorThresholdDto = SensorThresholdSchema.parse(
                req.body,
            );
            const result = await sensorService.updateSensorThreshold(data);
            res.json(
                new ApiResponse(result, 'Update sensor threshold successfully'),
            );
        } catch (error) {
            next(error);
        }
    }

    async resetSensorThreshold(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = await sensorService.resetSensorThreshold();
            res.json(
                new ApiResponse(result, 'Reset sensor threshold successfully'),
            );
        } catch (error) {
            next(error);
        }
    }

    async getLatestSensorData(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await sensorService.getLatestSensorData();
            res.json(
                new ApiResponse(result, 'Get latest sensor data successfully'),
            );
        } catch (error) {
            next(error);
        }
    }

    async getSensorHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, range } = req.query;
            if (
                typeof type !== 'string' ||
                !Object.values(DataType).includes(type as DataType) ||
                typeof range !== 'string' ||
                !['day', 'week', 'month'].includes(range)
            ) {
                throw new BadRequestError('Invalid query parameters');
            }
            const result = await sensorService.getSensorHistory(
                type as DataType,
                range as 'day' | 'week' | 'month',
            );
            res.json(
                new ApiResponse(result, 'Get sensor history successfully'),
            );
        } catch (error) {
            next(error);
        }
    }
}
