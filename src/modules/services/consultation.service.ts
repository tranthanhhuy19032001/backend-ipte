import { ConsultationDAO } from "@dao/consultation.dao";

export class ConsultationService {
    private consultationDAO: ConsultationDAO;

    constructor() {
        this.consultationDAO = new ConsultationDAO();
    }
    async createConsultationRequest(request: {
        name: string;
        phone: string;
        email: string;
        targetScore: string;
        message: string;
    }) {
        const data = {
            full_name: request.name,
            phone: request.phone,
            email: request.email,
            target_score: request.targetScore,
            message: request.message,
        };
        return this.consultationDAO.create(data as any);
    }
}
