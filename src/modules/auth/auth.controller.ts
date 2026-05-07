import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
    CreateUserDto,
    CreateUserSchema,
    LoginDto,
    LoginSchema,
} from "./auth.dto";
import { UnauthorizedError, ConflictError, BadRequestError, NotFoundError } from "../../errors";
import { ApiResponse } from "../../utils/ApiResponse";
import { cookieConfig } from '../../config/cookie'

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data: CreateUserDto = CreateUserSchema.parse(req.body);
            const result = await authService.register(data);
            res.json(new ApiResponse(result, "Register successfully"));
        } catch (error) {
            if (error instanceof Error && error.message === "Email already exists") {
                throw new ConflictError(error.message);
            }
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data: LoginDto = LoginSchema.parse(req.body);

            const result = await authService.login(data);

            res.cookie('refreshToken', result.refreshToken, cookieConfig.refreshToken);

            res.json(new ApiResponse(result.token, "Login successful"));
        } catch (error) {
            if (error instanceof Error && error.message === "Invalid username or password") {
                throw new UnauthorizedError(error.message);
            }
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("refreshToken", cookieConfig.refreshToken);

            res.json(new ApiResponse(null, "Logout successful"));
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new UnauthorizedError("Refresh token is missing or expired");
            }

            const result = await authService.refresh(refreshToken);

            res.json(new ApiResponse(result, "Access token refreshed successfully"));
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid token type') {
                throw new BadRequestError(error.message);
            }
            if (error instanceof Error && error.message === 'User not found') {
                throw new NotFoundError(error.message);
            }
            next(error);
        }
    }
}
