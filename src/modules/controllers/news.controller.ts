import { Request, Response } from "express";
import { NewsService } from "@services/news.service";

const newsService = new NewsService();

export class NewsController {
    async getNewsAndTips(req: Request, res: Response): Promise<void> {
        try {
            const news = await newsService.getNewsAndTips();
            res.status(200).json(news);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message,
            });
        }
    }

    async getAllNews(req: Request, res: Response): Promise<void> {
        const page = Math.max(1, Number(req.query.page) || 1);
        const pageSize = Math.max(1, Math.min(Number(req.query.page_size) || 20, 100));
        const { search, title, description, slug, status, isProminent, categoryId, categoryType } =
            req.query;

        try {
            const news = await newsService.getAllNews({
                search: search as string | undefined,
                title: title as string | undefined,
                description: description as string | undefined,
                slug: slug as string | undefined,
                status: status as any | undefined,
                isProminent: isProminent ? Number(isProminent) : undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                categoryType: categoryType as string | undefined,
                page,
                pageSize,
            });
            res.status(200).json(news);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch news",
                error: error.message,
            });
        }
    }

    async getNewsDetail(req: Request, res: Response): Promise<void> {
        try {
            const { id, slug } = req.query;
            const newsDetail = await newsService.getNewsDetail(
                id ? Number(id) : undefined,
                slug ? String(slug) : undefined
            );
            res.status(200).json(newsDetail);
        } catch (error: any) {
            if (error?.message === "NEWS_NOT_FOUND") {
                res.status(404).json({ message: "News not found." });
                return;
            }
            res.status(500).json({
                message: "Failed to fetch news",
                error: error.message,
            });
        }
    }
}
