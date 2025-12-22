import { Request, Response } from "express";
import { MediaService } from "@services/media.service";
import { camelCaseKeysDeep } from "@utils/response";
import { parseJsonField } from "@utils/requestParser";
import { FacilityDTO } from "@dto/MediaDTO";

export class MediaController {
    async createFacility(req: Request, res: Response) {
        let payload: Partial<FacilityDTO>;
        try {
            payload = parseJsonField<Partial<FacilityDTO>>(req);
        } catch {
            return res.status(400).json({ message: "Invalid request payload." });
        }
        try {
            const created = await MediaService.createFacility(payload, req.file);
            res.status(201).json(camelCaseKeysDeep(created));
        } catch (e) {
            res.status(500).json({ message: "Failed to create facility." });
        }
    }

    async updateFacility(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid facility_id." });
        let payload: Partial<FacilityDTO>;
        try {
            payload = parseJsonField<Partial<FacilityDTO>>(req);
        } catch {
            return res.status(400).json({ message: "Invalid request payload." });
        }
        try {
            const updated = await MediaService.updateFacility(id, payload, req.file);
            res.json(camelCaseKeysDeep(updated));
        } catch (e: any) {
            if (e?.message === "FACILITY_NOT_FOUND")
                return res.status(404).json({ message: "Facility not found." });
            res.status(500).json({ message: "Failed to update facility." });
        }
    }
    async listFacilities(req: Request, res: Response) {
        try {
            const facilities = await MediaService.listFacilities();
            res.json(camelCaseKeysDeep(facilities));
        } catch (e) {
            res.status(500).json({ message: "Failed to retrieve facilities." });
        }
    }

    async createVideo(req: Request, res: Response) {
        const payload = req.body;
        try {
            const created = await MediaService.createVideo(payload);
            res.status(201).json(camelCaseKeysDeep(created));
        } catch (e) {
            res.status(500).json({ message: "Failed to create video." });
        }
    }

    async updateVideo(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid video_id." });
        const payload = req.body;
        try {
            const updated = await MediaService.updateVideo(id, payload);
            res.json(camelCaseKeysDeep(updated));
        } catch (e: any) {
            if (e?.message === "VIDEO_NOT_FOUND")
                return res.status(404).json({ message: "Video not found." });
            res.status(500).json({ message: "Failed to update video." });
        }
    }

    async listVideos(req: Request, res: Response) {
        try {
            const videos = await MediaService.listVideos();
            res.json(camelCaseKeysDeep(videos));
        } catch (e) {
            res.status(500).json({ message: "Failed to retrieve videos." });
        }
    }
    
}
