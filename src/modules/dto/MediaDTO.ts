export type VideoDTO = {
    videoId?: number;
    title?: string;
    description?: string | null;
    videoUrl?: string | null;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    version?: number;
};

export type FacilityDTO = {
    facilityId?: number;
    title?: string;
    description?: string | null;
    imageName?: string | null;
    imageUrl?: string | null;
    deleteImageUrl: string | null;
    isDisabled?: boolean | null;
    isImageChanged: boolean | null;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    version?: number;
};

export function mapFromMediaToFacilityDTO(data: any): FacilityDTO {
    return {
        facilityId: data.media_id,
        title: data.title,
        description: data.description,
        imageName: data.image_name,
        imageUrl: data.image_url,
        deleteImageUrl: data.delete_image_url,
        isDisabled: data.is_disabled,
        
        isImageChanged: null,
        
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by,
        updatedBy: data.updated_by,
        version: data.version
    };
}

export function mapFromMediaToVideoDTO(data: any): VideoDTO {
    return {
        videoId: data.media_id,
        title: data.title,
        description: data.description,
        videoUrl: data.video_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by, 
        updatedBy: data.updated_by,
        version: data.version
    };
}