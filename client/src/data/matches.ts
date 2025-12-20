export type GameMode = "1v1" | "2v2" | "3v3";

export interface Match {
  id: string;
  mode: GameMode;
  date: string;
  duration: string;
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  map: string;
}

export const matchStats = {
  "1v1": { total: 1248, avgDuration: "24:15" },
  "2v2": { total: 856, avgDuration: "32:40" },
  "3v3": { total: 542, avgDuration: "41:22" },
};
