import { Request, Response, NextFunction } from "express";
import { UserService } from "./users.service";
import {
    PasswordChangeDto,
    PasswordChangeSchema
} from "./users.dto";
import { BadRequestError, NotFoundError } from "../../errors";
import { ApiResponse } from "../../utils/ApiResponse";
import { AccessTokenPayload } from "../auth/auth.dto";

const userService = new UserService();

export class UserController {
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const data: PasswordChangeDto = PasswordChangeSchema.parse(req.body);
            const user: AccessTokenPayload = req.user!;
            const result = await userService.changePassword(data, user.id);
            res.json(new ApiResponse(result, "Password changed successfully"));
        } catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                throw new NotFoundError(error.message);
            }
            if (error instanceof Error && error.message === 'Old password is incorrect') {
                throw new BadRequestError(error.message);
            }
            next(error);
        }
    }

    async getUserMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, username, email, phone } = req.user!;
            res.json(new ApiResponse({ id, username, email, phone }, "Get user's profile successfully"));
        } catch (error) {
            next(error);
        }
    }
}