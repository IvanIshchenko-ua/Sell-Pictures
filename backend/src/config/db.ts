import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbPort = Number(process.env.DB_PORT ?? 3306);

export const pool = createPool({
  host: process.env.DB_HOST,
  port: Number.isNaN(dbPort) ? 3306 : dbPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});
