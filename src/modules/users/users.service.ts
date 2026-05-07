import { prisma } from "../../config/prisma";
import { PasswordChangeDto } from "./users.dto";
import bcrypt from 'bcrypt';

export class UserService {
    async changePassword(data: PasswordChangeDto, userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                hashedPassword: true,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(data.oldPassword, user.hashedPassword);
        if (!isMatch) {
            throw new Error('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: {
                hashedPassword,
            }
        })

        return { message: "Password changed successfully" };
    }
}