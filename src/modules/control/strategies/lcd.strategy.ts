import { DeviceType } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { publishToFeed } from '../../../iot/mqtt.service';
import type {
    IDeviceControlStrategy,
    ControlResult,
    PaginationQuery,
    PaginatedResult,
} from './device-control.interface';

export interface LCDPayload {
    content: string;
}

export class LCDStrategy implements IDeviceControlStrategy {
    readonly deviceType = DeviceType.LCD;
    readonly mqttFeed: string | null = null; // Chưa có feed LCD trên Adafruit IO

    async execute(deviceId: string, payload: unknown): Promise<ControlResult> {
        const { content } = payload as LCDPayload;

        const record = await prisma.displayLog.create({
            data: { deviceId, content },
        });

        let mqttPublished = false;
        if (this.mqttFeed) {
            mqttPublished = await publishToFeed(
                this.mqttFeed,
                this.formatMqttValue(payload),
            );
        }

        return { record, mqttPublished };
    }

    async getHistory(
        deviceId: string,
        query: PaginationQuery,
    ): Promise<PaginatedResult<unknown>> {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.displayLog.findMany({
                where: { deviceId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.displayLog.count({ where: { deviceId } }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    formatMqttValue(payload: unknown): string {
        const { content } = payload as LCDPayload;
        return content;
    }
}
