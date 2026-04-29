import { AppError } from '../AppError';

export interface IErrorStrategy {
    canHandle(error: any): boolean;
    handle(error: any): AppError;
}
