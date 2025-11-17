import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import paintingRoutes from "./routes/paintingRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
