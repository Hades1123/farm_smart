import { AppError } from "../AppError";
import { IErrorStrategy } from "./error-strategy.interface";

export class HttpErrorStrategy implements IErrorStrategy {
  canHandle(error: any): boolean {
    return error instanceof AppError;
  }

  handle(error: any): AppError {
    // Lỗi đã là định dạng chuẩn HTTP (AppError) rồi, nên trả về nguyên mẫu
    return error as AppError;
  }
}
