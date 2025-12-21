export type BranchDTO = {
    branchId?: number;

    slug?: string;
    title?: string;
    description?: string;

    address?: string | null;

    category?: string | "BRANCH";

    createdAt?: string;
    updatedAt?: string;

    createdBy?: string | null;
    updatedBy?: string | null;

    version?: number;
    mapUrl?: string | null;
};

export function mapToBranchDTO(entity: any): BranchDTO {
    return {
        branchId: entity.about_branch_id,
        slug: entity.slug,
        title: entity.title,
        description: entity.description,
        address: entity.address,
        createdAt: entity.created_at ? entity.created_at.toISOString() : undefined,
        updatedAt: entity.updated_at ? entity.updated_at.toISOString() : undefined,
        createdBy: entity.created_by,
        updatedBy: entity.updated_by,
        version: entity.version,
        mapUrl: entity.map_url,
    };
}
