import { pool } from "../config/db";
import { Order, OrderCreatePayload } from "../types";

export async function createOrder(payload: OrderCreatePayload): Promise<number> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { customer_name, customer_email, customer_phone, customer_comment, total_amount, items } =
      payload;

    const [orderResult] = await conn.query(
      "INSERT INTO orders (customer_name, customer_email, customer_phone, customer_comment, total_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')",
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

export async function deleteOrder(orderId: number): Promise<boolean> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete order items first (foreign key constraint)
    await conn.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);

    // Delete order
    const [result] = await conn.query("DELETE FROM orders WHERE id = ?", [orderId]);
    // @ts-ignore
    const affectedRows = result.affectedRows as number;

    await conn.commit();
    return affectedRows > 0;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "in_process" | "shipped" | "delivered" | "returned"
): Promise<boolean> {
  const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
  // @ts-ignore
  return (result.affectedRows as number) > 0;
}
