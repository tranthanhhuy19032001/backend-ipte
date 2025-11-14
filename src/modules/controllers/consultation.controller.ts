import { Request, Response } from "express";
import { ConsultationService } from "@services/consultation.service";

const consultationService = new ConsultationService();

export class ConsultationController {
    async createConsultationRequest(req: Request, res: Response) {
        try {
            const { name, phone, email, targetScore, message } = req.body;
            const created = await consultationService.createConsultationRequest({
                name,
                phone,
                email,
                targetScore,
                message,
            });
            res.status(201).json(created);
        } catch (e) {
            res.status(500).json({
                message: "Failed to create consultation request.",
            });
        }
    }
}
