import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from "../errors";
import { env } from "../config/env"
import jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '../modules/auth/auth.dto';

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provider');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};