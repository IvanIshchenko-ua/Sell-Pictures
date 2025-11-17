import { Request, Response } from "express";

export const uploadImageCtrl = (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Файл не завантажено" });
  const image_url = `/uploads/${req.file.filename}`;
  res.json({ image_url });
};
