import { Router } from "express";
import { createOrderCtrl, getOrdersCtrl } from "../controllers/orderController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", createOrderCtrl); // публічний
router.get("/", auth, getOrdersCtrl); // адмін

export default router;
