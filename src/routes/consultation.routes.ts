import { Router } from "express";
import { ConsultationController } from "@controllers/consultation.controller";

const router = Router();
const consultationController = new ConsultationController();

router.post(
    "/",
    consultationController.createConsultationRequest.bind(
        consultationController
    )
);

export default router;
