"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const multer_1 = __importDefault(require("multer"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paintingRoutes_1 = __importDefault(require("./routes/paintingRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const security_1 = require("./config/security");
const rateLimit_1 = require("./middleware/rateLimit");
const requestContext_1 = require("./middleware/requestContext");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
(0, security_1.ensureSecurityConfig)();
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, hpp_1.default)());
app.use(requestContext_1.attachRequestContext);
app.use(rateLimit_1.globalRateLimiter);
const allowedOrigins = new Set(security_1.securityConfig.corsOrigins);
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.has(origin))
            return callback(null, true);
        callback(new Error("CORS policy violation"));
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: security_1.securityConfig.requestJsonLimit }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads"), {
    dotfiles: "deny",
    maxAge: "1d",
    etag: true,
    index: false
}));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/paintings", paintingRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use((err, _, res, __) => {
    if (err.message.includes("CORS")) {
        return res.status(403).json({ message: "Request blocked by CORS policy" });
    }
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err.message.includes("Дозволені лише зображення")) {
        return res.status(400).json({ message: err.message });
    }
    logger_1.securityLog.error("server.unhandled_error", { message: err.message });
    return res.status(500).json({ message: "Internal server error" });
});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
});
server.requestTimeout = security_1.securityConfig.requestTimeoutMs;
server.headersTimeout = security_1.securityConfig.headersTimeoutMs;
server.keepAliveTimeout = security_1.securityConfig.keepAliveTimeoutMs;
