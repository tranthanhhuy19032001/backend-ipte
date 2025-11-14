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

    async findBySlug(slug: string): Promise<news | null> {
        return prisma.news.findUnique({
            where: { slug: slug },
        });
    }

    async findAll(): Promise<NewsJoined[]> {
        const rows = await prisma.$queryRaw<NewsJoined[]>`SELECT n.news_id as id,
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

    async create(data: Omit<news, "id" | "createdAt" | "updatedAt">): Promise<news> {
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

    async findAllNews(filters: {
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
        items: news[];
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
        const whereClause: any = {};
        if (title) {
            whereClause.title = {
                contains: title,
                mode: "insensitive",
            };
        }
        if (slug) {
            whereClause.slug = slug;
        }
        if (description) {
            whereClause.description = {
                contains: description,
                mode: "insensitive",
            };
        }
        if (status) {
            whereClause.status = status;
        }
        if (isProminent !== undefined) {
            whereClause.is_prominent = isProminent;
        }
        if (categoryId) {
            whereClause.category_id = categoryId;
        }
        if (categoryType) {
            const categories = await prisma.category.findMany({
                where: {
                    category_type: categoryType,
                },
                select: {
                    category_id: true,
                },
            });
            const categoryIds = categories.map((cat) => cat.category_id);
            whereClause.category_id = {
                in: categoryIds,
            };
        }
        const [items, total] = await prisma.$transaction([
            prisma.news.findMany({
                where: whereClause,
                skip,
                take,
                orderBy: { created_at: "desc" },
            }),
            prisma.news.count({ where: whereClause }),
        ]);
        return {
            items,
            page,
            page_size: pageSize,
            total,
            total_pages: Math.ceil(total / pageSize),
        };
    }
}
