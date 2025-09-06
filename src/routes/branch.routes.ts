// src/routes/branch.routes.ts
import { Router } from "express";
import { BranchController } from "@controllers/branch.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const branchController = new BranchController();

router.post(
    "/",
    authRole([Role.ADMIN]),
    branchController.create.bind(branchController)
);
router.get("/", branchController.list.bind(branchController));
router.get("/:id", branchController.getById.bind(branchController));
router.put("/:id", branchController.update.bind(branchController));
router.delete("/:id", branchController.remove.bind(branchController));

export default router;
