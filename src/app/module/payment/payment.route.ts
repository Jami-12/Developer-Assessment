import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { topUpValidation } from "./payment.validation";
const router = Router();
router.use(auth(UserRole.COMPANY));
router.post(
  "/top-up",
  validateRequest(topUpValidation),
  PaymentController.topUp,
);
router.get("/", PaymentController.history);
export const PaymentRoutes = router;
