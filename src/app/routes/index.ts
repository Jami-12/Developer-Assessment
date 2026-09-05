import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { ProblemRoutes } from "../module/problem/problem.route";
import { AssessmentRoutes } from "../module/assessment/assessment.route";
import { AttemptRoutes } from "../module/attempt/attempt.route";
import { PaymentRoutes } from "../module/payment/payment.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/problems", ProblemRoutes);
router.use("/assessments", AssessmentRoutes);
router.use("/attempts", AttemptRoutes);
router.use("/payments", PaymentRoutes);
router.use("/admin", AdminRoutes);
export default router;
