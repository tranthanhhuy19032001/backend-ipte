// src/routes/about.routes.ts
import { Router } from "express";
import { AboutController } from "@controllers/about.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const aboutController = new AboutController();

router.post("/", authRole([Role.ADMIN]), aboutController.create.bind(aboutController));
router.get("/", aboutController.list.bind(aboutController));
router.get("/detail", aboutController.getDetail.bind(aboutController));
router.get("/:id", aboutController.getById.bind(aboutController));
router.put("/:id", authRole([Role.ADMIN]), aboutController.update.bind(aboutController));
router.delete("/:id", aboutController.remove.bind(aboutController));

export default router;
