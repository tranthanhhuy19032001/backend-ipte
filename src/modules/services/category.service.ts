import { Prisma, $Enums } from "@prisma/client";
import prisma from "@config/database";

import { CategoryDAO } from "@dao/category.dao";
import { category } from "@prisma/client";

// (Tuỳ chọn) Khai báo type đầu vào tương tự CourseListQuery
type CategoryListQuery = {
    q?: string;
    categoryName?: string;
    categoryType?: string; // hoặc $Enums.category_type nếu có enum
    slug?: string;
    url?: string;
    sortBy?: keyof Prisma.categoryOrderByWithRelationInput | "createdAt";
    orderBy?: "asc" | "desc";
    page?: number;
    pageSize?: number;
};

type MenuNode = {
    id: number;
    name: string;
    url: string | null;
    icon?: string | null;
    category_type: string;
    children?: MenuNode[];
};

export class CategoryService {
    private categoryDAO: CategoryDAO;
    constructor() {
        this.categoryDAO = new CategoryDAO();
    }

    static async getCategories(query: CategoryListQuery) {
        const {
            q,
            categoryName,
            categoryType,
            slug,
            url,
            sortBy: sort_by = "created_at",
            orderBy: sort_order = "asc",
            page = 1,
            pageSize = 20,
        } = query ?? {};

        // where giống listCourses (AND các điều kiện, có q -> OR nhiều field)
        const where: Prisma.categoryWhereInput = {
            AND: [
                q
                    ? {
                          OR: [
                              {
                                  name: {
                                      contains: q,
                                      mode: "insensitive",
                                  },
                              },
                              {
                                  slug: {
                                      contains: q,
                                      mode: "insensitive",
                                  },
                              },
                              {
                                  url: {
                                      contains: q,
                                      mode: "insensitive",
                                  },
                              },
                          ],
                      }
                    : {},
                categoryName
                    ? {
                          name: {
                              contains: categoryName,
                              mode: "insensitive",
                          },
                      }
                    : {},
                categoryType
                    ? {
                          // nếu categoryType là enum:
                          category_type: {
                              equals: categoryType,
                          },
                      }
                    : {},
                slug ? { slug: { equals: slug } } : {},
                url
                    ? {
                          url: {
                              contains: url,
                              mode: "insensitive",
                          },
                      }
                    : {},
            ],
        };

        // orderBy động như listCourses
        const orderBy: Prisma.categoryOrderByWithRelationInput = {
            [sort_by]: sort_order,
        } as Prisma.categoryOrderByWithRelationInput;

        // phân trang an toàn như listCourses
        const safePage = Math.max(1, page);
        const safePageSize = Math.max(1, Math.min(pageSize, 100));
        const skip = (safePage - 1) * safePageSize;
        const take = safePageSize;

        const [items, total] = await Promise.all([
            prisma.category.findMany({ where, orderBy, skip, take }),
            prisma.category.count({ where }),
        ]);

        return {
            items,
            page: safePage,
            page_size: take,
            total,
            total_pages: Math.ceil(total / take),
        };
    }

    async getHeaderMenu(): Promise<MenuNode[]> {
        const rows = (await this.categoryDAO.findAllByCategoryType(
            "HEADER_MENU"
        )) as any[];

        // Build n-level tree
        const byId = new Map<number, MenuNode>();
        const childrenBucket = new Map<number, MenuNode[]>();
        const roots: MenuNode[] = [];

        // init nodes
        for (const r of rows) {
            const id = Number(r.category_id);
            byId.set(id, {
                id,
                name: r.name,
                url: r.url,
                icon: r.icon,
                category_type: r.category_type,
                children: [],
            });
        }
        // attach to parent or collect as root
        for (const r of rows as any[]) {
            const node = byId.get(Number(r.category_id))!;
            if (r.parent_id == null) {
                roots.push(node);
            } else {
                const parentId = Number(r.parent_id);
                const parent = byId.get(parentId);
                if (parent) {
                    (parent.children ??= []).push(node);
                } else {
                    // Nếu parent chưa có (edge case), bucket lại rồi nối sau:
                    const list = childrenBucket.get(parentId) ?? [];
                    list.push(node);
                    childrenBucket.set(parentId, list);
                }
            }
        }

        return roots;
    }
}
