"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAdminByUsername = findAdminByUsername;
const db_1 = require("../config/db");
async function findAdminByUsername(username) {
    const [rows] = await db_1.pool.query("SELECT * FROM admin WHERE username = ?", [username]);
    const admin = rows[0];
    return admin ?? null;
}
