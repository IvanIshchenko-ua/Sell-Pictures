import { Request, Response } from "express";
import { createOrder, getAllOrders, deleteOrder, updateOrderStatus } from "../models/Order";
import { OrderCreatePayload } from "../types";
import { AuthedRequest } from "../middleware/auth";
import { normalizeOrderInput, validateOrderInput } from "../utils/validation";
import { securityLog } from "../utils/logger";

export const createOrderCtrl = async (req: Request, res: Response) => {
  const validation = validateOrderInput(req.body);
  if (!validation.ok) {
    return res.status(400).json({ message: validation.message });
  }

  const payload = normalizeOrderInput(req.body) as OrderCreatePayload;
  try {
    const orderId = await createOrder(payload);
    securityLog.info("order.created", {
      requestId: req.requestId,
      orderId
    });
    res.status(201).json({ orderId });
  } catch {
    res.status(500).json({ message: "Помилка створення замовлення" });
  }
};

export const getOrdersCtrl = async (_: Request, res: Response) => {
  const orders = await getAllOrders();
  res.json(orders);
};

export const deleteOrderCtrl = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Некоректний ID замовлення" });
  }

  try {
    const success = await deleteOrder(orderId);
    if (!success) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }
    securityLog.warn("order.deleted", {
      requestId: req.requestId,
      adminId: req.admin?.id,
      orderId
    });
    res.json({ message: "Замовлення видалено" });
  } catch (err) {
    securityLog.error("order.delete_error", {
      requestId: req.requestId,
      adminId: req.admin?.id,
      orderId,
      message: err instanceof Error ? err.message : "unknown"
    });
    res.status(500).json({ message: "Помилка видалення замовлення" });
  }
};

export const updateOrderStatusCtrl = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Некоректний ID замовлення" });
  }

  const validStatuses = ["pending", "in_process", "shipped", "delivered", "returned"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Невірний статус замовлення" });
  }

  try {
    const success = await updateOrderStatus(
      orderId,
      status as "pending" | "in_process" | "shipped" | "delivered" | "returned"
    );
    if (!success) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }
    securityLog.info("order.status_changed", {
      requestId: req.requestId,
      adminId: req.admin?.id,
      orderId,
      status
    });
    res.json({ message: "Статус оновлено", status });
  } catch (err) {
    securityLog.error("order.status_change_error", {
      requestId: req.requestId,
      adminId: req.admin?.id,
      orderId,
      status,
      message: err instanceof Error ? err.message : "unknown"
    });
    res.status(500).json({ message: "Помилка оновлення статусу" });
  }
};
