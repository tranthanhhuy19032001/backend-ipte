import { Request, Response } from "express";
import { CourseService } from "@services/course.service";

export class CourseController {
    async create(req: Request, res: Response) {
        try {
            // Loại bỏ course_id vì nó tự động tăng
            const { course_id, courseId, ...data } = req.body;
            const created = await CourseService.createCourse(data);
            res.status(201).json(created);
        } catch (e: any) {
            if (e?.message === "COURSE_CONFLICT") {
                return res.status(409).json({ message: "Course code or slug already exists." });
            }
            return res.status(500).json({ message: "Failed to create course." });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid course id." });

            const course = await CourseService.getCourseById(id);
            res.json(course);
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            return res.status(500).json({ message: "Failed to get course." });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const {
                search: q,
                courseName,
                slug,
                title,
                description,
                schedule,
                tuition,
                category,
                categoryId,
                orderBy,
                sortBy,
                page,
                page_size,
            } = req.query;

            const result = await CourseService.listCourses({
                q: q as string | undefined,
                courseName: courseName as string | undefined,
                title: title as string | undefined,
                description: description as string | undefined,
                schedule: schedule as string | undefined,
                tuition: tuition as string | undefined,
                slug: slug as string | undefined,
                category: category as string | undefined,
                categoryId: categoryId != null ? Number(categoryId) : undefined,
                orderBy: orderBy as "asc" | "desc" | undefined,
                sortBy: sortBy as "price" | "created_at" | "updated_at" | undefined,
                page: page != null ? Number(page) : undefined,
                page_size: page_size != null ? Number(page_size) : undefined,
            });

            res.json(result);
        } catch (e: any) {
            return res.status(500).json({ message: "Failed to list courses." });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid course id." });

            const updated = await CourseService.updateCourse(id, req.body);
            res.json(updated);
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            if (e?.message === "COURSE_CONFLICT") {
                return res.status(409).json({ message: "Course code or slug already exists." });
            }
            return res.status(500).json({ message: "Failed to update course." });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid course id." });

            await CourseService.deleteCourse(id);
            res.status(204).end();
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            return res.status(500).json({ message: "Failed to delete course." });
        }
    }

    async getBySlug(req: Request, res: Response) {
        try {
            const slug = req.params.slug;
            const course = await CourseService.getCourseBySlug(slug);
            res.json(course);
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            return res.status(500).json({ message: "Failed to get course." });
        }
    }

    async getCourseDetail(req: Request, res: Response) {
        try {
            const { id, slug } = req.query;
            const courseDetail = await CourseService.getCourseDetail(
                id ? Number(id) : undefined,
                slug ? String(slug) : undefined
            );
            res.status(200).json(courseDetail);
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            return res.status(500).json({ message: "Failed to get course." });
        }
    }
}
