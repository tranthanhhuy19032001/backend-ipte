import { category } from "@prisma/client";
import prisma from "@config/database";

export class CategoryDAO {
    async findAllByCategoryType(categoryType: string): Promise<category[]> {
        return prisma.category.findMany({
            where: {
                category_type: categoryType,
            },
            orderBy: {
                category_id: "asc",
            },
        });
    }

    async findCategories(options: {
        categoryName?: string;
        categoryType?: string;
        page?: number;
        pageSize?: number;
    }): Promise<category[]> {
        const { categoryName, categoryType, page, pageSize } = options;
        const whereClause: any = {};
        if (categoryName) {
            whereClause.name = {
                contains: categoryName,
                mode: "insensitive",
            };
        }
        if (categoryType) {
            whereClause.category_type = categoryType;
        }
        const categories = await prisma.category.findMany({
            where: whereClause,
            skip: page && pageSize ? (page - 1) * pageSize : undefined,
            take: pageSize,
            orderBy: {
                category_id: "asc",
            },
        });
        return categories;
    }
}
