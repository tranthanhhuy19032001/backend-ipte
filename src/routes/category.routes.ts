import { Router } from "express";
import { CategoryController } from "@controllers/category.controller";

const router = Router();
const categoryController = new CategoryController();

router.get("", categoryController.getCategories.bind(categoryController));

router.get(
    "/header-menu",
    categoryController.getHeaderMenu.bind(categoryController)
);

router.get(
    "/category-tree",
    categoryController.getCategoryTree.bind(categoryController)
);
export default router;
