import { Router } from "express";
import { TeacherController } from "@controllers/teacher.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const teacherController = new TeacherController();

router.post("/", authRole([Role.ADMIN]), teacherController.createTeacher.bind(teacherController));
router.get("/", teacherController.getTeachers.bind(teacherController));
router.get("/detail", teacherController.getTeacherDetail.bind(teacherController));
router.put("/:id", authRole([Role.ADMIN]), teacherController.updateTeacher.bind(teacherController));

export default router;
