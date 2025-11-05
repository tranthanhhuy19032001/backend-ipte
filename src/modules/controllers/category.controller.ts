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

    async getCategories(req: Request, res: Response) {
        const { categoryName, categoryType, page, pageSize } = req.query;

        const categories = await this.categoryService.getCategories({
            categoryName: categoryName as string | undefined,
            categoryType: categoryType as string | undefined,
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
        });
        res.json(categories);
    }
}
