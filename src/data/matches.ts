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

export const matches: Match[] = [
  {
    id: "m1",
    mode: "1v1",
    date: "2024-01-15T14:30:00",
    duration: "28:45",
    winner: "ShadowStrike",
    loser: "DarkNova",
    winnerScore: 3,
    loserScore: 1,
    map: "Crimson Arena",
  },
  {
    id: "m2",
    mode: "1v1",
    date: "2024-01-15T12:15:00",
    duration: "22:30",
    winner: "NeonPhantom",
    loser: "TitanX",
    winnerScore: 3,
    loserScore: 2,
    map: "Neon District",
  },
  {
    id: "m3",
    mode: "2v2",
    date: "2024-01-15T10:00:00",
    duration: "35:12",
    winner: "CyberWolf & VoidRunner",
    loser: "BlazeFury & IronClad",
    winnerScore: 5,
    loserScore: 3,
    map: "Frost Peak",
  },
  {
    id: "m4",
    mode: "3v3",
    date: "2024-01-14T20:45:00",
    duration: "42:18",
    winner: "ShadowStrike, NeonPhantom & QuantumAce",
    loser: "StormBreaker, DarkNova & TitanX",
    winnerScore: 7,
    loserScore: 5,
    map: "Volcanic Rift",
  },
  {
    id: "m5",
    mode: "1v1",
    date: "2024-01-14T18:30:00",
    duration: "19:55",
    winner: "QuantumAce",
    loser: "StormBreaker",
    winnerScore: 3,
    loserScore: 0,
    map: "Shadow Keep",
  },
  {
    id: "m6",
    mode: "2v2",
    date: "2024-01-14T16:00:00",
    duration: "31:40",
    winner: "ShadowStrike & NeonPhantom",
    loser: "CyberWolf & BlazeFury",
    winnerScore: 5,
    loserScore: 4,
    map: "Crystal Caverns",
  },
  {
    id: "m7",
    mode: "3v3",
    date: "2024-01-14T14:00:00",
    duration: "38:22",
    winner: "VoidRunner, IronClad & TitanX",
    loser: "QuantumAce, BlazeFury & DarkNova",
    winnerScore: 7,
    loserScore: 6,
    map: "Desert Storm",
  },
  {
    id: "m8",
    mode: "1v1",
    date: "2024-01-14T11:30:00",
    duration: "25:10",
    winner: "CyberWolf",
    loser: "IronClad",
    winnerScore: 3,
    loserScore: 2,
    map: "Neon District",
  },
  {
    id: "m9",
    mode: "2v2",
    date: "2024-01-13T19:00:00",
    duration: "29:55",
    winner: "QuantumAce & StormBreaker",
    loser: "TitanX & DarkNova",
    winnerScore: 5,
    loserScore: 2,
    map: "Crimson Arena",
  },
  {
    id: "m10",
    mode: "1v1",
    date: "2024-01-13T15:45:00",
    duration: "21:30",
    winner: "BlazeFury",
    loser: "VoidRunner",
    winnerScore: 3,
    loserScore: 1,
    map: "Shadow Keep",
  },
];

export const matchStats = {
  "1v1": { total: 1248, avgDuration: "24:15" },
  "2v2": { total: 856, avgDuration: "32:40" },
  "3v3": { total: 542, avgDuration: "41:22" },
};
