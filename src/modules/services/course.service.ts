import prisma from "@config/database";
import { $Enums, Prisma } from "@prisma/client";
import slugify from "slugify";
import { saveBase64Image, deleteImage } from "@utils/imageHandler";
import { SeoEvaluationInput } from "@dto/SeoEvaluationInput";

export type CourseUpdateDTO = Partial<SeoEvaluationInput>;

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
function normalizeCreateInput(input: SeoEvaluationInput) {
    const data: Prisma.courseCreateInput = {
        course_name: input.title,
        slug: input.slug!,
        title: input.title,
        ...(input.description && { description: input.description }),
        ...(input.level && { level: input.level as any }),
        ...(input.category && { category: input.category as any }),
        ...(input.categoryId && { category_id: input.categoryId }),
        is_disabled: input.isDisabled ?? false,
        is_featured: input.isFeatured ?? false,
        ...(input.image && { image: input.image }),
        ...(input.content && { content: input.content }),
        ...(input.duration && { duration: input.duration }),
        ...(input.startDate && { start_date: new Date(input.startDate) }),
        ...(input.endDate && { end_date: new Date(input.endDate) }),
        ...(input.metaTitle && { meta_title: input.metaTitle }),
        ...(input.metaDescription && { meta_description: input.metaDescription }),
        ...(input.audience && input.audience.length > 0 && { audience: input.audience }),
        ...(input.keywords && input.keywords.length > 0 && { keywords: input.keywords }),
        ...(input.schemaEnabled !== undefined && { schema_enabled: input.schemaEnabled }),
        ...(input.schemaMode && { schema_mode: input.schemaMode }),
        ...(input.schemaData && { schema_data: input.schemaData }),
        ...(input.benefits && { benefits: input.benefits }),
        ...(input.tuition && { tuition: input.tuition }),
        created_by: "system",
        updated_by: "system",
        version: 1,
    };
    return data;
}

function normalizeUpdateInput(input: CourseUpdateDTO) {
    const data: Prisma.courseUpdateInput = {
        ...(input.title && { course_name: input.title, title: input.title }),
        ...(input.description && { description: input.description }),
        ...(input.level && { level: input.level as any }),
        ...(input.category && { category: input.category as any }),
        ...(input.categoryId && { category_id: input.categoryId }),
        ...(input.isDisabled !== undefined && { is_disabled: input.isDisabled }),
        ...(input.isFeatured !== undefined && { is_featured: input.isFeatured }),
        ...(input.image && { image: input.image }),
        ...(input.content && { content: input.content }),
        ...(input.duration && { duration: input.duration }),
        ...(input.startDate && { start_date: new Date(input.startDate) }),
        ...(input.endDate && { end_date: new Date(input.endDate) }),
        ...(input.metaTitle && { meta_title: input.metaTitle }),
        ...(input.metaDescription && { meta_description: input.metaDescription }),
        ...(input.audience && input.audience.length > 0 && { audience: input.audience }),
        ...(input.keywords && input.keywords.length > 0 && { keywords: input.keywords }),
        ...(input.schemaEnabled !== undefined && { schema_enabled: input.schemaEnabled }),
        ...(input.schemaMode && { schema_mode: input.schemaMode }),
        ...(input.schemaData && { schema_data: input.schemaData }),
        ...(input.benefits && { benefits: input.benefits }),
        ...(input.tuition && { tuition: input.tuition }),
        updated_at: new Date(),
        updated_by: "system",
        version: { increment: 1 },
    };
    return data;
}

export class CourseService {
    static async createCourse(input: SeoEvaluationInput) {
        // đảm bảo slug
        const desiredSlug = input.slug || input.title;
        const uniqueSlug = await ensureUniqueSlug(desiredSlug!);

        // Process image: decode base64 and save to storage
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
            // If it's already a path, keep it
            imagePath = image;
        }

        const data = normalizeCreateInput({ ...input, slug: uniqueSlug, image: imagePath });

        try {
            console.log("Creating course with data:", JSON.stringify(data, null, 2));
            const created = await prisma.course.create({ data });
            return created;
        } catch (e: any) {
            // If error occurs, delete the saved image
            if (imagePath) {
                deleteImage(imagePath);
            }
            console.error("Error creating course:", {
                code: e?.code,
                message: e?.message,
                meta: e?.meta,
                data: data
            });
            if (e?.code === "P2002") {
                // unique violation (course_code or slug)
                const field = e?.meta?.target?.[0] || "unknown";
                throw new Error(`COURSE_CONFLICT_${field}`);
            }
            throw e;
        }
    }    
    static async getCourseById(courseId: number) {
        const found = await prisma.course.findUnique({
            where: { course_id: courseId },
        });
        if (!found) throw new Error("COURSE_NOT_FOUND");

        found.image = found.image ? "http://localhost:4000/" + found.image : null;
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

        items.forEach((item) => {
            // Convert Date objects to ISO strings
            item.image = item.image ? "http://localhost:4000/" + item.image : null;
        });

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

        if (input.slug || input.title) {
            const base = input.slug || input.title!;
            const uniqueSlug = await ensureUniqueSlug(base, courseId);
            data.slug = uniqueSlug;
        }

        // Process image if provided
        if (input.image && input.image.startsWith("data:image")) {
            try {
                const imagePath = await saveBase64Image(input.image);
                
                // Delete old image if exists
                const oldCourse = await prisma.course.findUnique({
                    where: { course_id: courseId },
                    select: { image: true }
                });
                if (oldCourse?.image) {
                    deleteImage(oldCourse.image);
                }
                
                data.image = imagePath;
            } catch (e: any) {
                console.error("Error processing image:", e.message);
                throw new Error(`IMAGE_PROCESS_ERROR: ${e.message}`);
            }
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
            // Get course to delete its image
            const course = await prisma.course.findUnique({
                where: { course_id: courseId },
                select: { image: true }
            });

            // Delete image file if exists
            if (course?.image) {
                deleteImage(course.image);
            }

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
        let course;
        if (id !== undefined) {
            course = await this.getCourseById(id);
        } else if (slug !== undefined) {
            course = await this.getCourseBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
        if (course.image) {
            course.image = "http://localhost:4000" + course.image;
        }
        return course;
    }
}
