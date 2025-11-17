import { Request, Response } from "express";
import { createOrder, getAllOrders } from "../models/Order";
import { OrderCreatePayload } from "../types";

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
