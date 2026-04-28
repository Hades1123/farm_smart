import { map, ZodError } from "zod";
import { AppError } from "../AppError";
import { BadRequestError } from "../index";
import { IErrorStrategy } from "./error-strategy.interface";

export class ZodErrorStrategy implements IErrorStrategy {
  canHandle(error: any): boolean {
    return error instanceof ZodError;
  }

  handle(error: any): AppError {
    const zodError = error as ZodError;

    // Map các lỗi của Zod thành mảng các object chứa tên field và message lỗi
    const mappedErrors = zodError.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    // Ném ra BadRequestError cùng với mảng lỗi đã được định dạng
    return new BadRequestError(
      `Validation failed: ${mappedErrors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ')}`
    );
  }
}
