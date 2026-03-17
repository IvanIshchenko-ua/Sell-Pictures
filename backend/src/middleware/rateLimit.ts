import rateLimit from "express-rate-limit";
import { securityConfig } from "../config/security";

const defaultHandlerMessage = "Забагато запитів. Спробуйте пізніше.";

export const globalRateLimiter = rateLimit({
  windowMs: securityConfig.globalRateLimitWindowMs,
  limit: securityConfig.globalRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: defaultHandlerMessage }
});

export const authRateLimiter = rateLimit({
  windowMs: securityConfig.authRateLimitWindowMs,
  limit: securityConfig.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Забагато спроб входу. Спробуйте пізніше." }
});

export const orderCreateRateLimiter = rateLimit({
  windowMs: securityConfig.orderRateLimitWindowMs,
  limit: securityConfig.orderRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Забагато спроб створення замовлення. Спробуйте пізніше." }
});