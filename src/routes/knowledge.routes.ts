import { KnowledgeController } from "@controllers/knowledge.controller";
import { Router } from "express";

const router = Router();

const knowledgeController = new KnowledgeController();

router.get("/", knowledgeController.getKnowledges.bind(knowledgeController));

router.get(
    "/:categoryId",
    knowledgeController.selectKnowledges.bind(knowledgeController)
);

export default router;
