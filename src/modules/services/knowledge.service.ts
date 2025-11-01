import { KnowledgeDAO } from "@dao/knowledge.dao";

type ListOptions = {
    page: number;
    pageSize: number;
};

export class KnowledgeService {
    private knowledgeDAO: KnowledgeDAO;

    constructor() {
        this.knowledgeDAO = new KnowledgeDAO();
    }

    async selectKnowledges(categoryId: number, opts: ListOptions) {
        return this.knowledgeDAO.selectKnowledges(categoryId, opts);
    }
}
