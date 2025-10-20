import { news } from "@prisma/client";

import prisma from "@config/database";

type NewsJoined = {
    id: number;
    image: string;
    title: string;
    description: string;
    content: string;
    category: string | null;
    authorName: string | null;
    authorAvatar: string | null;
};

export class NewsDAO {
    async findById(id: number): Promise<news | null> {
        return prisma.news.findUnique({
            where: { news_id: id },
        });
    }

    async findAll(): Promise<NewsJoined[]> {
        const rows = await prisma.$queryRaw<
            NewsJoined[]
        >`SELECT n.news_id as id,
                    n.image,
                    n.title,
                    n.description,
                    n.content,
                    c.name AS category,
                    u.full_name AS authorName,
                    u.avatar AS authorAvatar
        FROM "category" c
        right JOIN "news" n ON n.category_id = c.category_id
        JOIN "user" u ON u.user_id = n.author_id
        order by id desc;`;
        return rows;
    }

    async create(
        data: Omit<news, "id" | "createdAt" | "updatedAt">
    ): Promise<news> {
        return prisma.news.create({
            data,
        });
    }

    async update(id: number, data: Partial<news>): Promise<news> {
        return prisma.news.update({
            where: { news_id: id },
            data,
        });
    }

    async delete(id: number): Promise<news> {
        return prisma.news.delete({
            where: { news_id: id },
        });
    }
}
