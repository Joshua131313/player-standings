import express from "express";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";

import { connectDB } from "./db.js";
import playersRouter from "./routes/players.js";
import matchupsRouter from "./routes/matchups.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

export function requireAdminJWT(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/players", playersRouter);
app.use("/matchups", matchupsRouter);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
});
