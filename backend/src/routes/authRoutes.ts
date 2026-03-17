import { Router } from "express";
import { loginAdmin } from "../controllers/authController";
import { authRateLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", authRateLimiter, loginAdmin);

export default router;
