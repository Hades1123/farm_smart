import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Not found') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

export class InternalError extends AppError {
    constructor(message: string = 'Internal server error',) {
        super(message, 500);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service Unavailable') {
        super(message, 503);
    }
}
