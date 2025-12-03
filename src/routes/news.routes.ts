import { Router } from "express";
import { NewsController } from "@controllers/news.controller";

const router = Router();
const newsController = new NewsController();

router.get("/detail", newsController.getNewsDetail.bind(newsController));
router.get("/news-and-tips", newsController.getNewsAndTips.bind(newsController));

router.get("/", newsController.getAllNews.bind(newsController));
router.post("/", newsController.createNews.bind(newsController));
router.get("/:id", newsController.getNewsById.bind(newsController));
router.put("/:id", newsController.updateNews.bind(newsController));
router.delete("/:id", newsController.deleteNews.bind(newsController));

export default router;
