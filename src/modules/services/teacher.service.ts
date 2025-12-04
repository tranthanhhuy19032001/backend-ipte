import { TeacherDAO } from "../dao/teacher.dao";
import { teacher, Prisma } from "@prisma/client";
import { AboutService } from "@services/about.service";
import slugify from "slugify";
import { saveBase64Image, deleteImage } from "@utils/imageHandler";
import prisma from "@config/database";

type TeacherResponse = {
    features: {
        icon: null;
        title: string;
        description: string;
    }[];
    data: {
        id: number;
        name: string;
        image: string;
        overallScore: string;
        listening: string;
        reading: string;
        speaking: string;
        writing: string;
    }[];
};

type CreateTeacherInput = {
    userId?: number;
    bio?: string;
    name: string;
    image?: string | null;
    overallScore?: number;
    listeningScore?: number;
    speakingScore?: number;
    readingScore?: number;
    writingScore?: number;
    slug?: string;
    content?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
};

export class TeacherService {
    private teacherDAO: TeacherDAO;

    constructor() {
        this.teacherDAO = new TeacherDAO();
    }

    async getTeacherById(id: number): Promise<teacher | null> {
        return this.teacherDAO.findById(id);
    }

    async getAllTeachers(): Promise<TeacherResponse> {
        const teachers = await this.teacherDAO.findAll();

        const teachersData = teachers.map((teacher) => ({
            id: teacher.teacher_id,
            name: teacher.name,
            image: teacher.image ?? "",
            overallScore: teacher.overall_score?.toString() ?? "",
            listening: teacher.listening_score?.toString() ?? "",
            reading: teacher.reading_score?.toString() ?? "",
            speaking: teacher.speaking_score?.toString() ?? "",
            writing: teacher.writing_score?.toString() ?? "",
        }));

        const teacherfeatures = await AboutService.list({
            category: "TEACHER",
        });

        const teacherfeaturesData = teacherfeatures.items.map((feature) => ({
            icon: null,
            title: feature.title?.toString() ?? "",
            description: feature.description?.toString() ?? "",
        }));

        return {
            features: teacherfeaturesData,
            data: teachersData,
        };
    }

    async createTeacher(input: CreateTeacherInput): Promise<teacher> {
        const desiredSlug = input.slug || input.name;
        const uniqueSlug = await ensureUniqueTeacherSlug(desiredSlug);

        let imagePath: string | null = null;
        const image = input.image || null;
        if (image !== null && image.startsWith("data:image")) {
            try {
                imagePath = await saveBase64Image(image);
            } catch (e: any) {
                console.error("Error processing image:", e.message);
                throw new Error(`IMAGE_PROCESS_ERROR: ${e.message}`);
            }
        } else if (image !== null) {
            imagePath = image;
        }

        const data = normalizeCreateInput({ ...input, slug: uniqueSlug, image: imagePath });

        try {
            const created = await this.teacherDAO.create(data);
            return created;
        } catch (e: any) {
            if (imagePath) {
                deleteImage(imagePath);
            }
            console.error("Error creating teacher:", {
                code: e?.code,
                message: e?.message,
                meta: e?.meta,
                data: data,
            });
            throw e;
        }
    }

    async updateTeacher(id: number, input: Partial<CreateTeacherInput>): Promise<teacher> {
        const existing = await this.teacherDAO.findById(id);
        if (!existing) {
            throw new Error("TEACHER_NOT_FOUND");
        }

        const desiredSlug = input.slug || input.name || existing.name || existing.slug;
        const uniqueSlug = await ensureUniqueTeacherSlug(desiredSlug, id);

        let imagePath: string | null | undefined = input.image;
        if (imagePath !== undefined && imagePath !== null && imagePath.startsWith("data:image")) {
            try {
                imagePath = await saveBase64Image(imagePath);
            } catch (e: any) {
                console.error("Error processing image:", e.message);
                throw new Error(`IMAGE_PROCESS_ERROR: ${e.message}`);
            }
        }

        const data = normalizeUpdateInput({ ...input, slug: uniqueSlug, image: imagePath });
        return this.teacherDAO.update(id, data);
    }

    async deleteTeacher(id: number): Promise<teacher> {
        return this.teacherDAO.delete(id);
    }

    async getTeachers(filters: {
        name?: string;
        overallScore?: number;
        listeningScore?: number;
        speakingScore?: number;
        writingScore?: number;
        page: number;
        pageSize: number;
    }): Promise<{ items: teacher[]; total: number }> {
        return this.teacherDAO.findWithFilters(filters);
    }

    async getTeacherDetail(id?: number, slug?: string): Promise<teacher | null> {
        if (id !== undefined) {
            return this.teacherDAO.findById(id);
        } else if (slug !== undefined) {
            return this.teacherDAO.findBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
    }
}

function normalizeCreateInput(input: CreateTeacherInput & { slug: string; image?: string | null }) {
    const data: Prisma.teacherUncheckedCreateInput = {
        name: input.name,
        slug: input.slug,
        ...(input.bio && { bio: input.bio }),
        ...(input.userId && { user_id: input.userId }),
        ...(input.image && { image: input.image }),
        ...(input.overallScore !== undefined && { overall_score: input.overallScore }),
        ...(input.listeningScore !== undefined && { listening_score: input.listeningScore }),
        ...(input.speakingScore !== undefined && { speaking_score: input.speakingScore }),
        ...(input.readingScore !== undefined && { reading_score: input.readingScore }),
        ...(input.writingScore !== undefined && { writing_score: input.writingScore }),
        ...(input.content && { content: input.content }),
        created_by: input.createdBy || "system",
        updated_by: input.updatedBy || "system",
        version: 1,
    };
    return data;
}

function normalizeUpdateInput(
    input: Partial<CreateTeacherInput> & { slug: string; image?: string | null | undefined }
) {
    const data: Prisma.teacherUncheckedUpdateInput = {
        ...(input.name && { name: input.name }),
        ...(input.slug && { slug: input.slug }),
        ...(input.bio && { bio: input.bio }),
        ...(input.userId && { user_id: input.userId }),
        ...(input.image !== undefined && { image: input.image }),
        ...(input.overallScore !== undefined && { overall_score: input.overallScore }),
        ...(input.listeningScore !== undefined && { listening_score: input.listeningScore }),
        ...(input.speakingScore !== undefined && { speaking_score: input.speakingScore }),
        ...(input.readingScore !== undefined && { reading_score: input.readingScore }),
        ...(input.writingScore !== undefined && { writing_score: input.writingScore }),
        ...(input.content && { content: input.content }),
        updated_at: new Date(),
        updated_by: input.updatedBy || "system",
        version: { increment: 1 },
    };
    return data;
}

async function ensureUniqueTeacherSlug(base: string, teacherIdToExclude?: number): Promise<string> {
    const baseSlug = slugify(base, { lower: true, strict: true, trim: true }) || "teacher";
    let candidate = baseSlug;
    let i = 1;
    while (true) {
        const found = await prisma.teacher.findFirst({
            where: {
                slug: candidate,
                ...(teacherIdToExclude ? { teacher_id: { not: teacherIdToExclude } } : {}),
            },
            select: { teacher_id: true },
        });
        if (!found) return candidate;
        i += 1;
        candidate = `${baseSlug}-${i}`;
    }
}
