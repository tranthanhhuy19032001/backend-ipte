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
}
