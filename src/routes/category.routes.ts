import { Router } from "express";
import { CategoryController } from "@controllers/category.controller";

const router = Router();
const categoryController = new CategoryController();

router.get(
    "/type/:categoryType",
    categoryController.getCategoriesByType.bind(categoryController)
);
router.get(
    "/header-menu",
    categoryController.getHeaderMenu.bind(categoryController)
);
export default router;
