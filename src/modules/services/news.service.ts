import { NewsDAO, NewsWithAuthorAndCategory, NewsWithAuthorName } from "@dao/news.dao";
import { KnowledgeDAO } from "@dao/knowledge.dao";
import { news } from "@prisma/client";
import slugify from "slugify";
import prisma from "@config/database";
import { SeoEvaluationInput } from "@dto/SeoEvaluationInput";
import { Prisma } from "@prisma/client";
import { saveBase64Image, deleteImage } from "@utils/imageHandler";
import { config } from "@config/index";
import { normalizeUrl } from "@utils/objectUtils";

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

type NewsResponse = Omit<NewsWithAuthorAndCategory, "author_id" | "author_name" | "category_type"> & {
    author: string | null;
    category_type: string | null;
};

export class NewsService {
    private newsDAO: NewsDAO;
    private knowledgeDAO: KnowledgeDAO;

    constructor() {
        this.newsDAO = new NewsDAO();
        this.knowledgeDAO = new KnowledgeDAO();
    }

    async getNewsById(id: number): Promise<NewsResponse | null> {
        const found = await this.newsDAO.findById(id);
        return replaceAuthorIdWithName(found);
    }

    async getNewsAndTips(): Promise<newsJoinedKnowledge> {
        const news = this.newsDAO.findAll();
        const tips = this.knowledgeDAO.findAll();

        const newsResult = await news;
        const tipsResult = await tips;
        return { news: newsResult, tips: tipsResult };
    }

    async getAllNews(filters: {
        search?: string;
        title?: string;
        description?: string;
        slug?: string;
        status?: any;
        isProminent?: number;
        categoryId?: number;
        categoryType?: string;
        page: number;
        pageSize: number;
    }): Promise<{
        items: NewsResponse[];
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    }> {
        const result = await this.newsDAO.findAllNews(filters);
        return {
            ...result,
            items: result.items.map((item) => replaceAuthorIdWithName(item)!),
        };
    }

    async getNewsDetail(id?: number, slug?: string): Promise<NewsResponse | null> {
        let found: NewsWithAuthorName | null = null;
        if (id !== undefined) {
            found = await this.newsDAO.findById(id);
        } else if (slug !== undefined) {
            found = await this.newsDAO.findBySlug(slug);
        } else {
            throw new Error("Either id or slug must be provided.");
        }
        const news = replaceAuthorIdWithName(found);
        if (news && news.image) {
            news.image = normalizeUrl(config.domain + "/" + news.image);
        }
        return news;
    }

    async createNews(input: SeoEvaluationInput) {
        // đảm bảo slug
        const desiredSlug = input.slug || input.title;
        const uniqueSlug = await ensureUniqueSlug(desiredSlug!);

        // Process image: decode base64 and save to storage
        let imagePath: string | null = null;
        const image = input.image || null;
        if (image !== null && image.startsWith("data:image")) {
            try {
                imagePath = await saveBase64Image(image);
            } catch (e: any) {
                console.error("Error processing image:", e.message);
                throw new Error(`IMAGE_PROCESS_ERROR: ${e.message}`);
            }
        } else if (image !== null) {
            // If it's already a path, keep it
            imagePath = image;
        }

        const data = normalizeCreateInput({ ...input, slug: uniqueSlug, image: imagePath });

        try {
            console.log("Creating course with data:", JSON.stringify(data, null, 2));
            const created = await prisma.news.create({ data });
            return created;
        } catch (e: any) {
            // If error occurs, delete the saved image
            if (imagePath) {
                deleteImage(imagePath);
            }
            console.error("Error creating course:", {
                code: e?.code,
                message: e?.message,
                meta: e?.meta,
                data: data
            });
            if (e?.code === "P2002") {
                // unique violation (course_code or slug)
                const field = e?.meta?.target?.[0] || "unknown";
                throw new Error(`COURSE_CONFLICT_${field}`);
            }
            throw e;
        }
    }

    async updateNews(id: number, data: Partial<news>): Promise<news> {
        return this.newsDAO.update(id, data);
    }

    async deleteNews(id: number): Promise<news> {
        return this.newsDAO.delete(id);
    }
}

/** Chuẩn hóa data trước khi đưa vào Prisma */
function normalizeCreateInput(input: SeoEvaluationInput) {
    const data: Prisma.newsCreateInput = {
        slug: input.slug!,
        title: input.title,
        content: input.content!,
        ...(input.author !== undefined && input.author !== null && { author_id: input.author }),
        ...(input.description && { description: input.description }),
        ...(input.level && { level: input.level as any }),
        ...(input.category && { category: input.category as any }),
        ...(input.categoryId && { category_id: input.categoryId }),
        ...(input.image && { image: input.image }),
        ...(input.content && { content: input.content }),
        ...(input.duration && { duration: input.duration }),
        // ...(input.startDate && { start_date: new Date(input.startDate) }),
        // ...(input.endDate && { end_date: new Date(input.endDate) }),
        ...(input.metaTitle && { meta_title: input.metaTitle }),
        ...(input.metaDescription && { meta_description: input.metaDescription }),
        ...(input.audience && input.audience.length > 0 && { audience: input.audience }),
        ...(input.keywords && input.keywords.length > 0 && { keywords: input.keywords }),
        ...(input.schemaEnabled !== undefined && { schema_enabled: input.schemaEnabled }),
        ...(input.schemaMode && { schema_mode: input.schemaMode }),
        ...(input.schemaData && { schema_data: input.schemaData }),
        ...(input.benefits && { benefits: input.benefits }),
        ...(input.tuition && { tuition: input.tuition }),
        created_by: "system",
        updated_by: "system",
        version: 1,
    };
    return data;
}

async function ensureUniqueSlug(base: string, newsIdToExclude?: number): Promise<string> {
    const baseSlug = slugify(base, { lower: true, strict: true, trim: true }) || "news";
    let candidate = baseSlug;
    let i = 1;
    while (true) {
        const found = await prisma.news.findFirst({
            where: {
                slug: candidate,
                ...(newsIdToExclude ? { news_id: { not: newsIdToExclude } } : {}),
            },
            select: { news_id: true },
        });
        if (!found) return candidate;
        i += 1;
        candidate = `${baseSlug}-${i}`;
    }
}

function replaceAuthorIdWithName(item: NewsWithAuthorName | null): NewsResponse | null {
    if (!item) return null;
    const { author_name, author_id, ...rest } = item as any;
    const resolvedName = author_name ?? null;
    return {
        ...rest,
        author: resolvedName,
    };
}
