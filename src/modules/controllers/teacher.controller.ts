import { Request, Response } from "express";
import { TeacherService } from "@services/teacher.service";

const teacherService = new TeacherService();

export class TeacherController {
    async getTeachers(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;
            const { name, overallScore, listeningScore, speakingScore, writingScore } = req.query;
            const teachers = await teacherService.getTeachers({
                name: name as string | undefined,
                overallScore: overallScore ? Number(overallScore) : undefined,
                listeningScore: listeningScore ? Number(listeningScore) : undefined,
                speakingScore: speakingScore ? Number(speakingScore) : undefined,
                writingScore: writingScore ? Number(writingScore) : undefined,
                page,
                pageSize,
            });
            res.status(200).json(teachers);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message,
            });
        }
    }

    async getTeacherDetail(req: Request, res: Response): Promise<void> {
        const { id, slug } = req.query;
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid teacher_id." });
            return;
        }
        try {
            const teacher = await teacherService.getTeacherDetail(
                id ? Number(id) : undefined,
                slug ? String(slug) : undefined
            );
            if (!teacher) {
                res.status(404).json({ message: "Teacher not found." });
                return;
            }
            res.status(200).json(teacher);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch teacher",
                error: error.message,
            });
        }
    }
}
