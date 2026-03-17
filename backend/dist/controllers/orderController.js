"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusCtrl = exports.deleteOrderCtrl = exports.getOrdersCtrl = exports.createOrderCtrl = void 0;
const Order_1 = require("../models/Order");
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
const createOrderCtrl = async (req, res) => {
    const validation = (0, validation_1.validateOrderInput)(req.body);
    if (!validation.ok) {
        return res.status(400).json({ message: validation.message });
    }
    const payload = (0, validation_1.normalizeOrderInput)(req.body);
    try {
        const orderId = await (0, Order_1.createOrder)(payload);
        logger_1.securityLog.info("order.created", {
            requestId: req.requestId,
            orderId
        });
        res.status(201).json({ orderId });
    }
    catch {
        res.status(500).json({ message: "Помилка створення замовлення" });
    }
};
exports.createOrderCtrl = createOrderCtrl;
const getOrdersCtrl = async (_, res) => {
    const orders = await (0, Order_1.getAllOrders)();
    res.json(orders);
};
exports.getOrdersCtrl = getOrdersCtrl;
const deleteOrderCtrl = async (req, res) => {
    const { id } = req.params;
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Некоректний ID замовлення" });
    }
    try {
        const success = await (0, Order_1.deleteOrder)(orderId);
        if (!success) {
            return res.status(404).json({ message: "Замовлення не знайдено" });
        }
        logger_1.securityLog.warn("order.deleted", {
            requestId: req.requestId,
            adminId: req.admin?.id,
            orderId
        });
        res.json({ message: "Замовлення видалено" });
    }
    catch (err) {
        logger_1.securityLog.error("order.delete_error", {
            requestId: req.requestId,
            adminId: req.admin?.id,
            orderId,
            message: err instanceof Error ? err.message : "unknown"
        });
        res.status(500).json({ message: "Помилка видалення замовлення" });
    }
};
exports.deleteOrderCtrl = deleteOrderCtrl;
const updateOrderStatusCtrl = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Некоректний ID замовлення" });
    }
    const validStatuses = ["pending", "in_process", "shipped", "delivered", "returned"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Невірний статус замовлення" });
    }
    try {
        const success = await (0, Order_1.updateOrderStatus)(orderId, status);
        if (!success) {
            return res.status(404).json({ message: "Замовлення не знайдено" });
        }
        logger_1.securityLog.info("order.status_changed", {
            requestId: req.requestId,
            adminId: req.admin?.id,
            orderId,
            status
        });
        res.json({ message: "Статус оновлено", status });
    }
    catch (err) {
        logger_1.securityLog.error("order.status_change_error", {
            requestId: req.requestId,
            adminId: req.admin?.id,
            orderId,
            status,
            message: err instanceof Error ? err.message : "unknown"
        });
        res.status(500).json({ message: "Помилка оновлення статусу" });
    }
};
exports.updateOrderStatusCtrl = updateOrderStatusCtrl;
