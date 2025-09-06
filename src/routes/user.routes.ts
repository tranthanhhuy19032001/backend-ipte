import { Router } from "express";
import { UserController } from "@controllers/user.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const userController = new UserController();

router.get("/", authRole([Role.ADMIN]), (req, res) =>
    userController.getAllUsers(req, res)
);
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.post("/", (req, res) => userController.createUser(req, res));
router.put("/:id", (req, res) => userController.updateUser(req, res));
router.delete("/:id", authRole([Role.ADMIN]), (req, res) =>
    userController.deleteUser(req, res)
);

export default router;
