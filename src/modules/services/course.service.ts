import prisma from "@config/database";
import { $Enums, Prisma } from "@prisma/client";
import slugify from "slugify";

export type CourseCreateDTO = {
    course_code?: string | null;
    course_name: string;
    slug?: string | null;
    short_description?: string | null;
    description?: string | null;
    level?: string; // course_level enum value as string
    mode?: string; // course_mode enum value as string
    language?: string | null;
    price?: number | null;
    duration_hours?: number | null;
    start_date?: string | Date | null;
    end_date?: string | Date | null;
    image_url?: string | null;
    created_by?: string | null;
    version?: number | null;
};

export type CourseUpdateDTO = Partial<CourseCreateDTO>;

export type CourseListQuery = {
    q?: string; // search
    level?: string;
    mode?: string;
    language?: string;
    min_price?: number;
    max_price?: number;
    start_after?: string | Date;
    end_before?: string | Date;
    sort_by?: "created_at" | "price" | "start_date" | "course_name";
    sort_order?: "asc" | "desc";
    page?: number; // 1-based
    page_size?: number; // default 20
};

/** Tạo slug duy nhất từ course_name hoặc slug truyền vào */
async function ensureUniqueSlug(
    base: string,
    courseIdToExclude?: number
): Promise<string> {
    const baseSlug =
        slugify(base, { lower: true, strict: true, trim: true }) || "course";
    let candidate = baseSlug;
    let i = 1;
    while (true) {
        const found = await prisma.course.findFirst({
            where: {
                slug: candidate,
                ...(courseIdToExclude
                    ? { course_id: { not: courseIdToExclude } }
                    : {}),
            },
            select: { course_id: true },
        });
        if (!found) return candidate;
        i += 1;
        candidate = `${baseSlug}-${i}`;
    }
}

/** Chuẩn hóa data trước khi đưa vào Prisma */
function normalizeCreateInput(input: CourseCreateDTO) {
    const data: Prisma.courseCreateInput = {
        course_code: input.course_code ?? null,
        course_name: input.course_name,
        slug: input.slug ?? null,
        short_description: input.short_description ?? null,
        description: input.description ?? null,
        level: (input.level as any) ?? $Enums.course_level.BEGINNER,
        mode: (input.mode as any) ?? undefined, // enum trên DB
        language: input.language ?? "en",
        price: input.price ?? 0,
        duration_hours: input.duration_hours ?? null,
        start_date: input.start_date ? new Date(input.start_date) : null,
        end_date: input.end_date ? new Date(input.end_date) : null,
        image_url: input.image_url ?? null,
        created_by: input.created_by ?? null,
        version: input.version ?? 1,
        // created_at/updated_at: DB default
    };
    return data;
}

function normalizeUpdateInput(input: CourseUpdateDTO) {
    const data: Prisma.courseUpdateInput = {
        course_code: input.course_code ?? undefined,
        course_name: input.course_name ?? undefined,
        slug: input.slug ?? undefined,
        short_description: input.short_description ?? undefined,
        description: input.description ?? undefined,
        level: (input.level as any) ?? undefined,
        mode: (input.mode as any) ?? undefined,
        language: input.language ?? undefined,
        price: input.price ?? undefined,
        duration_hours: input.duration_hours ?? undefined,
        start_date: input.start_date ? new Date(input.start_date) : undefined,
        end_date: input.end_date ? new Date(input.end_date) : undefined,
        image_url: input.image_url ?? undefined,
        updated_by: input.created_by ?? undefined,
        version: input.version ?? undefined,
    };
    return data;
}

export class CourseService {
    static async createCourse(input: CourseCreateDTO) {
        // đảm bảo slug
        const desiredSlug = input.slug || input.course_name;
        const uniqueSlug = await ensureUniqueSlug(desiredSlug!);

        const data = normalizeCreateInput({ ...input, slug: uniqueSlug });

        try {
            const created = await prisma.course.create({ data });
            return created;
        } catch (e: any) {
            if (e?.code === "P2002") {
                // unique violation (course_code or slug)
                throw new Error("COURSE_CONFLICT"); // controller sẽ map 409
            }
            throw e;
        }
    }

    static async getCourseById(courseId: number) {
        const found = await prisma.course.findUnique({
            where: { course_id: courseId },
        });
        if (!found) throw new Error("COURSE_NOT_FOUND");
        return found;
    }

    static async listCourses(query: CourseListQuery) {
        const {
            q,
            level,
            mode,
            language,
            min_price,
            max_price,
            start_after,
            end_before,
            sort_by = "created_at",
            sort_order = "desc",
            page = 1,
            page_size = 20,
        } = query;

        const where: Prisma.courseWhereInput = {
            AND: [
                q
                    ? {
                          OR: [
                              {
                                  course_name: {
                                      contains: q,
                                      mode: "insensitive",
                                  },
                              },
                              {
                                  course_code: {
                                      contains: q,
                                      mode: "insensitive",
                                  },
                              },
                              { slug: { contains: q, mode: "insensitive" } },
                          ],
                      }
                    : {},
                level ? { level: level as any } : {},
                mode ? { mode: mode as any } : {},
                language ? { language: { equals: language } } : {},
                min_price != null ? { price: { gte: min_price } } : {},
                max_price != null ? { price: { lte: max_price } } : {},
                start_after
                    ? { start_date: { gte: new Date(start_after) } }
                    : {},
                end_before ? { end_date: { lte: new Date(end_before) } } : {},
            ],
        };

        const orderBy: Prisma.courseOrderByWithRelationInput = {
            [sort_by]: sort_order,
        };

        const skip = (Math.max(1, page) - 1) * Math.max(1, page_size);
        const take = Math.max(1, Math.min(page_size, 100));

        const [items, total] = await Promise.all([
            prisma.course.findMany({ where, orderBy, skip, take }),
            prisma.course.count({ where }),
        ]);

        return {
            items,
            page: Math.max(1, page),
            page_size: take,
            total,
            total_pages: Math.ceil(total / take),
        };
    }

    static async updateCourse(courseId: number, input: CourseUpdateDTO) {
        // nếu đổi tên hoặc đổi slug thì cần đảm bảo slug unique
        let data = normalizeUpdateInput(input);

        if (input.slug || input.course_name) {
            const base = input.slug || input.course_name!;
            const uniqueSlug = await ensureUniqueSlug(base, courseId);
            data.slug = uniqueSlug;
        }

        try {
            const updated = await prisma.course.update({
                where: { course_id: courseId },
                data,
            });
            return updated;
        } catch (e: any) {
            if (e?.code === "P2002") throw new Error("COURSE_CONFLICT");
            if (e?.code === "P2025") throw new Error("COURSE_NOT_FOUND");
            throw e;
        }
    }

    static async deleteCourse(courseId: number) {
        try {
            await prisma.course.delete({ where: { course_id: courseId } });
        } catch (e: any) {
            if (e?.code === "P2025") throw new Error("COURSE_NOT_FOUND");
            throw e;
        }
    }
}
