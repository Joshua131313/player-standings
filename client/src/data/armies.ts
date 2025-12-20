export interface Army {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalPicks: number;
  wins: number;
  losses: number;
  winRate: number;
  avgScore: number;
  popularity: number;
  strongAgainst: string[];
  weakAgainst: string[];
  type: "Good" | "Evil";
}
export type Armies = "men" | "elves" | "dwarves" | "goblins" | "mordor" | "isengard";
export const armies: Army[] = [
  {
    id: "dwarves",
    name: "Dwarves",
    icon: "../icons/dwarves-icon.png",
    color: "from-amber-300 to-yellow-800",
    totalPicks: 2456,
    wins: 1523,
    losses: 933,
    winRate: 62.0,
    avgScore: 4.2,
    popularity: 18.5,
    strongAgainst: ["Mordor"],
    weakAgainst: ["Goblins", "Elves", "Isengard", "Men"],
    type: "Good"
  },
  {
    id: "men",
    name: "Men",
    icon: "../icons/men-icon.png",
    color: "from-sky-400 to-blue-900",
    totalPicks: 2234,
    wins: 1428,
    losses: 806,
    winRate: 63.9,
    avgScore: 4.5,
    popularity: 16.8,
    strongAgainst: ["Elves", "Dwarves", "Men", "Isengard"],
    weakAgainst: ["Frost Guardians", "Ocean Depths"],
    type: "Good"
  },
  {
    id: "elves",
    name: "Elves",
    icon: "../icons/elves-icon.png",
    color: "from-emerald-400 to-green-900",
    totalPicks: 1987,
    wins: 1171,
    losses: 816,
    winRate: 58.9,
    avgScore: 3.9,
    popularity: 14.9,
    strongAgainst: ["Phoenix Order", "Storm Knights"],
    weakAgainst: ["Shadow Legion", "Earth Titans"],
    type: "Good"
  },
  {
    id: "isengard",
    name: "Isengard",
    icon: "../icons/isengard-icon.png",
    color: "from-slate-300 to-slate-900",
    totalPicks: 1876,
    wins: 1126,
    losses: 750,
    winRate: 60.0,
    avgScore: 4.1,
    popularity: 14.1,
    strongAgainst: ["Shadow Legion", "Ocean Depths"],
    weakAgainst: ["Frost Guardians", "Void Walkers"],
    type: "Evil"
  },
  {
    id: "mordor",
    name: "Mordor",
    icon: "../icons/mordor-icon.png",
    color: "from-red-500 to-red-950",
    totalPicks: 1654,
    wins: 926,
    losses: 728,
    winRate: 56.0,
    avgScore: 3.7,
    popularity: 12.4,
    strongAgainst: ["Frost Guardians", "Desert Raiders"],
    weakAgainst: ["Phoenix Order", "Void Walkers"],
    type: "Evil"
  },
  {
    id: "goblins",
    name: "Goblins",
    icon: "../icons/goblins-icon.png",
    color: "from-orange-400 to-red-800",
    totalPicks: 1432,
    wins: 816,
    losses: 616,
    winRate: 57.0,
    avgScore: 3.8,
    popularity: 10.8,
    strongAgainst: ["Storm Knights", "Earth Titans"],
    weakAgainst: ["Phoenix Order", "Desert Raiders"],
    type: "Evil"
  }
];
