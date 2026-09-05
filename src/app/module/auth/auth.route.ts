import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";
const router = Router();
router.post(
  "/register",
  validateRequest(registerValidation),
  AuthController.register,
);
router.post("/login", validateRequest(loginValidation), AuthController.login);
router.get("/me", auth(), AuthController.me);
router.post("/logout", auth(), AuthController.logout);
export const AuthRoutes = router;
