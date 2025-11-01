import { consultation_request } from "@prisma/client";

import prisma from "@config/database";

export class ConsultationDAO {
    async create(
        data: Omit<
            consultation_request,
            "consultation_id" | "createdAt" | "updatedAt"
        >
    ): Promise<consultation_request> {
        return prisma.consultation_request.create({
            data,
        });
    }
}
