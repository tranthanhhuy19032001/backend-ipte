import { Router } from "express";
import { NewsController } from "@controllers/news.controller";

const router = Router();
const newsController = new NewsController();

router.get(
    "/news-and-tips",
    newsController.getNewsAndTips.bind(newsController)
);

export default router;
