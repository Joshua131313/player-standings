import { Router } from "express";
import crypto from "crypto";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getReplayDownloadUrl } from "../lib/s3.js";

import Matchup from "../models/Matchup.js";
import Player from "../models/Player.js";
import { uploadReplay } from "../middleware/uploadReplay.js";
import { s3 } from "../lib/s3.js";
import { requireAdminJWT } from "../middleware/requireAdminJWT.js";

const router = Router();

// GET all matchups
router.get("/", async (_req, res) => {
  const matchups = await Matchup.find()
    .sort({ playedAt: -1 })
    .populate("teams.players.playerId", "name");
  res.json(matchups);
});


// POST create matchup (replay OPTIONAL)
router.post("/", requireAdminJWT, async (req, res) => {
  uploadReplay(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });

      const { playedAt, mode, map, teams } = req.body;

      if (!["1v1", "2v2", "3v3"].includes(mode)) {
        return res.status(400).json({ error: "Invalid mode" });
      }

      if (!map?.trim()) {
        return res.status(400).json({ error: "Map is required" });
      }

      // Parse teams JSON
      let parsedTeams = teams;
      if (typeof teams === "string") {
        try {
          parsedTeams = JSON.parse(teams);
        } catch {
          return res.status(400).json({ error: "teams must be valid JSON" });
        }
      }

      if (!Array.isArray(parsedTeams) || parsedTeams.length < 2) {
        return res.status(400).json({ error: "At least 2 teams are required" });
      }

      // Validate teams
      const allPlayerIds = [];

      for (const t of parsedTeams) {
        if (typeof t.teamIndex !== "number") {
          return res.status(400).json({ error: "teamIndex is required" });
        }
        if (!["win", "loss"].includes(t.result)) {
          return res.status(400).json({ error: "Invalid team result" });
        }
        if (!Array.isArray(t.players) || t.players.length === 0) {
          return res.status(400).json({ error: "Each team must have players" });
        }

        for (const p of t.players) {
          if (!p.playerId || !p.army) {
            return res.status(400).json({
              error: "Each player needs playerId and army",
            });
          }
          allPlayerIds.push(String(p.playerId));
        }
      }

      // Prevent duplicate players across teams
      if (new Set(allPlayerIds).size !== allPlayerIds.length) {
        return res.status(400).json({
          error: "Player cannot appear in multiple teams",
        });
      }

      // Ensure at least one winning team
      if (!parsedTeams.some((t) => t.result === "win")) {
        return res.status(400).json({ error: "There must be a winning team" });
      }

      // ✅ Replay is OPTIONAL now
      let replayDoc = null;

      if (req.file) {
        // Upload replay to S3
        const ext = path.extname(req.file.originalname || "");
        const base = path
          .basename(req.file.originalname, ext)
          .replace(/[^a-z0-9-_ ]/gi, "_")
          .slice(0, 80);

        const key = `replays/${Date.now()}_${base}_${crypto
          .randomBytes(12)
          .toString("hex")}${ext}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype || "application/octet-stream",
          })
        );

        replayDoc = {
          bucket: process.env.AWS_S3_BUCKET,
          key,
          originalName: req.file.originalname,
          size: req.file.size,
          contentType: req.file.mimetype,
        };
      }

      // Save matchup
      const matchup = await Matchup.create({
        playedAt: playedAt ? new Date(playedAt) : new Date(),
        mode,
        map: map.trim(),
        teams: parsedTeams,
        ...(replayDoc ? { replay: replayDoc } : {}), // ✅ only include if present
      });

      // Update cached player stats
      for (const team of parsedTeams) {
        for (const p of team.players) {
          const isWin = team.result === "win";

          const updated = await Player.findByIdAndUpdate(
            p.playerId,
            {
              $inc: {
                "stats.matches": 1,
                "stats.wins": isWin ? 1 : 0,
                "stats.losses": isWin ? 0 : 1,
              },
            },
            { new: true }
          );

          if (updated) {
            updated.stats.winRate = updated.stats.matches
              ? Math.round((updated.stats.wins / updated.stats.matches) * 1000) /
                10
              : 0;
            await updated.save();
          }
        }
      }

      return res.status(201).json(matchup);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });
});

// GET signed replay download URL (redirect)
router.get("/:id/replay", async (req, res) => {
  try {
    const matchup = await Matchup.findById(req.params.id);

    if (!matchup) {
      return res.status(404).json({ error: "Matchup not found" });
    }

    const replay = matchup.replay;

    if (!replay?.bucket || !replay?.key) {
      return res.status(404).json({ error: "Replay not found for this matchup" });
    }

    const filename =
      replay.originalName ||
      replay.key.split("/").pop() ||
      `matchup_${matchup._id}.BFME2Replay`;

    const url = await getReplayDownloadUrl({
      bucket: replay.bucket,
      key: replay.key,
      filename,
      expiresInSeconds: 60, // 1 minute signed URL
    });

    // Redirect so the browser downloads directly from S3
    return res.redirect(url);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
