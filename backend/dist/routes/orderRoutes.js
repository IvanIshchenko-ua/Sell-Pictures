"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post("/", rateLimit_1.orderCreateRateLimiter, orderController_1.createOrderCtrl); // публічний - створити замовлення
router.get("/", auth_1.auth, orderController_1.getOrdersCtrl); // адмін - отримати всі замовлення
router.delete("/:id", auth_1.auth, orderController_1.deleteOrderCtrl); // адмін - видалити замовлення
router.patch("/:id/status", auth_1.auth, orderController_1.updateOrderStatusCtrl); // адмін - оновити статус
exports.default = router;
