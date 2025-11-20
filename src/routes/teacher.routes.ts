import { Router } from "express";
import { TeacherController } from "@controllers/teacher.controller";

const router = Router();
const teacherController = new TeacherController();

router.get("/", teacherController.getTeachers.bind(teacherController));
router.get("/detail", teacherController.getTeacherDetail.bind(teacherController));

export default router;
