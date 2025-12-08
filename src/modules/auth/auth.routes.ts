import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signin", authController.loginUser);
router.post("/signup", authController.signupUser);

export const authRoutes = router;