import dotenv from "dotenv";

dotenv.config();

const parseInteger = (raw: string | undefined, fallback: number): number => {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

export const securityConfig = {
  jwtSecret: process.env.JWT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:8080")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  requestJsonLimit: process.env.REQUEST_JSON_LIMIT || "100kb",
  maxUploadSizeBytes: parseInteger(process.env.MAX_UPLOAD_SIZE_BYTES, 5 * 1024 * 1024),
  globalRateLimitWindowMs: parseInteger(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  globalRateLimitMax: parseInteger(process.env.GLOBAL_RATE_LIMIT_MAX, 250),
  authRateLimitWindowMs: parseInteger(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  authRateLimitMax: parseInteger(process.env.AUTH_RATE_LIMIT_MAX, 10),
  authLockoutWindowMs: parseInteger(process.env.AUTH_LOCKOUT_WINDOW_MS, 15 * 60 * 1000),
  authLockoutMaxFailures: parseInteger(process.env.AUTH_LOCKOUT_MAX_FAILURES, 5),
  authLockoutDurationMs: parseInteger(process.env.AUTH_LOCKOUT_DURATION_MS, 30 * 60 * 1000),
  orderRateLimitWindowMs: parseInteger(process.env.ORDER_RATE_LIMIT_WINDOW_MS, 5 * 60 * 1000),
  orderRateLimitMax: parseInteger(process.env.ORDER_RATE_LIMIT_MAX, 20),
  requestTimeoutMs: parseInteger(process.env.REQUEST_TIMEOUT_MS, 15 * 1000),
  headersTimeoutMs: parseInteger(process.env.HEADERS_TIMEOUT_MS, 10 * 1000),
  keepAliveTimeoutMs: parseInteger(process.env.KEEP_ALIVE_TIMEOUT_MS, 5 * 1000)
};

export const ensureSecurityConfig = (): void => {
  if (!securityConfig.jwtSecret || securityConfig.jwtSecret.length < 24) {
    throw new Error("JWT_SECRET must be set and at least 24 characters long.");
  }

  if (securityConfig.corsOrigins.length === 0) {
    throw new Error("CORS_ORIGIN must contain at least one allowed origin.");
  }
};