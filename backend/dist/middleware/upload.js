"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const security_1 = require("../config/security");
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const extensionByMime = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg"
};
const storage = multer_1.default.diskStorage({
    destination(_, __, cb) {
        cb(null, path_1.default.join(__dirname, "../../uploads"));
    },
    filename(_, file, cb) {
        const extension = extensionByMime[file.mimetype] || path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto_1.default.randomUUID()}${extension}`);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: security_1.securityConfig.maxUploadSizeBytes,
        files: 1
    },
    fileFilter(_, file, cb) {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error("Дозволені лише зображення (jpeg/png/webp/gif/svg)"));
        }
        cb(null, true);
    }
});
