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
};

function buildAboutWhere(
    q?: string,
    category?: string
): Prisma.about_meWhereInput {
    const where: Prisma.about_meWhereInput = {};

    if (q) {
        where.OR = [
            { org_name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
        ];
    }
    if (category) {
        where.category = category;
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
            include: { branch: true }, // kèm các chi nhánh
        });
        if (!found) throw new Error("ABOUT_NOT_FOUND");
        return found;
    }

    static async list(query: AboutListQuery) {
        const page = Math.max(1, query.page ?? 1);
        const take = Math.max(1, Math.min(query.page_size ?? 20, 100));
        const skip = (page - 1) * take;

        const where = buildAboutWhere(query.q, query.category);

        const [items, total] = await Promise.all([
            prisma.about_me.findMany({
                where,
                skip,
                take,
                orderBy: { created_at: "desc" },
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
