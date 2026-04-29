import { Prisma } from "@prisma/client";
import { AppError } from "../AppError";
import { BadRequestError, ConflictError, NotFoundError } from "../index";
import { IErrorStrategy } from "./error-strategy.interface";

export class PrismaErrorStrategy implements IErrorStrategy {
  canHandle(error: any): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientInitializationError
    );
  }

  handle(error: any): AppError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": {
          const target =
            (error.meta?.target as string[])?.join(", ") || "field";
          return new ConflictError(`Dữ liệu bị trùng lặp ở trường: ${target}`);
        }
        case "P2003": {
          const fieldName = (error.meta?.field_name as string) || "unknown";
          return new BadRequestError(
            `Lỗi khóa ngoại (Foreign key): Bản ghi tham chiếu không tồn tại (${fieldName})`,
          );
        }
        case "P2025": {
          return new NotFoundError(
            "Không tìm thấy bản ghi cần thao tác trong cơ sở dữ liệu",
          );
        }
        default:
          return new BadRequestError(`Lỗi cơ sở dữ liệu (Mã: ${error.code})`);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new BadRequestError(
        "Dữ liệu đầu vào không đúng định dạng của cơ sở dữ liệu",
      );
    }

    return new BadRequestError("Lỗi cấu hình hoặc kết nối cơ sở dữ liệu");
  }
}
