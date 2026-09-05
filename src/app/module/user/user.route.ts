import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserController } from "./user.controller";
const router = Router();
router.get("/profile", auth(), UserController.getProfile);
router.patch("/profile", auth(), UserController.updateProfile);
export const UserRoutes = router;
