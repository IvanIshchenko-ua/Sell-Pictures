import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByUsername } from "../models/Admin";
import { AdminJwtPayload } from "../types";
import { securityConfig } from "../config/security";
import { securityLog } from "../utils/logger";
import { clearLoginFailures, isLoginLocked, registerLoginFailure } from "../security/authLockout";

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Некоректні дані входу" });
  }

  const normalizedUsername = username.trim();
  const ip = req.ip || "unknown";
  if (!normalizedUsername || !password) {
    return res.status(400).json({ message: "Некоректні дані входу" });
  }

  const lockState = isLoginLocked(normalizedUsername, ip);
  if (lockState.locked) {
    if (lockState.retryAfterSec) {
      res.setHeader("Retry-After", lockState.retryAfterSec.toString());
    }
    securityLog.warn("auth.login_locked", {
      requestId: req.requestId,
      username: normalizedUsername,
      ip,
      retryAfterSec: lockState.retryAfterSec
    });
    return res.status(429).json({ message: "Тимчасово заблоковано через багато невдалих спроб" });
  }

  try {
    const admin = await findAdminByUsername(normalizedUsername);
    if (!admin) {
      const failureState = registerLoginFailure(normalizedUsername, ip);
      if (failureState.locked && failureState.retryAfterSec) {
        res.setHeader("Retry-After", failureState.retryAfterSec.toString());
      }
      securityLog.warn("auth.login_failed", {
        requestId: req.requestId,
        reason: "user_not_found",
        username: normalizedUsername,
        ip
      });
      return res.status(401).json({ message: "Невірний логін або пароль" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const failureState = registerLoginFailure(normalizedUsername, ip);
      if (failureState.locked && failureState.retryAfterSec) {
        res.setHeader("Retry-After", failureState.retryAfterSec.toString());
      }
      securityLog.warn("auth.login_failed", {
        requestId: req.requestId,
        reason: "invalid_password",
        username: normalizedUsername,
        ip
      });
      return res.status(401).json({ message: "Невірний логін або пароль" });
    }

    clearLoginFailures(normalizedUsername, ip);

    const payload: AdminJwtPayload = { id: admin.id, username: admin.username };
    const token = jwt.sign(payload, securityConfig.jwtSecret, {
      expiresIn: "8h",
      algorithm: "HS256"
    });

    securityLog.info("auth.login_success", {
      requestId: req.requestId,
      adminId: admin.id,
      username: admin.username,
      ip
    });

    res.json({ token });
  } catch (error) {
    securityLog.error("auth.login_error", {
      requestId: req.requestId,
      message: error instanceof Error ? error.message : "unknown"
    });
    res.status(500).json({ message: "Помилка сервера" });
  }
};
