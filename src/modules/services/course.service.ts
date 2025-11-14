import prisma from "@config/database";
import { $Enums, Prisma } from "@prisma/client";
import slugify from "slugify";

export type CourseCreateDTO = {
    course_code?: string | null;
    course_name: string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    level?: string;
    mode?: string;
    language?: string | null;
    price?: number | null;
    duration?: string | null;
    start_date?: string | Date | null;
    end_date?: string | Date | null;
    image?: string | null;
    created_by?: string | null;
    version?: number | null;
    schedule: string | null;
    tuition: string | null;
    content: string | null;
};

export type CourseUpdateDTO = Partial<CourseCreateDTO>;

export type CourseListQuery = {
    q?: string; // search
    courseName?: string;
    title?: string;
    description?: string;
    schedule?: string;
    tuition?: string;
    slug?: string;
    category?: string;
    categoryId?: number;
    sortBy?: "price" | "created_at" | "updated_at";
    orderBy?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

/** Tạo slug duy nhất từ course_name hoặc slug truyền vào */
async function ensureUniqueSlug(base: string, courseIdToExclude?: number): Promise<string> {
    const baseSlug = slugify(base, { lower: true, strict: true, trim: true }) || "course";
    let candidate = baseSlug;
    let i = 1;
    while (true) {
        const found = await prisma.course.findFirst({
            where: {
                slug: candidate,
                ...(courseIdToExclude ? { course_id: { not: courseIdToExclude } } : {}),
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
        title: input.title ?? null,
        description: input.description ?? null,
        level: (input.level as any) ?? $Enums.course_level.BEGINNER,
        mode: (input.mode as any) ?? undefined,
        language: input.language ?? "en",
        price: input.price ?? 0,
        duration: input.duration ?? null,
        start_date: input.start_date ? new Date(input.start_date) : null,
        end_date: input.end_date ? new Date(input.end_date) : null,
        image: input.image ?? null,
        created_by: input.created_by ?? null,
        version: input.version ?? 1,
        schedule: input.schedule,
        tuition: input.tuition,
        content: input.content,
    };
    return data;
}

function normalizeUpdateInput(input: CourseUpdateDTO) {
    const data: Prisma.courseUpdateInput = {
        course_code: input.course_code ?? undefined,
        course_name: input.course_name ?? undefined,
        slug: input.slug ?? undefined,
        title: input.title ?? undefined,
        description: input.description ?? undefined,
        level: (input.level as any) ?? undefined,
        mode: (input.mode as any) ?? undefined,
        language: input.language ?? undefined,
        price: input.price ?? undefined,
        duration: input.duration ?? undefined,
        start_date: input.start_date ? new Date(input.start_date) : undefined,
        end_date: input.end_date ? new Date(input.end_date) : undefined,
        image: input.image ?? undefined,
        updated_by: input.created_by ?? undefined,
        version: input.version ?? undefined,
        schedule: input.schedule ?? undefined,
        tuition: input.tuition ?? undefined,
        content: input.content ?? undefined,
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
            courseName,
            title,
            description,
            schedule,
            tuition,
            slug,
            category,
            categoryId,
            sortBy: sort_by = "created_at",
            orderBy: sort_order = "asc",
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
                courseName
                    ? {
                          course_name: {
                              contains: courseName,
                              mode: "insensitive",
                          },
                      }
                    : {},
                title
                    ? {
                          title: {
                              contains: title,
                              mode: "insensitive",
                          },
                      }
                    : {},
                description
                    ? {
                          description: {
                              contains: description,
                              mode: "insensitive",
                          },
                      }
                    : {},
                schedule
                    ? {
                          schedule: {
                              contains: schedule,
                              mode: "insensitive",
                          },
                      }
                    : {},
                tuition
                    ? {
                          tuition: {
                              contains: tuition,
                              mode: "insensitive",
                          },
                      }
                    : {},
                category
                    ? {
                          category: {
                              equals: category as $Enums.course_category,
                          },
                      }
                    : {},
                categoryId
                    ? {
                          category_id: { equals: categoryId },
                      }
                    : {},
                slug ? { slug: { equals: slug } } : {},
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

    static async getCourseBySlug(slug: string) {
        const found = await prisma.course.findUnique({ where: { slug } });
        if (!found) throw new Error("COURSE_NOT_FOUND");
        return found;
    }

    static async getCourseDetail(id?: number, slug?: string) {
        if (id !== undefined) {
            return this.getCourseById(id);
        } else if (slug !== undefined) {
            return this.getCourseBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
    }
}
