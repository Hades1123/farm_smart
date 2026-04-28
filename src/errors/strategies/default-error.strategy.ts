import { AppError } from "../AppError";
import { InternalError } from "../index";
import { IErrorStrategy } from "./error-strategy.interface";

export class DefaultErrorStrategy implements IErrorStrategy {
  canHandle(_error: any): boolean {
    return true; // Luôn bắt mọi lỗi còn lại
  }

  handle(error: any): AppError {
    console.error(">>> UNHANDLED SYSTEM ERROR:", error);
    
    // Nếu có một message cụ thể nhưng không thuộc class AppError
    if (error instanceof Error && error.message) {
      return new InternalError(error.message);
    }
    
    return new InternalError("Internal Server Error");
  }
}
