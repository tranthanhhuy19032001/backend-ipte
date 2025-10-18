import { Request, Response } from "express";
import { TeacherService } from "@services/teacher.service";

const teacherService = new TeacherService();

export class TeacherController {
    async getAllTeachers(req: Request, res: Response): Promise<void> {
        try {
            const teachers = await teacherService.getAllTeachers();
            res.status(200).json(teachers);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message,
            });
        }
    }

    async getTeacherById(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid teacher_id." });
            return;
        }
        try {
            const teacher = await teacherService.getTeacherById(id);
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
