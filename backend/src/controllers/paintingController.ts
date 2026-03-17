import { Request, Response } from "express";
import {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting
} from "../models/Painting";
import { normalizePaintingInput, validatePaintingInput } from "../utils/validation";
import { AuthedRequest } from "../middleware/auth";
import { securityLog } from "../utils/logger";

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

export const createPaintingCtrl = async (req: AuthedRequest, res: Response) => {
  const check = validatePaintingInput(req.body);
  if (!check.ok) return res.status(400).json({ message: check.message });

  const id = await createPainting(normalizePaintingInput(req.body));
  securityLog.info("painting.created", {
    requestId: req.requestId,
    adminId: req.admin?.id,
    paintingId: id
  });
  res.status(201).json({ id });
};

export const updatePaintingCtrl = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Некоректний ID" });
  }

  const check = validatePaintingInput(req.body);
  if (!check.ok) return res.status(400).json({ message: check.message });

  await updatePainting(id, normalizePaintingInput(req.body));
  securityLog.info("painting.updated", {
    requestId: req.requestId,
    adminId: req.admin?.id,
    paintingId: id
  });
  res.json({ message: "Оновлено" });
};

export const deletePaintingCtrl = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Некоректний ID" });
  }

  await deletePainting(id);
  securityLog.warn("painting.deleted", {
    requestId: req.requestId,
    adminId: req.admin?.id,
    paintingId: id
  });
  res.json({ message: "Видалено" });
};
