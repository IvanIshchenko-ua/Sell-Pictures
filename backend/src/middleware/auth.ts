import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AdminJwtPayload } from "../types";

export interface AuthedRequest extends Request {
  admin?: AdminJwtPayload;
}

export const auth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AdminJwtPayload;
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
