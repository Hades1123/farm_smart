import { z } from 'zod';

export const DeviceTypeEnum = z.enum([
    'TEMPERATURE_SENSOR',
    'SOIL_SENSOR',
    'LIGHT_SENSOR',
    'PUMP',
    'LED',
    'LCD',
]);
export const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});
export const CreateDeviceSchema = z.object({
    userId: z
        .string({ message: 'userId là bắt buộc' })
        .uuid('userId phải là UUID hợp lệ'),
    deviceName: z
        .string({ message: 'deviceName là bắt buộc' })
        .min(1, 'Tên thiết bị không được để trống'),
    deviceType: DeviceTypeEnum,
    location: z.string().optional(),
});

export const UpdateDeviceSchema = z.object({
    deviceName: z
        .string()
        .min(1, 'Tên thiết bị không được để trống')
        .optional(),
    location: z.string().optional(),
});

// Trích xuất Type từ schema để dùng như interface DTO ban đầu
export type CreateDeviceDto = z.infer<typeof CreateDeviceSchema>;
export type UpdateDeviceDto = z.infer<typeof UpdateDeviceSchema>;
