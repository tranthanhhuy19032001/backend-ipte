import prisma from "@config/database";
import { Prisma } from "@prisma/client";

export type AboutCreateDTO = {
    org_name?: string | null;
    description?: string | null;
    mission?: string | null;
    vision?: string | null;
    email?: string | null;
    phone?: string | null;
    hotline?: string | null;
    website?: string | null;
    address?: string | null;
    facebook_url?: string | null;
    zalo_url?: string | null;
    created_by?: string | null;
    version?: number | null;
};

export type AboutUpdateDTO = Partial<AboutCreateDTO>;

export type AboutListQuery = {
    q?: string; // search theo org_name / description / address
    page?: number; // 1-based
    page_size?: number; // default 20, max 100
    category?: string;
    about_id?: number;
};

function buildAboutWhere(
    q?: string,
    category?: string,
    about_id?: number
): Prisma.about_meWhereInput {
    const orConditions: Prisma.about_meWhereInput[] = [];

    if (q && q.trim() !== "") {
        const keyword = q.trim();
        orConditions.push(
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
            { address: { contains: keyword, mode: "insensitive" } }
        );

        const numericId = Number(keyword);
        if (!Number.isNaN(numericId)) {
            orConditions.push({ about_id: numericId });
        }
    }

    if (category && category.trim() !== "") {
        orConditions.push({
            category: { contains: category.trim(), mode: "insensitive" },
        });
    }

    if (about_id) {
        orConditions.push({ about_id });
    }

    // nếu có ít nhất 1 điều kiện OR, gán where.OR
    const where: Prisma.about_meWhereInput = {};
    if (orConditions.length > 0) {
        where.OR = orConditions;
    }

    return where;
}

export class AboutService {
    static async create(data: AboutCreateDTO) {
        const created = await prisma.about_me.create({ data });
        return created;
    }

    static async getById(aboutId: number) {
        const found = await prisma.about_me.findUnique({
            where: { about_id: aboutId },
        });
        if (!found) throw new Error("ABOUT_NOT_FOUND");
        return found;
    }

    static async list(query: AboutListQuery) {
        const page = Math.max(1, query.page ?? 1);
        const take = Math.max(1, Math.min(query.page_size ?? 20, 100));
        const skip = (page - 1) * take;

        const where = buildAboutWhere(query.q, query.category, query.about_id);

        const [items, total] = await Promise.all([
            prisma.about_me.findMany({
                where,
                skip,
                take,
                orderBy: { about_id: "asc" },
            }),
            prisma.about_me.count({ where }),
        ]);

        return {
            items,
            page,
            page_size: take,
            total,
            total_pages: Math.ceil(total / take),
        };
    }

    static async update(aboutId: number, data: AboutUpdateDTO) {
        try {
            const updated = await prisma.about_me.update({
                where: { about_id: aboutId },
                data: { ...data, updated_by: data.created_by },
            });
            return updated;
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("ABOUT_NOT_FOUND");
            throw e;
        }
    }

    static async remove(aboutId: number) {
        try {
            await prisma.about_me.delete({ where: { about_id: aboutId } });
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("ABOUT_NOT_FOUND");
            throw e;
        }
    }
}
