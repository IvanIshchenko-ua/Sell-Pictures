import { Router } from "express";
import { createOrderCtrl, getOrdersCtrl, deleteOrderCtrl, updateOrderStatusCtrl } from "../controllers/orderController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", createOrderCtrl); // публічний - створити замовлення
router.get("/", auth, getOrdersCtrl); // адмін - отримати всі замовлення
router.delete("/:id", auth, deleteOrderCtrl); // адмін - видалити замовлення
router.patch("/:id/status", auth, updateOrderStatusCtrl); // адмін - оновити статус

export default router;
