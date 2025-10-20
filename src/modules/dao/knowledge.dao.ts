import { knowledge } from "@prisma/client";

import prisma from "@config/database";

type knowledgeJoined = {
    id: number;
    image: string;
    title: string;
    description: string;
    content: string;
    category: string | null;
    authorName: string | null;
    authorAvatar: string | null;
};

export class KnowledgeDAO {
    async findAll(): Promise<knowledgeJoined[]> {
        const rows = await prisma.$queryRaw<
            knowledgeJoined[]
        >`SELECT k.knowledge_id as id,
                            k.image,
                            k.title,
                            k.description,
                            k.content,
                            c.name AS category,
                            u.full_name AS authorName,
                            u.avatar AS authorAvatar
            FROM "category" c
            right JOIN "knowledge" k ON k.category_id = c.category_id
            JOIN "user" u ON u.user_id = k.author_id
            order by id desc;`;
        return rows;
    }
}
