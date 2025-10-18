import { Router } from "express";
import { TeacherController } from "@controllers/teacher.controller";

const router = Router();
const teacherController = new TeacherController();

router.get("/", teacherController.getAllTeachers.bind(teacherController));
router.get("/:id", teacherController.getTeacherById.bind(teacherController));

export default router;
