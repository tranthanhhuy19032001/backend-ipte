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
    category_type: string;
    description?: string | null; // chỉ gắn ở root
    courses?: CourseSummary[] | null; // mảng khóa học
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
        // 1) Node gốc theo slug hoặc url
        const root = await prisma.category.findFirst({
            where: {
                AND: [
                    categoryType ? { category_type: categoryType } : {},
                    { OR: [{ slug: slugOrUrl }, { url: slugOrUrl }] },
                ],
            },
        });
        if (!root) return null;

        // 2) Lấy toàn bộ categories trong cùng category_type và cùng prefix url
        const rows = await prisma.category.findMany({
            where: {
                AND: [
                    { category_type: root.category_type },
                    root.url
                        ? { url: { startsWith: root.url } }
                        : { slug: { startsWith: root.slug ?? "" } },
                ],
            },
            orderBy: { category_id: "asc" },
        });

        // 3) Lấy toàn bộ courses của *mọi* category xuất hiện trong cây (1 query)
        const categoryIds = rows.map((r) => Number(r.category_id));
        const courses = await prisma.course.findMany({
            where: { category_id: { in: categoryIds } },
            orderBy: [{ category_id: "asc" }, { course_id: "asc" }],
            select: {
                course_id: true,
                course_code: true,
                course_name: true,
                slug: true,
                title: true,
                level: true,
                mode: true,
                language: true,
                price: true,
                duration: true,
                start_date: true,
                end_date: true,
                image: true,
                tuition: true,
                schedule: true,
                category_id: true,
            },
        });

        // 4) Group courses theo category_id
        const coursesByCategory = new Map<number, CourseSummary[]>();
        for (const c of courses) {
            const k = Number(c.category_id);
            const list = coursesByCategory.get(k) ?? [];
            list.push({
                id: Number(c.course_id),
                code: c.course_code,
                name: c.course_name,
                slug: c.slug,
                title: c.title,
                level: String(c.level),
                mode: String(c.mode),
                language: c.language,
                price: c.price, // hoặc Number(c.price ?? 0)
                duration: c.duration,
                start_date: c.start_date,
                end_date: c.end_date,
                image: c.image,
                tuition: c.tuition,
                schedule: c.schedule,
            });
            coursesByCategory.set(k, list);
        }

        // 5) Build tree dựa theo url prefix + level
        const buildNode = (r: (typeof rows)[number]): MenuNode => {
            const node: MenuNode = {
                id: Number(r.category_id),
                name: r.name,
                url: r.url,
                slug: r.slug,
                icon: r.icon,
                category_type: r.category_type,
                description:
                    r.category_id === root.category_id
                        ? r.description
                        : undefined,
                courses: coursesByCategory.get(Number(r.category_id)) ?? [], // mảng (rỗng nếu không có)
                children: null,
            };

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

        // 6) (tuỳ chọn) sort children & courses
        const sortTree = (n: MenuNode | null) => {
            if (!n) return;
            if (n.children?.length) {
                n.children.sort((a, b) => a.id - b.id);
                n.children.forEach(sortTree);
            }
            if (n.courses?.length) {
                n.courses.sort((a, b) => a.id - b.id);
            }
        };
        sortTree(result);

        return result;
    }
}
