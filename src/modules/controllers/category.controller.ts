import { CategoryService } from "@services/category.service";
import { Request, Response } from "express";

export class CategoryController {
    private categoryService: CategoryService;
    constructor() {
        this.categoryService = new CategoryService();
    }
    async getCategories(req: Request, res: Response) {
        const { categoryName, categoryType, slug, url, page, pageSize } =
            req.query;

        const categories = await CategoryService.getCategories({
            categoryName: categoryName as string | undefined,
            categoryType: categoryType as string | undefined,
            slug: slug as string | undefined,
            url: url as string | undefined,
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
        });
        res.json(categories);
    }

    async getHeaderMenu(req: Request, res: Response) {
        const menu = await this.categoryService.getHeaderMenu();
        res.json(menu);
    }
}
