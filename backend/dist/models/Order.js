"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getAllOrders = getAllOrders;
exports.deleteOrder = deleteOrder;
exports.updateOrderStatus = updateOrderStatus;
const db_1 = require("../config/db");
async function createOrder(payload) {
    const conn = await db_1.pool.getConnection();
    try {
        await conn.beginTransaction();
        const { customer_name, customer_email, customer_phone, customer_comment, total_amount, items } = payload;
        const [orderResult] = await conn.query("INSERT INTO orders (customer_name, customer_email, customer_phone, customer_comment, total_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')", [customer_name, customer_email, customer_phone, customer_comment, total_amount]);
        // @ts-ignore
        const orderId = orderResult.insertId;
        for (const item of items) {
            await conn.query("INSERT INTO order_items (order_id, painting_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.painting_id, item.quantity, item.price]);
        }
        await conn.commit();
        return orderId;
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
}
async function getAllOrders() {
    const [rows] = await db_1.pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return rows;
}
async function deleteOrder(orderId) {
    const conn = await db_1.pool.getConnection();
    try {
        await conn.beginTransaction();
        // Delete order items first (foreign key constraint)
        await conn.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
        // Delete order
        const [result] = await conn.query("DELETE FROM orders WHERE id = ?", [orderId]);
        // @ts-ignore
        const affectedRows = result.affectedRows;
        await conn.commit();
        return affectedRows > 0;
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
}
async function updateOrderStatus(orderId, status) {
    const [result] = await db_1.pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    // @ts-ignore
    return result.affectedRows > 0;
}
