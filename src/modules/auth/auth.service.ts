import { prisma } from "../../config/prisma";
import { CreateUserDto, LoginDto, RefreshTokenPayload } from "./auth.dto";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'

export class AuthService {
    async register(data: CreateUserDto) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existing) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                hashedPassword,
                phone: null,
            },
            select: {
                id: true,
                email: true,
                username: true,
                phone: true,
                createdAt: true,
            },
        });

        return user;
    }

    async login(data: LoginDto) {
        const user = await prisma.user.findUnique({
            where: { username: data.username },
        })

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await bcrypt.compare(data.password, user.hashedPassword);
        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        const payload = { id: user.id, username: user.username, email: user.email, phone: user.phone };
        const accessToken = jwt.sign(
            { ...payload, type: 'access' }, 
            env.JWT_ACCESS_SECRET, 
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { id: user.id, type: 'refresh' }, 
            env.JWT_REFRESH_SECRET, 
            { expiresIn: "7d" }
        );

        return {
            token: {
                accessToken,
                tokenType: "Bearer"
            },
            refreshToken
        };
    }

    async refresh(refreshToken: string) {
        const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                username: true,
                phone: true,
            },
        })

        if (!user) {
            throw new Error('User not found');
        }

        const payload = { id: user.id, username: user.username, email: user.email, phone: user.phone };
        const accessToken = jwt.sign(
            { ...payload, type: 'access' }, 
            env.JWT_ACCESS_SECRET, 
            { expiresIn: "15m" }
        );

        return {
            accessToken,
            tokenType: "Bearer",
        };
    }
}