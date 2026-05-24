import { z } from 'zod';

// ─── Sensor Threshold ─────────────────────────────────────────────

export const SensorThresholdSchema = z.object({
    soilMoistureThreshold: z
        .number()   
        .int()
        .min(0, 'Ngưỡng độ ẩm đất phải từ 0% trở lên')
        .max(100, 'Ngưỡng độ ẩm đất không được vượt quá 100%'),
    lightIntensityThreshold: z
        .number()
        .int()
        .min(0, 'Ngưỡng cường độ ánh sáng phải từ 0% trở lên')
        .max(100, 'Ngưỡng cường độ ánh sáng không được vượt quá 100%'),
    temperatureThreshold: z
        .number()
        .int()
        .min(0, 'Ngưỡng nhiệt độ phải từ 0°C trở lên')
        .max(100, 'Ngưỡng nhiệt độ không được vượt quá 100°C'),
    humidityThreshold: z
        .number()
        .int()
        .min(0, 'Ngưỡng độ ẩm không khí phải từ 0% trở lên')
        .max(100, 'Ngưỡng độ ẩm không khí không được vượt quá 100%'),
});

export type SensorThresholdDto = z.infer<typeof SensorThresholdSchema>;