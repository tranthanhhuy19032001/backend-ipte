import { CategoryDAO } from "@dao/category.dao";
import { category } from "@prisma/client";

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
    async getCategoriesByType(categoryType: string) {
        return this.categoryDAO.findAllByCategoryType(categoryType);
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

    async getCategories(options: {
        categoryName?: string;
        categoryType?: string;
        page?: number;
        pageSize?: number;
    }): Promise<category[]> {
        return this.categoryDAO.findCategories(options);
    }
}
