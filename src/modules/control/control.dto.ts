import { z } from 'zod';

// ─── Common ───────────────────────────────────────────────────

export const HistoryQuerySchema = z.object({
    deviceId: z.string().uuid('deviceId phải là UUID hợp lệ'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ─── Pump ─────────────────────────────────────────────────────

export const PumpControlSchema = z.object({
    deviceId: z.string().uuid('deviceId phải là UUID hợp lệ'),
    isOn: z.boolean({ error: 'isOn là bắt buộc' }),
    reason: z.string().max(500).optional(),
});

// ─── RGB ──────────────────────────────────────────────────────

const colorChannel = z.number().int().min(0).max(255);

export const RGBControlSchema = z
    .object({
        deviceId: z.string().uuid('deviceId phải là UUID hợp lệ'),
        isOn: z.boolean({ error: 'isOn là bắt buộc' }),
        color: z
            .object({
                r: colorChannel,
                g: colorChannel,
                b: colorChannel,
            })
            .optional(),
    })
    .refine((data) => !data.isOn || data.color, {
        message: 'color là bắt buộc khi isOn = true',
        path: ['color'],
    });

// ─── LCD ──────────────────────────────────────────────────────

export const LCDControlSchema = z.object({
    deviceId: z.string().uuid('deviceId phải là UUID hợp lệ'),
    content: z
        .string({ error: 'content là bắt buộc' })
        .min(1, 'Nội dung không được để trống')
        .max(32, 'Nội dung LCD tối đa 32 ký tự (16×2)'),
});

// ─── Schema Map (dùng chung với Registry) ─────────────────────

export const controlSchemas: Record<string, z.ZodType<any>> = {
    pump: PumpControlSchema,
    rgb: RGBControlSchema,
    lcd: LCDControlSchema,
};

// ─── Types ────────────────────────────────────────────────────

export type PumpControlDto = z.infer<typeof PumpControlSchema>;
export type RGBControlDto = z.infer<typeof RGBControlSchema>;
export type LCDControlDto = z.infer<typeof LCDControlSchema>;
export type HistoryQueryDto = z.infer<typeof HistoryQuerySchema>;
