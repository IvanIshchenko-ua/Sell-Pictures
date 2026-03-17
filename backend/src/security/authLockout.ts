import { securityConfig } from "../config/security";

type AuthAttempt = {
  firstFailureAt: number;
  failures: number;
  lockedUntil?: number;
};

const attempts = new Map<string, AuthAttempt>();

const makeKey = (username: string, ip: string) => `${username.toLowerCase()}|${ip}`;

const now = () => Date.now();

export const isLoginLocked = (username: string, ip: string): { locked: boolean; retryAfterSec?: number } => {
  const key = makeKey(username, ip);
  const attempt = attempts.get(key);
  if (!attempt) return { locked: false };

  if (attempt.lockedUntil && attempt.lockedUntil > now()) {
    return { locked: true, retryAfterSec: Math.ceil((attempt.lockedUntil - now()) / 1000) };
  }

  if (attempt.lockedUntil && attempt.lockedUntil <= now()) {
    attempts.delete(key);
  }

  return { locked: false };
};

export const registerLoginFailure = (username: string, ip: string): { locked: boolean; retryAfterSec?: number } => {
  const key = makeKey(username, ip);
  const existing = attempts.get(key);
  const timestamp = now();

  if (!existing || timestamp - existing.firstFailureAt > securityConfig.authLockoutWindowMs) {
    attempts.set(key, {
      firstFailureAt: timestamp,
      failures: 1
    });
    return { locked: false };
  }

  existing.failures += 1;

  if (existing.failures >= securityConfig.authLockoutMaxFailures) {
    existing.lockedUntil = timestamp + securityConfig.authLockoutDurationMs;
    return { locked: true, retryAfterSec: Math.ceil(securityConfig.authLockoutDurationMs / 1000) };
  }

  attempts.set(key, existing);
  return { locked: false };
};

export const clearLoginFailures = (username: string, ip: string): void => {
  attempts.delete(makeKey(username, ip));
};