"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLoginFailures = exports.registerLoginFailure = exports.isLoginLocked = void 0;
const security_1 = require("../config/security");
const attempts = new Map();
const makeKey = (username, ip) => `${username.toLowerCase()}|${ip}`;
const now = () => Date.now();
const isLoginLocked = (username, ip) => {
    const key = makeKey(username, ip);
    const attempt = attempts.get(key);
    if (!attempt)
        return { locked: false };
    if (attempt.lockedUntil && attempt.lockedUntil > now()) {
        return { locked: true, retryAfterSec: Math.ceil((attempt.lockedUntil - now()) / 1000) };
    }
    if (attempt.lockedUntil && attempt.lockedUntil <= now()) {
        attempts.delete(key);
    }
    return { locked: false };
};
exports.isLoginLocked = isLoginLocked;
const registerLoginFailure = (username, ip) => {
    const key = makeKey(username, ip);
    const existing = attempts.get(key);
    const timestamp = now();
    if (!existing || timestamp - existing.firstFailureAt > security_1.securityConfig.authLockoutWindowMs) {
        attempts.set(key, {
            firstFailureAt: timestamp,
            failures: 1
        });
        return { locked: false };
    }
    existing.failures += 1;
    if (existing.failures >= security_1.securityConfig.authLockoutMaxFailures) {
        existing.lockedUntil = timestamp + security_1.securityConfig.authLockoutDurationMs;
        return { locked: true, retryAfterSec: Math.ceil(security_1.securityConfig.authLockoutDurationMs / 1000) };
    }
    attempts.set(key, existing);
    return { locked: false };
};
exports.registerLoginFailure = registerLoginFailure;
const clearLoginFailures = (username, ip) => {
    attempts.delete(makeKey(username, ip));
};
exports.clearLoginFailures = clearLoginFailures;
