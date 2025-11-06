import { KnowledgeService } from "@services/knowledge.service";

export class KnowledgeController {
    private knowledgeService: KnowledgeService;
    constructor() {
        this.knowledgeService = new KnowledgeService();
    }
    async selectKnowledges(req: any, res: any) {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);

            const page = Math.max(1, Number(req.query.page) || 1);
            const pageSize = Math.max(
                1,
                Math.min(Number(req.query.page_size) || 20, 100)
            );

            const knowledges = await this.knowledgeService.selectKnowledges(
                categoryId,
                {
                    page,
                    pageSize,
                }
            );
            res.status(200).json(knowledges);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch knowledges." });
        }
    }

    async getKnowledges(req: any, res: any) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const pageSize = Math.max(
                1,
                Math.min(Number(req.query.page_size) || 20, 100)
            );
            const {
                title,
                slug,
                description,
                status,
                isProminent,
                categoryId,
                categoryType,
            } = req.query;

            const knowledges = await this.knowledgeService.getKnowledges({
                title: title as string | undefined,
                slug: slug as string | undefined,
                description: description as string | undefined,
                status: status as string | undefined,
                isProminent: isProminent ? Number(isProminent) : undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                categoryType: categoryType as string | undefined,
                page,
                pageSize,
            });
            res.status(200).json(knowledges);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch knowledges." });
        }
    }

    async getKnowledgeById(req: any, res: any) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                res.status(400).json({ message: "Invalid knowledge id." });
                return;
            }
            const knowledge = await this.knowledgeService.getKnowledgeById(id);
            res.status(200).json(knowledge);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch knowledge." });
        }
    }
}
