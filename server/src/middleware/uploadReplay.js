import multer from "multer";
import path from "path";

const MAX_REPLAY_BYTES = 1 * 1024 * 1024; // 1MB

export const uploadReplay = multer({
  storage: multer.memoryStorage(), // file stays in RAM, then we push to S3
  limits: { fileSize: MAX_REPLAY_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    if (ext.toLowerCase() !== ".bfme2replay") {
      return cb(new Error("Replay must have .BfME2Replay extension."));
    }
    cb(null, true);
  },
}).single("replay"); // <-- IMPORTANT: field name must be "replay"
