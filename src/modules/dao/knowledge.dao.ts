import { knowledge, Prisma } from "@prisma/client";

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

type ListOptions = {
    page: number;
    pageSize: number;
};

export class KnowledgeDAO {
    async findAll(): Promise<knowledgeJoined[]> {
        const rows = await prisma.$queryRaw<knowledgeJoined[]>`SELECT k.knowledge_id as id,
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

    async selectKnowledges(
        categoryId: number,
        opts: ListOptions
    ): Promise<{
        items: knowledge[];
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    }> {
        const { page, pageSize } = opts;
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const where: Prisma.knowledgeWhereInput = { category_id: categoryId };

        const [items, total] = await prisma.$transaction([
            prisma.knowledge.findMany({
                where,
                skip,
                take,
                orderBy: [{ is_prominent: "desc" }, { created_at: "desc" }],
            }),
            prisma.knowledge.count({ where }),
        ]);

        return {
            items,
            page,
            page_size: pageSize,
            total,
            total_pages: Math.ceil(total / pageSize) || 1,
        };
    }

    async getKnowledges(filters: {
        title?: string;
        slug?: string;
        description?: string;
        status?: any;
        isProminent?: number;
        categoryId?: number;
        categoryType?: string;
        page: number;
        pageSize: number;
    }): Promise<{
        items: knowledge[];
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    }> {
        const {
            title,
            slug,
            description,
            status,
            isProminent,
            categoryId,
            categoryType,
            page,
            pageSize,
        } = filters;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where: Prisma.knowledgeWhereInput = {};
        if (title) {
            where.title = {
                contains: title,
                mode: "insensitive",
            };
        }
        if (slug) {
            where.slug = slug;
        }
        if (status) {
            where.status = status;
        }
        if (isProminent !== undefined) {
            where.is_prominent = isProminent;
        }
        if (categoryId) {
            where.category_id = categoryId;
        }
        if (categoryType) {
            where.category_type = { equals: categoryType };
        }
        if (description) {
            where.description = {
                contains: description,
                mode: "insensitive",
            };
        }
        const [items, total] = await prisma.$transaction([
            prisma.knowledge.findMany({
                where,
                skip,
                take,
                orderBy: [{ is_prominent: "desc" }, { created_at: "desc" }],
            }),
            prisma.knowledge.count({ where }),
        ]);
        return {
            items,
            page,
            page_size: pageSize,
            total,
            total_pages: Math.ceil(total / pageSize) || 1,
        };
    }

    async findById(id: number): Promise<knowledge | null> {
        return prisma.knowledge.findUnique({
            where: { knowledge_id: id },
        });
    }

    async findBySlug(slug: string): Promise<knowledge | null> {
        return prisma.knowledge.findUnique({
            where: { slug: slug },
        });
    }
}
