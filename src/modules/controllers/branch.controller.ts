import { Request, Response } from "express";
import { BranchService } from "@services/branch.service";

export class BranchController {
    async create(req: Request, res: Response) {
        try {
            const created = await BranchService.create(req.body);
            res.status(201).json(created);
        } catch (e: any) {
            if (
                e?.message === "ABOUT_NOT_FOUND" ||
                e?.message === "FK_VIOLATION"
            ) {
                return res
                    .status(400)
                    .json({ message: "Invalid about_id (foreign key)." });
            }
            res.status(500).json({ message: "Failed to create branch." });
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid branch_id." });
        try {
            const data = await BranchService.getById(id);
            res.json(data);
        } catch (e: any) {
            if (e?.message === "BRANCH_NOT_FOUND")
                return res.status(404).json({ message: "Branch not found." });
            res.status(500).json({ message: "Failed to get branch." });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { about_id, q, page, page_size } = req.query;
            const result = await BranchService.list({
                about_id: about_id ? Number(about_id) : undefined,
                q: q as string | undefined,
                page: page ? Number(page) : undefined,
                page_size: page_size ? Number(page_size) : undefined,
            });
            res.json(result);
        } catch {
            res.status(500).json({ message: "Failed to list branches." });
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid branch_id." });
        try {
            const updated = await BranchService.update(id, req.body);
            res.json(updated);
        } catch (e: any) {
            if (e?.message === "BRANCH_NOT_FOUND")
                return res.status(404).json({ message: "Branch not found." });
            if (e?.message === "FK_VIOLATION")
                return res
                    .status(400)
                    .json({ message: "Invalid about_id (foreign key)." });
            res.status(500).json({ message: "Failed to update branch." });
        }
    }

    async remove(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: "Invalid branch_id." });
        try {
            await BranchService.remove(id);
            res.status(204).end();
        } catch (e: any) {
            if (e?.message === "BRANCH_NOT_FOUND")
                return res.status(404).json({ message: "Branch not found." });
            res.status(500).json({ message: "Failed to delete branch." });
        }
    }
}
