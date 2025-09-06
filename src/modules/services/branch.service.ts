import prisma from "@config/database";
import { Prisma } from "@prisma/client";

export type OpeningHours = Record<string, unknown> | null; // tuỳ format JSON bạn dùng

export type BranchCreateDTO = {
    about_id: number;
    branch_name: string;
    address: string;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    opening_hours?: OpeningHours;
    created_by?: string | null;
    version?: number | null;
};

export type BranchUpdateDTO = Partial<BranchCreateDTO>;

export type BranchListQuery = {
    about_id?: number; // lọc theo about
    q?: string; // search theo branch_name / address / phone
    page?: number;
    page_size?: number;
};

function buildBranchWhere(
    q?: string,
    aboutId?: number
): Prisma.branchWhereInput {
    return {
        AND: [
            aboutId ? { about_id: aboutId } : {},
            q
                ? {
                      OR: [
                          { branch_name: { contains: q, mode: "insensitive" } },
                          { address: { contains: q, mode: "insensitive" } },
                          { phone: { contains: q, mode: "insensitive" } },
                      ],
                  }
                : {},
        ],
    };
}

export class BranchService {
    static async create(data: BranchCreateDTO) {
        try {
            // kiểm tra FK about_id có tồn tại
            await prisma.about_me.findUniqueOrThrow({
                where: { about_id: data.about_id },
            });
            const created = await prisma.branch.create({
                data: {
                    branch_name: data.branch_name,
                    address: data.address,
                    phone: data.phone ?? null,
                    latitude: data.latitude ?? null,
                    longitude: data.longitude ?? null,
                    opening_hours:
                        data.opening_hours !== undefined
                            ? (data.opening_hours as Prisma.InputJsonValue)
                            : null,
                    created_by: data.created_by ?? null,
                    version: data.version ?? null,
                    about_me: {
                        connect: { about_id: data.about_id },
                    },
                },
            });
            return created;
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("ABOUT_NOT_FOUND");
            if (e?.code === "P2003") throw new Error("FK_VIOLATION"); // FK about_id
            throw e;
        }
    }

    static async getById(branchId: number) {
        const found = await prisma.branch.findUnique({
            where: { branch_id: branchId },
            include: { about_me: true },
        });
        if (!found) throw new Error("BRANCH_NOT_FOUND");
        return found;
    }

    static async list(query: BranchListQuery) {
        const page = Math.max(1, query.page ?? 1);
        const take = Math.max(1, Math.min(query.page_size ?? 20, 100));
        const skip = (page - 1) * take;

        const where = buildBranchWhere(query.q, query.about_id);

        const [items, total] = await Promise.all([
            prisma.branch.findMany({
                where,
                skip,
                take,
                orderBy: { created_at: "desc" },
                include: { about_me: true },
            }),
            prisma.branch.count({ where }),
        ]);

        return {
            items,
            page,
            page_size: take,
            total,
            total_pages: Math.ceil(total / take),
        };
    }

    static async update(branchId: number, data: BranchUpdateDTO) {
        try {
            // nếu đổi about_id thì xác thực FK
            if (data.about_id != null) {
                await prisma.about_me.findUniqueOrThrow({
                    where: { about_id: data.about_id },
                });
            }

            // Remove about_id from update data as it's not updatable
            const { about_id, ...updateData } = data;

            // Ensure opening_hours is compatible with Prisma's InputJsonValue
            let opening_hours: Prisma.InputJsonValue | null = null;
            if (updateData.opening_hours !== undefined) {
                opening_hours =
                    updateData.opening_hours === null
                        ? null
                        : (updateData.opening_hours as Prisma.InputJsonValue);
            }

            const updated = await prisma.branch.update({
                where: { branch_id: branchId },
                data: {
                    ...updateData,
                    opening_hours,
                    updated_by: data.created_by,
                },
            });
            return updated;
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("BRANCH_NOT_FOUND");
            if (e?.code === "P2003") throw new Error("FK_VIOLATION");
            throw e;
        }
    }

    static async remove(branchId: number) {
        try {
            await prisma.branch.delete({ where: { branch_id: branchId } });
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("BRANCH_NOT_FOUND");
            throw e;
        }
    }
}
