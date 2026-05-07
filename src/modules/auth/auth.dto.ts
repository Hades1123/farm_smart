import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z
        .string()
        .min(3, 'Username phải có ít nhất 3 kí tự')
        .max(50, 'Username không được vượt quá 50 kí tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
    email: z
        .string()
        .max(100, 'Email không được vượt quá 100 kí tự'),
    password: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
        .max(255, 'Mật khẩu không được vượt quá 255 kí tự'),
});

export const LoginSchema = z.object({
    username: CreateUserSchema.shape.email,
    password: CreateUserSchema.shape.password,
})

export interface AccessTokenPayload {
    id: string;
    username: string;
    email: string;
    phone: string;
    type: 'access';
}

export interface RefreshTokenPayload {
    userId: string;
    type: 'refresh';
}

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
