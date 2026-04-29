import { AppError } from './AppError';
import { IErrorStrategy } from './strategies/error-strategy.interface';
import { PrismaErrorStrategy } from './strategies/prisma-error.strategy';
import { ZodErrorStrategy } from './strategies/zod-error.strategy';
import { HttpErrorStrategy } from './strategies/http-error.strategy';
import { DefaultErrorStrategy } from './strategies/default-error.strategy';

export class ErrorHandlerContext {
    private strategies: IErrorStrategy[];

    constructor() {
        this.strategies = [
            new ZodErrorStrategy(), // 1. Kiểm tra lỗi Validation (Zod)
            new PrismaErrorStrategy(), // 2. Kiểm tra lỗi Database (Prisma)
            new HttpErrorStrategy(), // 3. Kiểm tra lỗi HTTP chủ động (AppError)
            new DefaultErrorStrategy(), // 4. Bắt các lỗi không lường trước còn lại
        ];
    }

    public execute(error: any): AppError {
        for (const strategy of this.strategies) {
            if (strategy.canHandle(error)) {
                return strategy.handle(error);
            }
        }

        // Fallback an toàn (thực ra DefaultErrorStrategy luôn return true)
        return new DefaultErrorStrategy().handle(error);
    }
}
