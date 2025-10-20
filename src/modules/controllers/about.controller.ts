import { Request, Response } from "express";
import { AboutService } from "@services/about.service";

export class AboutController {
    async create(req: Request, res: Response) {
        try {
            const created = await AboutService.create(req.body);
            res.status(201).json(created);
        } catch (e) {
            res.status(500).json({ message: "Failed to create about." });
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid about_id." });
        try {
            const data = await AboutService.getById(id);
            res.json(data);
        } catch (e: any) {
            if (e?.message === "ABOUT_NOT_FOUND")
                return res.status(404).json({ message: "About not found." });
            res.status(500).json({ message: "Failed to get about." });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { q, category, page, page_size } = req.query;
            const result = await AboutService.list({
                category: category as string | undefined,
                q: q as string | undefined,
                page: page ? Number(page) : undefined,
                page_size: page_size ? Number(page_size) : undefined,
            });
            res.json(result);
        } catch {
            res.status(500).json({ message: "Failed to list about." });
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid about_id." });
        try {
            const updated = await AboutService.update(id, req.body);
            res.json(updated);
        } catch (e: any) {
            if (e?.message === "ABOUT_NOT_FOUND")
                return res.status(404).json({ message: "About not found." });
            res.status(500).json({ message: "Failed to update about." });
        }
    }

    async remove(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid about_id." });
        try {
            await AboutService.remove(id);
            res.status(204).end();
        } catch (e: any) {
            if (e?.message === "ABOUT_NOT_FOUND")
                return res.status(404).json({ message: "About not found." });
            res.status(500).json({ message: "Failed to delete about." });
        }
    }
}
