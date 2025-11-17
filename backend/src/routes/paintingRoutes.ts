import { Router } from "express";
import {
  getPaintings,
  getPainting,
  createPaintingCtrl,
  updatePaintingCtrl,
  deletePaintingCtrl
} from "../controllers/paintingController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", getPaintings);
router.get("/:id", getPainting);

router.post("/", auth, createPaintingCtrl);
router.put("/:id", auth, updatePaintingCtrl);
router.delete("/:id", auth, deletePaintingCtrl);

export default router;
