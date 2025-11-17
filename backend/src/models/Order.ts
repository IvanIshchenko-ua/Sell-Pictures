import { pool } from "../config/db";
import { Order, OrderCreatePayload } from "../types";

export async function createOrder(payload: OrderCreatePayload): Promise<number> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { customer_name, customer_email, customer_phone, customer_comment, total_amount, items } =
      payload;

    const [orderResult] = await conn.query(
      "INSERT INTO orders (customer_name, customer_email, customer_phone, customer_comment, total_amount) VALUES (?, ?, ?, ?, ?)",
      [customer_name, customer_email, customer_phone, customer_comment, total_amount]
    );
    // @ts-ignore
    const orderId = orderResult.insertId as number;

    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items (order_id, painting_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.painting_id, item.quantity, item.price]
      );
    }

    await conn.commit();
    return orderId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  return rows as Order[];
}
