import { Request, Response, NextFunction } from 'express';
import registry from './control.registry';
import { controlSchemas, HistoryQuerySchema } from './control.dto';
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} from '../../errors';
import { ApiResponse } from '../../utils/ApiResponse';
import { prisma } from '../../config/prisma';

export class ControlController {
    /**
     * POST /api/control/:type
     * Gửi lệnh điều khiển thiết bị (pump, rgb, lcd, ...)
     */
    async execute(req: Request, res: Response, next: NextFunction) {
        try {
            const type = req.params.type as string;
            const userId = req.user!.id;

            // 1. Lấy strategy từ registry
            const strategy = registry.get(type);

            // 2. Validate payload bằng Zod schema tương ứng
            const schema = controlSchemas[type];
            if (!schema) {
                throw new BadRequestError(
                    `No validation schema for type: ${type}`,
                );
            }
            const validated = schema.parse(req.body);
            const { deviceId, ...payload } = validated;

            // 3. Kiểm tra device tồn tại + thuộc về user + đúng loại
            const device = await prisma.device.findUnique({
                where: { id: deviceId },
            });

            if (!device) {
                throw new NotFoundError(`Device not found: ${deviceId}`);
            }
            if (device.userId !== userId) {
                throw new ForbiddenError(
                    'You do not have access to this device',
                );
            }
            if (device.deviceType !== strategy.deviceType) {
                throw new BadRequestError(
                    `Device "${device.deviceName}" is type ${device.deviceType}, expected ${strategy.deviceType}`,
                );
            }

            // 4. Thực thi strategy (lưu DB + publish MQTT)
            const result = await strategy.execute(deviceId, payload);

            res.status(201).json(
                new ApiResponse(result, `${type} control command sent`),
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/control/:type/history?deviceId=...&page=1&limit=10
     * Lấy lịch sử điều khiển theo loại thiết bị
     */
    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const type = req.params.type as string;
            const userId = req.user!.id;

            // 1. Lấy strategy
            const strategy = registry.get(type);

            // 2. Validate query params
            const { deviceId, page, limit } =
                HistoryQuerySchema.parse(req.query);

            // 3. Kiểm tra device thuộc về user
            const device = await prisma.device.findUnique({
                where: { id: deviceId },
            });

            if (!device) {
                throw new NotFoundError(`Device not found: ${deviceId}`);
            }
            if (device.userId !== userId) {
                throw new ForbiddenError(
                    'You do not have access to this device',
                );
            }

            // 4. Lấy lịch sử
            const result = await strategy.getHistory(deviceId, { page, limit });

            res.json(new ApiResponse(result, `${type} control history`));
        } catch (error) {
            next(error);
        }
    }
}
