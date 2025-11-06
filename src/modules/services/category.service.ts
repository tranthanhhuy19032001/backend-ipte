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
    slug: string | null;
    icon: string | null;
    category_type: string;
    description?: string | null;
    courses?: string | null;
    children?: MenuNode[] | null;
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
                slug: r.slug ?? null,
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

    static async getCategoryTreeBySlug(
        slugOrUrl?: string,
        categoryType?: string
    ): Promise<MenuNode | null> {
        // 1) Lấy node gốc theo slug hoặc url (ưu tiên slug)
        const root = await prisma.category.findFirst({
            where: {
                AND: [
                    categoryType ? { category_type: categoryType } : {},
                    {
                        OR: [{ slug: slugOrUrl }, { url: slugOrUrl }],
                    },
                ],
            },
        });

        if (!root) return null;

        // 2) Lấy toàn bộ nodes cùng category_type, có url bắt đầu bằng url gốc
        // (đủ dữ liệu để dựng cây n cấp)
        const rows = await prisma.category.findMany({
            where: {
                AND: [
                    { category_type: root.category_type },
                    // Nếu thiếu url, vẫn lọc theo slug gốc như fallback
                    root.url
                        ? { url: { startsWith: root.url } }
                        : { slug: { startsWith: root.slug ?? "" } },
                ],
            },
            orderBy: { category_id: "asc" },
        });

        // 3) Index theo id để truy cập nhanh
        const byId = new Map<number, (typeof rows)[number]>();
        for (const r of rows) byId.set(Number(r.category_id), r);

        // 4) Build tree dựa trên url prefix + level
        const buildNode = (r: (typeof rows)[number]): MenuNode => {
            const node: MenuNode = {
                id: Number(r.category_id),
                name: r.name,
                url: r.url,
                slug: r.slug,
                icon: r.icon,
                category_type: r.category_type,
                // gốc có description, các node con không cần
                description:
                    r.category_id === root.category_id
                        ? r.description
                        : undefined,
                // placeholder: gán courses = tên node (nếu muốn). Nếu có bảng course, thay thế bằng list/JSON từ JOIN.
                courses:
                    r.category_id === root.category_id ? undefined : r.name,
                children: null,
            };

            // node con trực tiếp: level = level cha + 1 và URL bắt đầu bằng parent.url + '/'
            // dùng startsWith để tránh “kẹt” vì parent_id tự tham chiếu
            const parentUrl = r.url ?? "";
            const expectedLevel = (r.level ?? 0) + 1;
            const directChildren = rows.filter((x) => {
                if (x.category_id === r.category_id) return false;
                const childUrl = x.url ?? "";
                const lvOk = (x.level ?? 0) === expectedLevel;
                const urlOk =
                    parentUrl &&
                    childUrl.startsWith(
                        parentUrl.endsWith("/") ? parentUrl : parentUrl + "/"
                    );
                return lvOk && urlOk;
            });

            if (directChildren.length) {
                node.children = directChildren.map(buildNode);
            }

            return node;
        };

        const result = buildNode(root);

        // 5) (tuỳ chọn) sort lại children nếu muốn theo tên hoặc thứ tự custom
        const sortTreeByIdAsc = (n: MenuNode | null) => {
            if (!n?.children?.length) return;
            n.children.sort((a, b) => a.id - b.id); // hoặc theo tên: localeCompare
            n.children.forEach(sortTreeByIdAsc);
        };
        sortTreeByIdAsc(result);

        return result;
    }
}
