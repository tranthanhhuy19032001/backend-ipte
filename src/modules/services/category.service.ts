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

type CourseSummary = {
    id: number;
    code: string | null;
    name: string;
    slug: string | null;
    title: string | null;
    level: string;
    mode: string;
    language: string | null;
    price: Prisma.Decimal | null;
    duration: string | null;
    start_date: Date | null;
    end_date: Date | null;
    image: string | null;
    tuition: string | null;
    schedule: string | null;
};

type MenuNode = {
    id: number;
    name: string;
    url: string | null;
    slug: string | null;
    icon: string | null;
    is_featured: boolean;
    is_disable: boolean;
    category_type: string;
    description?: string | null; // chỉ gắn ở root
    courses?: CourseSummary[] | null; // mảng khóa học
    children?: MenuNode[] | null;
};

type CategoryNode = {
    id: number;
    name: string | null;
    slug: string | null;
    url: string | null;
    parent_id: number | null;
    icon: string | null;
    is_featured: boolean;
    is_disable: boolean;
    category_type: string;
    description: string | null;
    level: number | null;
    children: CategoryNode[];
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
        const rows = (await this.categoryDAO.findAllByCategoryType("HEADER_MENU")) as any[];

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
                slug: r.slug ?? null,
                icon: r.icon,
                is_featured: Boolean(r.is_featured),
                is_disable: Boolean(r.is_disable),
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

    static async getCategoryTree(
        slugOrUrl?: string,
        categoryType?: string
    ): Promise<CategoryNode[] | CategoryNode | null> {
        // 1) Lấy tất cả categories (để có thể include children của categoryType, kể cả khác type)
        const categories = await prisma.category.findMany({
            orderBy: { category_id: "asc" },
        });
        if (!categories.length) return slugOrUrl ? null : [];

        // 2) Khởi tạo map node
        const byId = new Map<number, CategoryNode>();
        for (const r of categories) {
            const id = Number(r.category_id);
            const parentId = r.parent_id == null ? null : Number(r.parent_id);
            byId.set(id, {
                id,
                name: (r as any).name ?? null, // cột "name" trong DB
                slug: r.slug,
                url: r.url,
                parent_id: parentId,
                icon: r.icon,
                is_featured: Boolean(r.is_featured),
                is_disable: Boolean(r.is_disable),
                category_type: r.category_type,
                description: r.description,
                level: r.level,
                children: [],
            });
        }

        // 3) Gắn parent/child theo parent_id (không lọc theo type ở bước attach)
        const rootsAll: CategoryNode[] = [];
        for (const r of categories) {
            const id = Number(r.category_id);
            const node = byId.get(id)!;
            const parentId = node.parent_id;

            const isRoot = parentId == null || parentId === id || !byId.has(parentId);

            if (isRoot) {
                rootsAll.push(node);
            } else {
                const parent = byId.get(parentId)!;
                parent.children.push(node);
            }
        }

        // 4) Nếu có slugOrUrl: trả về subtree của node khớp slug/url
        if (slugOrUrl) {
            let target: CategoryNode | undefined;
            for (const n of byId.values()) {
                if (n.slug === slugOrUrl || n.url === slugOrUrl) {
                    target = n;
                    break;
                }
            }
            return target ?? null;
        }

        // 5) Không có slugOrUrl: nếu có categoryType -> trả về các root thuộc type đó,
        //    nhưng vẫn include toàn bộ con cháu (đã attach ở bước 3).
        if (categoryType) {
            // Root của "nhóm type" = node có category_type = categoryType và:
            // - hoặc không có parent,
            // - hoặc parent có category_type KHÁC categoryType,
            // - hoặc parent không tồn tại (edge-case)
            const isTypeRoot = (n: CategoryNode) => {
                if (n.category_type !== categoryType) return false;
                const pid = n.parent_id;
                if (pid == null || pid === n.id || !byId.has(pid)) return true;
                const pNode = byId.get(pid)!;
                return pNode.category_type !== categoryType;
            };

            const typeRoots = Array.from(byId.values()).filter(isTypeRoot);
            return typeRoots;
        }

        // 6) Nếu không lọc gì: trả toàn bộ roots (mọi type)
        return rootsAll;
    }
}
