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
}
