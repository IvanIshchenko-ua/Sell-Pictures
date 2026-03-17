"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachRequestContext = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
const attachRequestContext = (req, res, next) => {
    const requestId = req.headers["x-request-id"]?.toString() || crypto_1.default.randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    const startedAt = Date.now();
    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        logger_1.securityLog.info("request.completed", {
            requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "unknown"
        });
    });
    next();
};
exports.attachRequestContext = attachRequestContext;
