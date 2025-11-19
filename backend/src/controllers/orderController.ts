import { Request, Response } from "express";
import { createOrder, getAllOrders, deleteOrder, updateOrderStatus } from "../models/Order";
import { OrderCreatePayload } from "../types";
import { AuthedRequest } from "../middleware/auth";

export const createOrderCtrl = async (req: Request, res: Response) => {
  const payload = req.body as OrderCreatePayload;
  try {
    const orderId = await createOrder(payload);
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
  try {
    const success = await deleteOrder(Number(id));
    if (!success) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }
    res.json({ message: "Замовлення видалено" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Помилка видалення замовлення" });
  }
};

export const updateOrderStatusCtrl = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };

  const validStatuses = ["pending", "in_process", "shipped", "delivered", "returned"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Невірний статус замовлення" });
  }

  try {
    const success = await updateOrderStatus(
      Number(id),
      status as "pending" | "in_process" | "shipped" | "delivered" | "returned"
    );
    if (!success) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }
    res.json({ message: "Статус оновлено", status });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Помилка оновлення статусу" });
  }
};
