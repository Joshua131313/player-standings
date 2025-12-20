import mongoose from "mongoose";

const { Schema } = mongoose;

const TeamPlayerSchema = new Schema(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    army: { type: String, required: true },
  },
  { _id: false }
);

const TeamSchema = new Schema(
  {
    teamIndex: { type: Number, required: true },
    result: { type: String, enum: ["win", "loss"], required: true },
    players: { type: [TeamPlayerSchema], required: true },
  },
  { _id: false }
);

const ReplaySchema = new Schema(
  {
    bucket: String,
    key: String,
    originalName: String,
    size: Number,
    contentType: String,
  },
  { _id: false }
);

const MatchupSchema = new Schema(
  {
    playedAt: { type: Date, default: Date.now },
    mode: { type: String, enum: ["1v1", "2v2", "3v3"], required: true },
    map: { type: String, required: true, trim: true },

    // ✅ NEW STRUCTURE
    teams: { type: [TeamSchema], required: true },

    replay: { type: ReplaySchema, required: false, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Matchup", MatchupSchema);
