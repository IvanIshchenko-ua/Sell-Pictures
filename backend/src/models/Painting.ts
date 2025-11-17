import { pool } from "../config/db";
import { Painting } from "../types";

export async function getAllPaintings(): Promise<Painting[]> {
  const [rows] = await pool.query("SELECT * FROM paintings ORDER BY created_at DESC");
  return rows as Painting[];
}

export async function getPaintingById(id: number): Promise<Painting | null> {
  const [rows] = await pool.query("SELECT * FROM paintings WHERE id = ?", [id]);
  const p = (rows as Painting[])[0];
  return p ?? null;
}

interface PaintingCreateInput {
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
}

export async function createPainting(data: PaintingCreateInput): Promise<number> {
  const { title, description = "", price, image_url = "", category = "" } = data;
  const [result] = await pool.query(
    "INSERT INTO paintings (title, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)",
    [title, description, price, image_url, category]
  );
  // @ts-ignore
  return result.insertId as number;
}

export async function updatePainting(
  id: number,
  data: PaintingCreateInput
): Promise<void> {
  const { title, description = "", price, image_url = "", category = "" } = data;
  await pool.query(
    "UPDATE paintings SET title=?, description=?, price=?, image_url=?, category=? WHERE id=?",
    [title, description, price, image_url, category, id]
  );
}

export async function deletePainting(id: number): Promise<void> {
  await pool.query("DELETE FROM paintings WHERE id = ?", [id]);
}
