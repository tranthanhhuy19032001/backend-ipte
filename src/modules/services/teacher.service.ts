import { TeacherDAO } from "../dao/teacher.dao";
import { teacher } from "@prisma/client";
import { AboutService } from "@services/about.service";

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

    async registerTeacher(): Promise<teacher> {
        return null as any;
    }

    async updateTeacher(id: number, data: Partial<teacher>): Promise<teacher> {
        return this.teacherDAO.update(id, data);
    }

    async deleteTeacher(id: number): Promise<teacher> {
        return this.teacherDAO.delete(id);
    }
}
