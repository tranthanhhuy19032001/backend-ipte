import { CategoryService } from "@services/category.service";
import { Request, Response } from "express";
import { camelCaseKeysDeep } from "@utils/response";

export class CategoryController {
    private categoryService: CategoryService;
    constructor() {
        this.categoryService = new CategoryService();
    }
    async getCategories(req: Request, res: Response) {
        const { categoryName, categoryType, slug, url, level, page, pageSize } = req.query;

        const categories = await CategoryService.getCategories({
            categoryName: categoryName as string | undefined,
            categoryType: categoryType as string | undefined,
            slug: slug as string | undefined,
            url: url as string | undefined,
            level: level ? Number(level) : undefined,
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
        });
        res.json(camelCaseKeysDeep(categories));
    }

    async getHeaderMenu(req: Request, res: Response) {
        const menu = await this.categoryService.getHeaderMenu();
        res.json(camelCaseKeysDeep(menu));
    }

    async getCategoryTree(req: Request, res: Response) {
        const { url, slug, categoryType } = req.query;
        const urlOrSlug = (slug as string | undefined) ?? (url as string | undefined);
        const categoryTree = await CategoryService.getCategoryTree(
            urlOrSlug as string | undefined,
            categoryType as string | undefined
        );
        res.json(camelCaseKeysDeep(categoryTree));
    }
}
