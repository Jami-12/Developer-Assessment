import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProblemController } from "./problem.controller";
import {
  createProblemValidation,
  updateProblemValidation,
} from "./problem.validation";
const router = Router();
router.use(auth(UserRole.COMPANY));
router.post(
  "/",
  validateRequest(createProblemValidation),
  ProblemController.create,
);
router.get("/", ProblemController.list);
router.get("/:id", ProblemController.get);
router.patch(
  "/:id",
  validateRequest(updateProblemValidation),
  ProblemController.update,
);
router.delete("/:id", ProblemController.remove);
export const ProblemRoutes = router;
