// src/routes/about.routes.ts
import { Router } from "express";
import { MediaController } from "@controllers/media.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";
import { upload } from "@middlewares/upload";

const router = Router();
const mediaController = new MediaController();

router.post(
    "/facilities",
    authRole([Role.ADMIN]),
    upload.single("file"),
    mediaController.createFacility.bind(mediaController)
);
router.put(
    "/facilities/:id",
    authRole([Role.ADMIN]),
    upload.single("file"),
    mediaController.updateFacility.bind(mediaController)
);
router.get("/facilities", mediaController.listFacilities.bind(mediaController));

router.post(
    "/videos",
    authRole([Role.ADMIN]),
    mediaController.createVideo.bind(mediaController)
);
router.put(
    "/videos/:id",
    authRole([Role.ADMIN]),
    mediaController.updateVideo.bind(mediaController)
);
router.get("/videos", mediaController.listVideos.bind(mediaController));

export default router;
