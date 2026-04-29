import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const initPrisma = async (): Promise<void> => {
    await prisma.$connect();
};
