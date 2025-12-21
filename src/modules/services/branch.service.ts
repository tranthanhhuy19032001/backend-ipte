import prisma from "@config/database";
import { Prisma } from "@prisma/client";
import slugify from "slugify";
import { BranchDTO, mapToBranchDTO } from "@dto/BranchDTO";

function mapToEntity(data: any): any {
    return {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.deleteImageUrl !== undefined && { delete_image_url: data.deleteImageUrl }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.mission !== undefined && { mission: data.mission }),
        ...(data.vision !== undefined && { vision: data.vision }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.hotline !== undefined && { hotline: data.hotline }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.facebookUrl !== undefined && { facebook_url: data.facebookUrl }),
        ...(data.zaloUrl !== undefined && { zalo_url: data.zaloUrl }),
        ...(data.mapUrl !== undefined && { map_url: data.mapUrl }),
        ...(data.tiktokUrl !== undefined && { tiktok_url: data.tiktokUrl }),
        ...(data.youtubeUrl !== undefined && { youtube_url: data.youtubeUrl }),
        ...(data.category !== undefined && { category: data.category }),
    };
}

export class BranchService {
    static async createBranch(payload: Partial<BranchDTO>) {
        const slugSource = payload.slug ?? payload.title ?? "about";
        const desiredSlug =
            (typeof slugSource === "string" ? slugSource.trim() : slugSource) || "about";
        const uniqueSlug = await ensureUniqueAboutSlug(desiredSlug);
        const data: Prisma.about_branchCreateInput = {
            ...mapToEntity({
                ...payload,
                slug: uniqueSlug,
            }),
            slug: uniqueSlug,
            category: payload.category ?? "BRANCH",
            created_by: payload.createdBy || "system",
            updated_by: payload.updatedBy || "system",
            version: payload.version ?? 1,
        };
        const created = await prisma.about_branch.create({ data });

        return mapToBranchDTO(created);
    }

    static async getById(id: number) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("BRANCH_NOT_FOUND");
        return mapToBranchDTO(found);
    }

    static async list(query: { category?: string; q?: string; page?: number; page_size?: number }) {
        const page = Math.max(1, query.page || 1);
        const page_size = Math.max(1, Math.min(query.page_size || 20, 100));
        const where: Prisma.about_branchWhereInput = {};
        if (query.q) {
            where.OR = [
                { title: { contains: query.q, mode: "insensitive" } },
                { description: { contains: query.q, mode: "insensitive" } },
            ];
        }
        where.category = "BRANCH";
        const skip = (page - 1) * page_size;
        const take = page_size;
        const [items, total] = await Promise.all([
            prisma.about_branch.findMany({ where, skip, take }),
            prisma.about_branch.count({ where }),
        ]);

        return {
            items: items.map(mapToBranchDTO),
            total,
        };
    }
    static async update(id: number, payload: Partial<BranchDTO>) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("BRANCH_NOT_FOUND");
        if (payload.slug) {
            const uniqueSlug = await ensureUniqueAboutSlug(payload.slug, id);
            payload.slug = uniqueSlug;
        }
        const data: Prisma.about_branchUpdateInput = {
            ...mapToEntity(payload),
            updated_by: payload.updatedBy || "system",
        };
        const updated = await prisma.about_branch.update({
            where: { about_branch_id: id },
            data,
        });
        return mapToBranchDTO(updated);
    }
    static async remove(id: number) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("BRANCH_NOT_FOUND");
        await prisma.about_branch.delete({ where: { about_branch_id: id } });
    }
}

async function ensureUniqueAboutSlug(base: string, aboutIdToExclude?: number): Promise<string> {
    const baseSlug = slugify(base, { lower: true, strict: true, trim: true }) || "about";
    let candidate = baseSlug;
    let i = 1;
    while (true) {
        const found = await prisma.about_branch.findFirst({
            where: {
                slug: candidate,
                ...(aboutIdToExclude ? { about_branch_id: { not: aboutIdToExclude } } : {}),
            },
            select: { about_branch_id: true },
        });
        if (!found) return candidate;
        i += 1;
        candidate = `${baseSlug}-${i}`;
    }
}
