import { Request, Response } from "express";
import {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting
} from "../models/Painting";

export const getPaintings = async (_: Request, res: Response) => {
  const list = await getAllPaintings();
  res.json(list);
};

export const getPainting = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const painting = await getPaintingById(id);
  if (!painting) return res.status(404).json({ message: "Картину не знайдено" });
  res.json(painting);
};

export const createPaintingCtrl = async (req: Request, res: Response) => {
  const id = await createPainting(req.body);
  res.status(201).json({ id });
};

export const updatePaintingCtrl = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await updatePainting(id, req.body);
  res.json({ message: "Оновлено" });
};

export const deletePaintingCtrl = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deletePainting(id);
  res.json({ message: "Видалено" });
};
