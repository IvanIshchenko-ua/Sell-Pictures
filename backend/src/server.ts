import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";

import authRoutes from "./routes/authRoutes";
import paintingRoutes from "./routes/paintingRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { ensureSecurityConfig, securityConfig } from "./config/security";
import { globalRateLimiter } from "./middleware/rateLimit";
import { attachRequestContext } from "./middleware/requestContext";
import { securityLog } from "./utils/logger";

dotenv.config();
ensureSecurityConfig();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(hpp());
app.use(attachRequestContext);

app.use(globalRateLimiter);

const allowedOrigins = new Set(securityConfig.corsOrigins);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error("CORS policy violation"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: securityConfig.requestJsonLimit }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    dotfiles: "deny",
    maxAge: "1d",
    etag: true,
    index: false
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.use((_: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err.message.includes("CORS")) {
    return res.status(403).json({ message: "Request blocked by CORS policy" });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err.message.includes("Дозволені лише зображення")) {
    return res.status(400).json({ message: err.message });
  }

  securityLog.error("server.unhandled_error", { message: err.message });
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});

server.requestTimeout = securityConfig.requestTimeoutMs;
server.headersTimeout = securityConfig.headersTimeoutMs;
server.keepAliveTimeout = securityConfig.keepAliveTimeoutMs;
