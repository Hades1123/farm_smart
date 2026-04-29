import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", data: unknown[] = []) {
    super(message, 400, data);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", data: unknown[] = []) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", data: unknown[] = []) {
    super(message, 403, data);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found", data: unknown[] = []) {
    super(message, 404, data);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", data: unknown[] = []) {
    super(message, 409, data);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "Internal server error", data: unknown[] = []) {
    super(message, 500, data);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable", data: unknown[] = []) {
    super(message, 503, data);
  }
}
