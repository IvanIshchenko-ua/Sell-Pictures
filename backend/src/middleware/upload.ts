import multer from "multer";
import path from "path";
import crypto from "crypto";
import { securityConfig } from "../config/security";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

const extensionByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg"
};

const storage = multer.diskStorage({
  destination(_, __, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename(_, file, cb) {
    const extension = extensionByMime[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: securityConfig.maxUploadSizeBytes,
    files: 1
  },
  fileFilter(_, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Дозволені лише зображення (jpeg/png/webp/gif/svg)"));
    }
    cb(null, true);
  }
});
