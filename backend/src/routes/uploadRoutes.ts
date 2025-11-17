import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadImageCtrl } from "../controllers/uploadController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, upload.single("image"), uploadImageCtrl);

export default router;
