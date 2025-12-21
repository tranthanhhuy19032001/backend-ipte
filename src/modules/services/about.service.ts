import prisma from "@config/database";
import { Prisma } from "@prisma/client";
import slugify from "slugify";
import { ImgbbResponse, ImgbbService } from "@services/imgbb.service";
import { AboutDTO } from "@dto/AboutDTO";
import { BranchDTO, mapToBranchDTO } from "@dto/BranchDTO";

export type AboutUpdateDTO = Partial<AboutDTO>;

export type AboutListQuery = {
    q?: string;
    page?: number;
    page_size?: number;
    category?: string;
    aboutId?: number;
};

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

function buildAboutWhere(
    q?: string,
    category?: string,
    about_id?: number
): Prisma.about_branchWhereInput {
    const orConditions: Prisma.about_branchWhereInput[] = [];

    if (q && q.trim() !== "") {
        const keyword = q.trim();
        orConditions.push(
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
            { address: { contains: keyword, mode: "insensitive" } }
        );

        const numericId = Number(keyword);
        if (!Number.isNaN(numericId)) {
            orConditions.push({ about_branch_id: numericId });
        }
    }

    if (category && category.trim() !== "") {
        orConditions.push({
            category: { contains: category.trim(), mode: "insensitive" },
        });
    }

    if (about_id !== undefined) {
        orConditions.push({ about_branch_id: about_id });
    }

    const where: Prisma.about_branchWhereInput = {};
    if (orConditions.length > 0) {
        where.OR = orConditions;
    }
    return where;
}

export class AboutService {
    static async create(payload: Partial<AboutDTO>, file?: Express.Multer.File) {
        const slugSource = payload.slug ?? payload.title ?? "about";
        const desiredSlug =
            (typeof slugSource === "string" ? slugSource.trim() : slugSource) || "about";
        const uniqueSlug = await ensureUniqueAboutSlug(desiredSlug);

        let imgbbResponse: ImgbbResponse | undefined;
        try {
            imgbbResponse = await ImgbbService.uploadFromInput(payload.image, file, {
                fileName: uniqueSlug,
            });
        } catch (err: any) {
            console.error("Error uploading image to IMGBB:", err?.message || err);
            throw new Error(`IMAGE_UPLOAD_FAILED: ${err?.message || "UNKNOWN"}`);
        }

        const data: Prisma.about_branchCreateInput = {
            ...mapToEntity({
                ...payload,
                slug: uniqueSlug,
                image: imgbbResponse?.data?.display_url ?? payload.image ?? null,
            }),
            slug: uniqueSlug,
            created_by: payload.createdBy || "system",
            updated_by: payload.updatedBy || "system",
            version: payload.version ?? 1,
        };

        const created = await prisma.about_branch.create({ data });
        return created;
    }

    static async getById(id: number) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("ABOUT_NOT_FOUND");
        return found;
    }

    static async list(query: AboutListQuery & { page_size?: number; about_id?: number }) {
        const page = Math.max(1, query.page || 1);
        const page_size = Math.max(1, Math.min(query.page_size || 20, 100));
        const where = buildAboutWhere(query.q, query.category, query.about_id);

        const skip = (page - 1) * page_size;
        const take = page_size;

        const [items, total] = await Promise.all([
            prisma.about_branch.findMany({ where, skip, take }),
            prisma.about_branch.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            page_size,
            total_pages: Math.ceil(total / page_size),
        };
    }

    static async update(id: number, payload: Partial<AboutDTO>, file?: Express.Multer.File) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("ABOUT_NOT_FOUND");

        const slugSource = payload.slug ?? payload.title ?? found.slug ?? found.title ?? "about";
        const desiredSlug =
            (typeof slugSource === "string" ? slugSource.trim() : slugSource) || "about";
        const uniqueSlug = await ensureUniqueAboutSlug(desiredSlug, id);

        let imgbbResponse: ImgbbResponse | undefined;
        if (payload.isImageChanged && payload.deleteImageUrl) {
            try {
                const deletedResponse = await ImgbbService.deleteByDeleteUrl(
                    payload.deleteImageUrl
                );
                imgbbResponse = await ImgbbService.uploadFromInput(payload.image, file, {
                    fileName: uniqueSlug,
                });
            } catch (err: any) {
                if (err) {
                    console.error("Error uploading image to IMGBB:", err?.message || err);
                }
                throw new Error(`IMAGE_UPLOAD_FAILED: ${err?.message || "UNKNOWN"}`);
            }
        }

        let image: string | undefined;
        let deleteImageUrl: string | undefined;
        if (imgbbResponse) {
            image = imgbbResponse?.data?.display_url;
            deleteImageUrl = imgbbResponse?.data?.delete_url;
        }

        const data: Prisma.about_branchUpdateInput = {
            ...mapToEntity({
                ...payload,
                slug: uniqueSlug,
                image: image ?? payload.image ?? undefined,
                ...(deleteImageUrl !== undefined ? { deleteImageUrl: deleteImageUrl } : {}),
            }),
            updated_at: new Date(),
            updated_by: payload.updatedBy || "system",
            version: { increment: 1 },
        };

        const updated = await prisma.about_branch.update({
            where: { about_branch_id: id },
            data,
        });
        return updated;
    }

    static async remove(id: number) {
        const found = await prisma.about_branch.findUnique({ where: { about_branch_id: id } });
        if (!found) throw new Error("ABOUT_NOT_FOUND");
        return prisma.about_branch.delete({ where: { about_branch_id: id } });
    }

    static async listByCategory(category?: string) {
        const items = await prisma.about_branch.findMany({
            where: category ? { category } : {},
        });
        return items;
    }

    static async getBySlug(slug: string) {
        const item = await prisma.about_branch.findFirst({ where: { slug } });
        return item;
    }
    static async getByCategory(category: string) {
        const item = await prisma.about_branch.findFirst({ where: { category } });
        return item;
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
