import prisma from "@config/database";
import { Prisma } from "@prisma/client";
import { ImgbbResponse, ImgbbService } from "@services/imgbb.service";
import { FacilityDTO, mapFromMediaToFacilityDTO, VideoDTO, mapFromMediaToVideoDTO } from "@dto/MediaDTO";

function mapToEntity(data: any): any {
    return {
    };
}

export class MediaService {
    static async createFacility(payload: Partial<FacilityDTO>, file?: Express.Multer.File) {
        let imgbbResponse: ImgbbResponse | undefined;
        try {
            imgbbResponse = await ImgbbService.uploadFromInput(null, file);
        } catch (err: any) {
            console.error("Error uploading image to IMGBB:", err?.message || err);
            throw new Error(`IMAGE_UPLOAD_FAILED: ${err?.message || "UNKNOWN"}`);
        }

        const data: Prisma.mediaCreateInput = {
            title: payload.title || "",
            description: payload.description || null,
            image_name: file?.originalname || null,
            image_url: imgbbResponse?.data?.display_url ?? payload.imageUrl ?? null,
            media_type: 'FACILITY',
            delete_image_url: imgbbResponse?.data?.delete_url ?? null,
            created_at: new Date(),
            created_by: payload.createdBy || "system",
            updated_by: payload.updatedBy || "system",
            version: 1,
        };

        const created = await prisma.media.create({ data });
        return mapFromMediaToFacilityDTO(created);
    }

    static async updateFacilityOrReviews(id: number, payload: Partial<FacilityDTO>, file?: Express.Multer.File) {
        const existing = await prisma.media.findUnique({ where: { media_id: id } });
        if (!existing) throw new Error("FACILITY_NOT_FOUND");

        let imgbbResponse: ImgbbResponse | undefined;
        if (payload.isImageChanged && file) {
            try {
                imgbbResponse = await ImgbbService.uploadFromInput(null, file);
            } catch (err: any) {
                if (err) {
                    console.error("Error uploading image to IMGBB:", err?.message || err);
                }
                throw new Error(`IMAGE_UPLOAD_FAILED: ${err?.message || "UNKNOWN"}`);
            }
        }

        const data: Prisma.mediaUpdateInput = {
            title: payload.title,
            description: payload.description,
            image_name: file?.originalname,
            image_url: imgbbResponse?.data?.display_url || existing.image_url,
            delete_image_url: imgbbResponse?.data?.delete_url || existing.delete_image_url,
            updated_at: new Date(),
            updated_by: payload.updatedBy || existing.updated_by,
            version: (existing.version || 1) + 1,
        };
        await prisma.deleted_image.create({ data: { delete_image_url: existing.delete_image_url || "" } });
        const updated = await prisma.media.update({ where: { media_id: id }, data });
        return mapFromMediaToFacilityDTO(updated);
    }

    static async listFacilities() {
        const facilities = await prisma.media.findMany({
            where: { media_type: 'FACILITY' },
            orderBy: { created_at: 'desc' },
        });
        return facilities.map(mapFromMediaToFacilityDTO);
    }

    static async createVideo(payload: Partial<VideoDTO>) {
        const data: Prisma.mediaCreateInput = {
            title: payload.title || "",
            description: payload.description || null,
            video_url: payload.videoUrl || null,
            media_type: 'VIDEO',
            created_at: new Date(),
            created_by: payload.createdBy || "system",
            version: 1,
        };

        const created = await prisma.media.create({ data });
        return mapFromMediaToVideoDTO(created);
    }

    static async updateVideo(id: number, payload: Partial<VideoDTO>) {
        const existing = await prisma.media.findUnique({ where: { media_id: id } });
        if (!existing) throw new Error("VIDEO_NOT_FOUND");
        const data: Prisma.mediaUpdateInput = {
            title: payload.title,
            description: payload.description,
            video_url: payload.videoUrl,
            updated_at: new Date(),
            updated_by: payload.updatedBy || existing.updated_by,
            version: (existing.version || 1) + 1,
        };
        const updated = await prisma.media.update({ where: { media_id: id }, data });
        return mapFromMediaToVideoDTO(updated);
    }

    static async listVideos() {
        const videos = await prisma.media.findMany({
            where: { media_type: 'VIDEO' },
            orderBy: { created_at: 'desc' },
        });
        return videos.map(mapFromMediaToVideoDTO);
    }

    static async createReviews(payload: Partial<FacilityDTO>, file?: Express.Multer.File) {
        let imgbbResponse: ImgbbResponse | undefined;
        try {
            imgbbResponse = await ImgbbService.uploadFromInput(payload.imageName, file);
        } catch (err: any) {
            console.error("Error uploading image to IMGBB:", err?.message || err);
            throw new Error(`IMAGE_UPLOAD_FAILED: ${err?.message || "UNKNOWN"}`);
        }

        const data: Prisma.mediaCreateInput = {
            title: payload.title || "",
            description: payload.description || null,
            image_name: file?.originalname || null,
            image_url: imgbbResponse?.data?.display_url ?? payload.imageUrl ?? null,
            media_type: 'REVIEWS',
            delete_image_url: imgbbResponse?.data?.delete_url ?? null,
            created_at: new Date(),
            created_by: payload.createdBy || "system",
            updated_by: payload.updatedBy || "system",
            version: 1,
        };

        const created = await prisma.media.create({ data });
        return mapFromMediaToFacilityDTO(created);
    }

    static async listReviews() {
        const facilities = await prisma.media.findMany({
            where: { media_type: 'REVIEWS' },
            orderBy: { created_at: 'desc' },
        });
        return facilities.map(mapFromMediaToFacilityDTO);
    }
}