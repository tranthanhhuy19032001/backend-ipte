import { teacher } from "@prisma/client";

import prisma from "@config/database";

export class TeacherDAO {
    async findById(id: number): Promise<teacher | null> {
        return prisma.teacher.findUnique({
            where: { teacher_id: id },
        });
    }

    async findAll(): Promise<teacher[]> {
        return prisma.teacher.findMany();
    }

    async create(data: Omit<teacher, "id" | "createdAt" | "updatedAt">): Promise<teacher> {
        return prisma.teacher.create({
            data,
        });
    }

    async update(id: number, data: Partial<teacher>): Promise<teacher> {
        return prisma.teacher.update({
            where: { teacher_id: id },
            data,
        });
    }

    async delete(id: number): Promise<teacher> {
        return prisma.teacher.delete({
            where: { teacher_id: id },
        });
    }
}
