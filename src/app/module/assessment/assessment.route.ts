import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AssessmentController } from "./assessment.controller";
import {
  createAssessmentValidation,
  invitationValidation,
  updateAssessmentValidation,
} from "./assessment.validation";
const router = Router();
router.use(auth(UserRole.COMPANY));
router.post(
  "/",
  validateRequest(createAssessmentValidation),
  AssessmentController.create,
);
router.get("/", AssessmentController.list);
router.get("/:id", AssessmentController.get);
router.patch(
  "/:id",
  validateRequest(updateAssessmentValidation),
  AssessmentController.update,
);
router.delete("/:id", AssessmentController.remove);
router.post(
  "/:id/invitations",
  validateRequest(invitationValidation),
  AssessmentController.invite,
);
export const AssessmentRoutes = router;
