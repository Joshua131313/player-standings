import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema(
  {
    // ✅ exact-match uniqueness (case-sensitive)
    name: { type: String, required: true, trim: true, unique: true, index: true },

    // optional: keep for search/filtering, NOT unique
    nameLower: { type: String, trim: true, index: true },

    stats: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// keep nameLower in sync (no next)
PlayerSchema.pre("validate", function () {
  if (this.name) this.nameLower = this.name.trim().toLowerCase();
});

export default mongoose.model("Player", PlayerSchema);
