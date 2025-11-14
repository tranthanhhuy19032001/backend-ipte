import { Router } from "express";
import { NewsController } from "@controllers/news.controller";

const router = Router();
const newsController = new NewsController();

router.get("/detail", newsController.getNewsDetail.bind(newsController));
router.get(
    "/news-and-tips",
    newsController.getNewsAndTips.bind(newsController)
);

router.get("/", newsController.getAllNews.bind(newsController));

export default router;
