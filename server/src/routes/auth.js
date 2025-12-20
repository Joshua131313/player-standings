import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({ token, user: { email, role: "admin" } });
});

export default router;
