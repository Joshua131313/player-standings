import { Armies } from "@/data/armies";

export type NormalizedTeamPlayer = {
  name: string;        // resolved player name
  army: Armies;        // army id
  armyName: string;    // human-readable army label
};

export type NormalizedTeam = {
  teamIndex: number;
  result: "win" | "loss";
  names: string[];                 // convenience list of player names
  roster: NormalizedTeamPlayer[];  // detailed per-player info
};
