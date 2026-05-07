import { z } from 'zod';

export const PasswordChangeSchema = z.object({
    oldPassword: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
        .max(255, 'Mật khẩu không được vượt quá 255 kí tự'),
    newPassword: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
        .max(255, 'Mật khẩu không được vượt quá 255 kí tự'),
});

export type PasswordChangeDto = z.infer<typeof PasswordChangeSchema>;