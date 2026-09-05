import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { auditValidation } from "./admin.validation";
const router = Router();
router.use(auth(UserRole.ADMIN));
router.get("/metrics", AdminController.metrics);
router.get("/audit-logs", AdminController.listAudits);
router.post(
  "/audit-logs",
  validateRequest(auditValidation),
  AdminController.createAudit,
);
export const AdminRoutes = router;
