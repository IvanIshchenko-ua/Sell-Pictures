"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPaintings = getAllPaintings;
exports.getPaintingById = getPaintingById;
exports.createPainting = createPainting;
exports.updatePainting = updatePainting;
exports.deletePainting = deletePainting;
const db_1 = require("../config/db");
async function getAllPaintings() {
    const [rows] = await db_1.pool.query("SELECT * FROM paintings ORDER BY created_at DESC");
    return rows;
}
async function getPaintingById(id) {
    const [rows] = await db_1.pool.query("SELECT * FROM paintings WHERE id = ?", [id]);
    const p = rows[0];
    return p ?? null;
}
async function createPainting(data) {
    const { title, description = "", price, image_url = "", category = "" } = data;
    const [result] = await db_1.pool.query("INSERT INTO paintings (title, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)", [title, description, price, image_url, category]);
    // @ts-ignore
    return result.insertId;
}
async function updatePainting(id, data) {
    const { title, description = "", price, image_url = "", category = "" } = data;
    await db_1.pool.query("UPDATE paintings SET title=?, description=?, price=?, image_url=?, category=? WHERE id=?", [title, description, price, image_url, category, id]);
}
async function deletePainting(id) {
    await db_1.pool.query("DELETE FROM paintings WHERE id = ?", [id]);
}
