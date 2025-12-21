import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./src/db.js";
import playersRouter from "./src/routes/players.js";
import matchupsRouter from "./src/routes/matchups.js";
import authRoutes from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import jwt from "jsonwebtoken";

export function requireAdminJWT(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

const app = express();

app.use(cors());
app.use(express.json());

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ✅ IMPORTANT: mount with /api prefix because frontend calls /api/...
app.use("/api/players", playersRouter);
app.use("/api/matchups", matchupsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Export the express app (Vercel will call it like a handler)
export default app;

// DB init (called once per cold start)
let dbReady = false;
export async function init() {
  if (dbReady) return;
  await connectDB();
  dbReady = true;
}
