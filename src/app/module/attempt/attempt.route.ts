import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AttemptController } from "./attempt.controller";
import {
  startAttemptValidation,
  submitAttemptValidation,
} from "./attempt.validation";
const router = Router();
router.use(auth(UserRole.CANDIDATE));
router.post(
  "/",
  validateRequest(startAttemptValidation),
  AttemptController.start,
);
router.get("/:id", AttemptController.get);
router.post(
  "/:id/submit",
  validateRequest(submitAttemptValidation),
  AttemptController.submit,
);
export const AttemptRoutes = router;
