import { Request, Response } from "express";
import { CourseService } from "@services/course.service";

export class CourseController {
    async create(req: Request, res: Response) {
        try {
            const created = await CourseService.createCourse(req.body);
            res.status(201).json(created);
        } catch (e: any) {
            if (e?.message === "COURSE_CONFLICT") {
                return res
                    .status(409)
                    .json({ message: "Course code or slug already exists." });
            }
            return res
                .status(500)
                .json({ message: "Failed to create course." });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id))
                return res.status(400).json({ message: "Invalid course id." });

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
                q,
                level,
                mode,
                language,
                min_price,
                max_price,
                start_after,
                end_before,
                category,
                sort_by,
                sort_order,
                page,
                page_size,
            } = req.query;

            const result = await CourseService.listCourses({
                q: q as string | undefined,
                level: level as string | undefined,
                mode: mode as string | undefined,
                language: language as string | undefined,
                min_price: min_price != null ? Number(min_price) : undefined,
                max_price: max_price != null ? Number(max_price) : undefined,
                start_after: start_after as string | undefined,
                end_before: end_before as string | undefined,
                category: category as string | undefined,
                sort_by: sort_by as any,
                sort_order: sort_order as any,
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
            if (Number.isNaN(id))
                return res.status(400).json({ message: "Invalid course id." });

            const updated = await CourseService.updateCourse(id, req.body);
            res.json(updated);
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            if (e?.message === "COURSE_CONFLICT") {
                return res
                    .status(409)
                    .json({ message: "Course code or slug already exists." });
            }
            return res
                .status(500)
                .json({ message: "Failed to update course." });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id))
                return res.status(400).json({ message: "Invalid course id." });

            await CourseService.deleteCourse(id);
            res.status(204).end();
        } catch (e: any) {
            if (e?.message === "COURSE_NOT_FOUND") {
                return res.status(404).json({ message: "Course not found." });
            }
            return res
                .status(500)
                .json({ message: "Failed to delete course." });
        }
    }
}
