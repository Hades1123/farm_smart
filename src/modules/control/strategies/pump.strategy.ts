import { DeviceType } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { publishToFeed } from '../../../iot/mqtt.service';
import type {
    IDeviceControlStrategy,
    ControlResult,
    PaginationQuery,
    PaginatedResult,
} from './device-control.interface';

export interface PumpPayload {
    isOn: boolean;
    reason?: string;
}

export class PumpStrategy implements IDeviceControlStrategy {
    readonly deviceType = DeviceType.PUMP;
    readonly mqttFeed = 'pumper';

    async execute(deviceId: string, payload: unknown): Promise<ControlResult> {
        const { isOn, reason } = payload as PumpPayload;

        const record = await prisma.pumpControl.create({
            data: {
                deviceId,
                isOn,
                reason:
                    reason ??
                    (isOn ? 'Manual: turned on' : 'Manual: turned off'),
            },
        });

        const mqttPublished = await publishToFeed(
            this.mqttFeed,
            this.formatMqttValue(payload),
        );

        return { record, mqttPublished };
    }

    async getHistory(
        deviceId: string,
        query: PaginationQuery,
    ): Promise<PaginatedResult<unknown>> {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.pumpControl.findMany({
                where: { deviceId },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.pumpControl.count({ where: { deviceId } }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    formatMqttValue(payload: unknown): string {
        const { isOn } = payload as PumpPayload;
        return isOn ? '1' : '0';
    }
}
