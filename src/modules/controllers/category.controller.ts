import { CategoryService } from "@services/category.service";
import { Request, Response } from "express";

export class CategoryController {
    private categoryService: CategoryService;
    constructor() {
        this.categoryService = new CategoryService();
    }
    async getCategoriesByType(req: Request, res: Response) {
        const { categoryType } = req.params;
        const categories = await this.categoryService.getCategoriesByType(
            categoryType
        );
        res.json(categories);
    }

    async getHeaderMenu(req: Request, res: Response) {
        const menu = await this.categoryService.getHeaderMenu();
        res.json(menu);
    }
}
