import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Option B: simple admin login with env creds
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USER || !ADMIN_PASS || !JWT_SECRET) {
      return res.status(500).json({ error: "Admin auth env vars missing" });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin", username: ADMIN_USER },
      JWT_SECRET,
      { expiresIn: "7d" } // adjust if you want
    );

    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
router.get("/ping", (_req, res) => res.json({ ok: true }));

export default router;
