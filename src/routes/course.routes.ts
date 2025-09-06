import { Router } from "express";
import { CourseController } from "@controllers/course.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const controller = new CourseController();

router.post("/", authRole([Role.ADMIN]), controller.create.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", authRole([Role.ADMIN]), controller.update.bind(controller));
router.delete(
    "/:id",
    authRole([Role.ADMIN]),
    controller.remove.bind(controller)
);

export default router;
