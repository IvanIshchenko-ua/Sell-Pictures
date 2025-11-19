import { pool } from "../config/db";
import { Admin } from "../types";

export async function findAdminByUsername(username: string): Promise<Admin | null> {
  const [rows] = await pool.query("SELECT * FROM admin WHERE username = ?", [username]);
  const admin = (rows as Admin[])[0];
  return admin ?? null;
}
