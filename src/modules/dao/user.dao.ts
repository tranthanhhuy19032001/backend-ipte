import { user } from "@prisma/client";

import prisma from "@config/database";

export class UserDAO {
    async findById(id: number): Promise<user | null> {
        return prisma.user.findUnique({
            where: { user_id: id },
        });
    }

    async findByEmail(email: string): Promise<user | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll(): Promise<user[]> {
        return prisma.user.findMany();
    }

    async create(
        data: Omit<user, "id" | "createdAt" | "updatedAt">
    ): Promise<user> {
        return prisma.user.create({
            data,
        });
    }

    async update(id: number, data: Partial<user>): Promise<user> {
        return prisma.user.update({
            where: { user_id: id },
            data,
        });
    }

    async delete(id: number): Promise<user> {
        return prisma.user.delete({
            where: { user_id: id },
        });
    }
}
