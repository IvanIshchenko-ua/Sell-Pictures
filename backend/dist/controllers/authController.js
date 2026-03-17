"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const security_1 = require("../config/security");
const logger_1 = require("../utils/logger");
const authLockout_1 = require("../security/authLockout");
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Некоректні дані входу" });
    }
    const normalizedUsername = username.trim();
    const ip = req.ip || "unknown";
    if (!normalizedUsername || !password) {
        return res.status(400).json({ message: "Некоректні дані входу" });
    }
    const lockState = (0, authLockout_1.isLoginLocked)(normalizedUsername, ip);
    if (lockState.locked) {
        if (lockState.retryAfterSec) {
            res.setHeader("Retry-After", lockState.retryAfterSec.toString());
        }
        logger_1.securityLog.warn("auth.login_locked", {
            requestId: req.requestId,
            username: normalizedUsername,
            ip,
            retryAfterSec: lockState.retryAfterSec
        });
        return res.status(429).json({ message: "Тимчасово заблоковано через багато невдалих спроб" });
    }
    try {
        const admin = await (0, Admin_1.findAdminByUsername)(normalizedUsername);
        if (!admin) {
            const failureState = (0, authLockout_1.registerLoginFailure)(normalizedUsername, ip);
            if (failureState.locked && failureState.retryAfterSec) {
                res.setHeader("Retry-After", failureState.retryAfterSec.toString());
            }
            logger_1.securityLog.warn("auth.login_failed", {
                requestId: req.requestId,
                reason: "user_not_found",
                username: normalizedUsername,
                ip
            });
            return res.status(401).json({ message: "Невірний логін або пароль" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            const failureState = (0, authLockout_1.registerLoginFailure)(normalizedUsername, ip);
            if (failureState.locked && failureState.retryAfterSec) {
                res.setHeader("Retry-After", failureState.retryAfterSec.toString());
            }
            logger_1.securityLog.warn("auth.login_failed", {
                requestId: req.requestId,
                reason: "invalid_password",
                username: normalizedUsername,
                ip
            });
            return res.status(401).json({ message: "Невірний логін або пароль" });
        }
        (0, authLockout_1.clearLoginFailures)(normalizedUsername, ip);
        const payload = { id: admin.id, username: admin.username };
        const token = jsonwebtoken_1.default.sign(payload, security_1.securityConfig.jwtSecret, {
            expiresIn: "8h",
            algorithm: "HS256"
        });
        logger_1.securityLog.info("auth.login_success", {
            requestId: req.requestId,
            adminId: admin.id,
            username: admin.username,
            ip
        });
        res.json({ token });
    }
    catch (error) {
        logger_1.securityLog.error("auth.login_error", {
            requestId: req.requestId,
            message: error instanceof Error ? error.message : "unknown"
        });
        res.status(500).json({ message: "Помилка сервера" });
    }
};
exports.loginAdmin = loginAdmin;
