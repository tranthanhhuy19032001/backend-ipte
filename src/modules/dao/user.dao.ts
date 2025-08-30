import { User } from "@prisma/client";

import prisma from "../../config/database";

export class UserDAO {
    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { user_id: id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async create(
        data: Omit<User, "id" | "createdAt" | "updatedAt">
    ): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        return prisma.user.update({
            where: { user_id: id },
            data,
        });
    }

    async delete(id: number): Promise<User> {
        return prisma.user.delete({
            where: { user_id: id },
        });
    }
}
