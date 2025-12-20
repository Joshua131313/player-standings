import { Router } from "express";
import Player from "../models/Player.js";
import { requireAdminJWT } from "../middleware/requireAdminJWT.js";

const router = Router();

router.get("/", async (_req, res) => {
  const players = await Player.find().sort({ createdAt: -1 });
  res.json(players);
});

router.post("/", requireAdminJWT, async (req, res) => {
  try {
    const name = (req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required." });

    // ✅ exact-match duplicate check (case-sensitive)
    const exists = await Player.exists({ name });
    if (exists) return res.status(400).json({ error: `${name} already exists.` });

    const created = await Player.create({ name });
    return res.status(201).json(created);
  } catch (e) {
    // ✅ if DB unique index triggers
    if (e?.code === 11000) {
      return res.status(400).json({ error: `That exact player name already exists.` });
    }
    return res.status(400).json({ error: e?.message || "Bad Request" });
  }
});

export default router;
