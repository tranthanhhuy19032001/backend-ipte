import { Request, Response } from "express";
import { TeacherService } from "@services/teacher.service";
import { camelCaseKeysDeep } from "@utils/response";

const teacherService = new TeacherService();

export class TeacherController {
    async createTeacher(req: Request, res: Response): Promise<void> {
        try {
            const { teacher_id, teacherId, id, ...data } = req.body;
            const created = await teacherService.createTeacher(data);
            res.status(201).json(camelCaseKeysDeep(created));
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create teacher",
                error: error.message,
            });
        }
    }

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
            res.status(200).json(camelCaseKeysDeep(teachers));
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message,
            });
        }
    }

    async getTeacherDetail(req: Request, res: Response): Promise<void> {
        const { id, slug } = req.query;
        if (id && Number.isNaN(Number(id))) {
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
            res.status(200).json(camelCaseKeysDeep(teacher));
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch teacher",
                error: error.message,
            });
        }
    }

    async updateTeacher(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid teacher_id." });
            return;
        }
        try {
            const updated = await teacherService.updateTeacher(id, req.body);
            res.status(200).json(camelCaseKeysDeep(updated));
        } catch (error: any) {
            if (error?.message === "TEACHER_NOT_FOUND") {
                res.status(404).json({ message: "Teacher not found." });
                return;
            }
            res.status(500).json({
                message: "Failed to update teacher",
                error: error.message,
            });
        }
    }
}
