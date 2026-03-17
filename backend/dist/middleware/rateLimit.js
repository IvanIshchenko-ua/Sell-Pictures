"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderCreateRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const security_1 = require("../config/security");
const defaultHandlerMessage = "Забагато запитів. Спробуйте пізніше.";
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_1.securityConfig.globalRateLimitWindowMs,
    limit: security_1.securityConfig.globalRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: defaultHandlerMessage }
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_1.securityConfig.authRateLimitWindowMs,
    limit: security_1.securityConfig.authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Забагато спроб входу. Спробуйте пізніше." }
});
exports.orderCreateRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_1.securityConfig.orderRateLimitWindowMs,
    limit: security_1.securityConfig.orderRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Забагато спроб створення замовлення. Спробуйте пізніше." }
});
