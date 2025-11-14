import { NewsDAO } from "@dao/news.dao";
import { KnowledgeDAO } from "@dao/knowledge.dao";
import { news } from "@prisma/client";

type newsJoinedKnowledge = {
    news: {
        id: number;
        image: string;
        title: string;
        description: string;
        content: string;
        category: string | null;
        authorName: string | null;
        authorAvatar: string | null;
    }[];
    tips: {
        id: number;
        image: string;
        title: string;
        description: string;
        content: string;
        category: string | null;
        authorName: string | null;
        authorAvatar: string | null;
    }[];
};

type NewsJoined = {
    id: number;
    image: string;
    title: string;
    description: string;
    content: string;
    category: string | null;
    authorName: string | null;
    authorAvatar: string | null;
};

export class NewsService {
    private newsDAO: NewsDAO;
    private knowledgeDAO: KnowledgeDAO;

    constructor() {
        this.newsDAO = new NewsDAO();
        this.knowledgeDAO = new KnowledgeDAO();
    }

    async getUserById(id: number): Promise<news | null> {
        return this.newsDAO.findById(id);
    }

    async getNewsAndTips(): Promise<newsJoinedKnowledge> {
        const news = this.newsDAO.findAll();
        const tips = this.knowledgeDAO.findAll();

        const newsResult = await news;
        const tipsResult = await tips;
        return { news: newsResult, tips: tipsResult };
    }

    async registerUser(
        username: string,
        password: string,
        email: string,
        roleId: number
    ): Promise<news> {
        // 👉 Có thể hash password tại đây trước khi lưu
        return this.newsDAO.create({
            email,
            password,
            username,
            roleId,
            createdBy: "system",
            updatedBy: "system",
            version: 1,
        } as any); // ép kiểu vì thiếu id, createdAt, updatedAt
    }

    async updateUser(id: number, data: Partial<news>): Promise<news> {
        return this.newsDAO.update(id, data);
    }

    async deleteUser(id: number): Promise<news> {
        return this.newsDAO.delete(id);
    }

    async getAllNews(filters: {
        title?: string;
        description?: string;
        slug?: string;
        status?: any;
        isProminent?: number;
        categoryId?: number;
        categoryType?: string;
        page: number;
        pageSize: number;
    }) {
        return this.newsDAO.findAllNews(filters);
    }

    async getNewsDetail(id?: number, slug?: string): Promise<news | null> {
        if (id !== undefined) {
            return this.newsDAO.findById(id);
        } else if (slug !== undefined) {
            return this.newsDAO.findBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
    }
}
