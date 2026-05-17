import { DeviceType } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { publishToFeed } from '../../../iot/mqtt.service';
import type {
    IDeviceControlStrategy,
    ControlResult,
    PaginationQuery,
    PaginatedResult,
} from './device-control.interface';

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export interface RGBPayload {
    isOn: boolean;
    color?: RGBColor;
}

export class RGBStrategy implements IDeviceControlStrategy {
    readonly deviceType = DeviceType.LED;
    readonly mqttFeed = 'led';

    async execute(deviceId: string, payload: unknown): Promise<ControlResult> {
        const { isOn, color } = payload as RGBPayload;

        const value =
            isOn && color
                ? JSON.stringify(color)
                : JSON.stringify({ r: 0, g: 0, b: 0 });

        const record = await prisma.rGBControl.create({
            data: { deviceId, isOn, value },
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
            prisma.rGBControl.findMany({
                where: { deviceId },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.rGBControl.count({ where: { deviceId } }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    formatMqttValue(payload: unknown): string {
        const { isOn, color } = payload as RGBPayload;
        if (!isOn) return '0';
        if (!color) return '#FFFFFF';

        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    }
}
