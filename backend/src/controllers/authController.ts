import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByUsername } from "../models/Admin";
import { AdminJwtPayload } from "../types";

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };

  try {
    const admin = await findAdminByUsername(username);
    if (!admin) return res.status(401).json({ message: "Невірний логін або пароль" });

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Невірний логін або пароль" });

    const payload: AdminJwtPayload = { id: admin.id, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "8h" });

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Помилка сервера" });
  }
};
