import { prisma } from "../../config/prisma";
import { SensorThresholdDto } from "./sensors.dto";
import { DataType, DeviceType } from '@prisma/client';
import { getRedisClient } from "../../config/redis";

export class SensorService {
    async getSensorThreshold() {
        const threshold = await prisma.sensorThreshold.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                temperature: 50,
                humidity: 50,
                light: 50,
                soilMoisture: 50
            },
            select: {
                soilMoisture: true,
                light: true,
                temperature: true,
                humidity: true,
            }
        });

        return threshold;
    }

    async updateSensorThreshold(thresholdData: SensorThresholdDto) {
        await prisma.sensorThreshold.update({
            where: { id: 1 },
            data: {
                soilMoisture: thresholdData.soilMoistureThreshold,
                light: thresholdData.lightIntensityThreshold,
                temperature: thresholdData.temperatureThreshold,
                humidity: thresholdData.humidityThreshold,
            },
            select: {
                soilMoisture: true,
                light: true,
                temperature: true,
                humidity: true,
            }
        });

        return { message: "Sensor threshold updated successfully" };
    }

    async resetSensorThreshold() {
        await prisma.sensorThreshold.update({
            where: { id: 1 },
            data: {
                soilMoisture: 50,
                light: 50,
                temperature: 50,
                humidity: 50
            }
        });

        return { message: "Sensor threshold reset successfully" };
    }

    async saveSensorDataFromMqtt(feedKey: string, value: number) {
        const redisClient = getRedisClient();

        const feedKeyWithoutUsername = feedKey.split('/').slice(2).join('/'); // Remove username from topic

        const feedToSensorMap: Record<string, DataType> = {
            'dadn.humidity': DataType.humidity,
            'dadn.temperature': DataType.temperature,
            'dadn.soil-moisture': DataType.soil,
            'dadn.light': DataType.light,
        };

        const sensorField = feedToSensorMap[feedKeyWithoutUsername];
        if (!sensorField) {
            throw new Error("Unrecognized feed key: " + feedKeyWithoutUsername);
        }

        const typeToDeviceMap: Record<DataType, DeviceType> = {
            [DataType.humidity]: DeviceType.TEMPERATURE_SENSOR,
            [DataType.temperature]: DeviceType.TEMPERATURE_SENSOR,
            [DataType.soil]: DeviceType.SOIL_SENSOR,
            [DataType.light]: DeviceType.LIGHT_SENSOR,
        };

        const deviceId = await prisma.device.findFirst({
            where: { deviceType: typeToDeviceMap[sensorField] },
            select: { id: true },
        }).then(device => device?.id);
        if (!deviceId) {
            throw new Error("No device found for sensor type: " + sensorField);
        }

        const now = new Date();

        const sensorData = await prisma.sensorData.create({
            data: {
                deviceId,
                dataType: sensorField,
                value,
                recordedAt: now,
            }
        }); 

        await redisClient.set(`sensor:latest:${sensorField}`, value.toString());

        await redisClient.expire(`sensor:latest:${sensorField}`, 60 * 60 * 24 * 7); 

        return { message: "Sensor data saved successfully", data: sensorData };
    }

    async getLatestSensorData() {
        const redisClient = getRedisClient();

        const [latestTemperature, latestHumidity, latestSoilMoisture, latestLight] = await Promise.all([
            redisClient.get('sensor:latest:temperature'),
            redisClient.get('sensor:latest:humidity'),
            redisClient.get('sensor:latest:soil'),
            redisClient.get('sensor:latest:light'),
        ]);

        if (latestTemperature && latestHumidity && latestSoilMoisture && latestLight) {
            return {
                temperature: parseFloat(latestTemperature),
                humidity: parseFloat(latestHumidity),
                soilMoisture: parseFloat(latestSoilMoisture),
                light: parseFloat(latestLight),
                source: 'cache'
            };
        }

        const latestData = await prisma.sensorData.findMany({
            select: {
                dataType: true,
                value: true,
            },
            orderBy: { dataType: 'asc', recordedAt: 'desc' },
            distinct: ['dataType'],
        });

        const result: Record<string, number> = {};
        latestData.forEach(data => {
            if (data.dataType === DataType.temperature) {
                result.temperature = data.value;
            } else if (data.dataType === DataType.humidity) {
                result.humidity = data.value;
            } else if (data.dataType === DataType.soil) {
                result.soilMoisture = data.value;
            } else if (data.dataType === DataType.light) {
                result.light = data.value;
            }
        });
        return { data: result, source: 'database' };
    }

    async getSensorHistory(type: DataType, range: 'day' | 'week' | 'month') {
        const now = new Date();

        let fromDate: Date;
        let toDate = new Date(now);
        let format: 'quarter-hour' | 'hour' | 'day';
        let points: number;

        switch (range) {
            case 'day': {
                fromDate = new Date(now);
                fromDate.setHours(0, 0, 0, 0);

                format = 'quarter-hour';

                // 4 mốc mỗi giờ, từ 00:00 tới giờ hiện tại
                points = now.getHours() * 4 + Math.floor(now.getMinutes() / 15) + 1;
                break;
            }

            case 'week': {
                fromDate = new Date(now);

                const day = fromDate.getDay(); // CN = 0
                const diffToMonday = day === 0 ? 6 : day - 1;

                fromDate.setDate(fromDate.getDate() - diffToMonday);
                fromDate.setHours(0, 0, 0, 0);

                format = 'hour';

                // Mỗi point = 2 giờ
                points = Math.floor(
                    (diffToMonday * 24 + now.getHours()) / 2
                ) + 1;

                break;
            }

            case 'month': {
                fromDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                    0,
                    0,
                    0,
                    0
                );

                format = 'day';

                // Mỗi ngày 1 điểm, từ ngày 1 tới hôm nay
                points = now.getDate();
                break;
            }

            default:
                throw new Error("Unrecognized range: " + range);
        }

        const dbData = await prisma.sensorData.findMany({
            where: {
                dataType: type,
                recordedAt: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            orderBy: {
                recordedAt: 'asc',
            },
            select: {
                value: true,
                recordedAt: true,
            },
        });

        const historyData = dbData.map(data => ({
            timestamp: data.recordedAt.getTime(),
            value: data.value,
        }));

        const aggregatedData = this.aggregateData(
            historyData,
            format,
            points,
            fromDate
        );

        return {
            data: aggregatedData,
            range,
            type,
            lastUpdate: now.toDateString(),
        };
    }

    private aggregateData(
        data: Array<{ timestamp: number; value: number }>,
        interval: 'quarter-hour' | 'hour' | 'day',
        points: number,
        startDate: Date,
    ): Array<{ label: string; value: number; timestamp: number }> {
        const result: Array<{
            label: string;
            value: number;
            timestamp: number;
        }> = [];

        const intervalMs =
            interval === 'quarter-hour'
                ? 15 * 60 * 1000
                : interval === 'hour'
                    ? 2 * 60 * 60 * 1000 
                    : 24 * 60 * 60 * 1000;

        for (let i = 0; i < points; i++) {
            const start = new Date(startDate.getTime() + i * intervalMs);
            const end = new Date(start.getTime() + intervalMs);

            const bucketData = data.filter(d =>
                d.timestamp >= start.getTime() &&
                d.timestamp < end.getTime()
            );

            const avgValue = bucketData.length > 0
                ? bucketData.reduce((sum, d) => sum + d.value, 0) / bucketData.length
                : 0;

            let label: string;

            if (interval === 'quarter-hour') {
                const hour = start.getHours().toString().padStart(2, '0');
                const minute = start.getMinutes().toString().padStart(2, '0');
                label = `${hour}:${minute}`;
            } else if (interval === 'hour') {
                const day = start.getDate();
                const month = start.getMonth() + 1;
                const hour = start.getHours().toString().padStart(2, '0');
                label = `${day}/${month} ${hour}h`;
            } else {
                label = `${start.getDate()}/${start.getMonth() + 1}`;
            }

            result.push({
                label,
                value: Math.round(avgValue * 100) / 100,
                timestamp: start.getTime(),
            });
        }

        return result;
    }
};