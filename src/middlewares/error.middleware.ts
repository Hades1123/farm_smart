import type { Request, Response, NextFunction } from 'express';
import { ErrorHandlerContext } from '../errors/ErrorContext';

const errorContext = new ErrorHandlerContext();

export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    // Strategy Pattern Context sẽ tự động chọn cách xử lý lỗi phù hợp
    const err = errorContext.execute(error);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    const success = err.success !== undefined ? err.success : false;
    let data = err.data || [];

    const payload: any = {
        success,
        message,
        data,
    };

    res.status(statusCode).json(payload);
};
