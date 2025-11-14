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

    async getKnowledges(filters: {
        title?: string;
        slug?: string;
        description?: string;
        status?: any;
        isProminent?: number;
        categoryId?: number;
        categoryType?: string;
        page: number;
        pageSize: number;
    }) {
        return this.knowledgeDAO.getKnowledges(filters);
    }

    async getKnowledgeDetail(id?: number, slug?: string): Promise<any | null> {
        if (id !== undefined) {
            return this.knowledgeDAO.findById(id);
        } else if (slug !== undefined) {
            return this.knowledgeDAO.findBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
    }
}
