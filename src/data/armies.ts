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
}

export const armies: Army[] = [
  {
    id: "a1",
    name: "Shadow Legion",
    icon: "🌑",
    color: "from-slate-600 to-slate-800",
    totalPicks: 2456,
    wins: 1523,
    losses: 933,
    winRate: 62.0,
    avgScore: 4.2,
    popularity: 18.5,
    strongAgainst: ["Frost Guardians", "Desert Raiders"],
    weakAgainst: ["Phoenix Order", "Storm Knights"],
  },
  {
    id: "a2",
    name: "Phoenix Order",
    icon: "🔥",
    color: "from-orange-500 to-red-600",
    totalPicks: 2234,
    wins: 1428,
    losses: 806,
    winRate: 63.9,
    avgScore: 4.5,
    popularity: 16.8,
    strongAgainst: ["Shadow Legion", "Void Walkers"],
    weakAgainst: ["Frost Guardians", "Ocean Depths"],
  },
  {
    id: "a3",
    name: "Frost Guardians",
    icon: "❄️",
    color: "from-cyan-400 to-blue-600",
    totalPicks: 1987,
    wins: 1171,
    losses: 816,
    winRate: 58.9,
    avgScore: 3.9,
    popularity: 14.9,
    strongAgainst: ["Phoenix Order", "Storm Knights"],
    weakAgainst: ["Shadow Legion", "Earth Titans"],
  },
  {
    id: "a4",
    name: "Storm Knights",
    icon: "⚡",
    color: "from-yellow-400 to-amber-600",
    totalPicks: 1876,
    wins: 1126,
    losses: 750,
    winRate: 60.0,
    avgScore: 4.1,
    popularity: 14.1,
    strongAgainst: ["Shadow Legion", "Ocean Depths"],
    weakAgainst: ["Frost Guardians", "Void Walkers"],
  },
  {
    id: "a5",
    name: "Earth Titans",
    icon: "🏔️",
    color: "from-emerald-600 to-green-800",
    totalPicks: 1654,
    wins: 926,
    losses: 728,
    winRate: 56.0,
    avgScore: 3.7,
    popularity: 12.4,
    strongAgainst: ["Frost Guardians", "Desert Raiders"],
    weakAgainst: ["Phoenix Order", "Void Walkers"],
  },
  {
    id: "a6",
    name: "Void Walkers",
    icon: "🌀",
    color: "from-purple-600 to-violet-800",
    totalPicks: 1432,
    wins: 816,
    losses: 616,
    winRate: 57.0,
    avgScore: 3.8,
    popularity: 10.8,
    strongAgainst: ["Storm Knights", "Earth Titans"],
    weakAgainst: ["Phoenix Order", "Desert Raiders"],
  },
  {
    id: "a7",
    name: "Ocean Depths",
    icon: "🌊",
    color: "from-blue-500 to-indigo-700",
    totalPicks: 1234,
    wins: 679,
    losses: 555,
    winRate: 55.0,
    avgScore: 3.6,
    popularity: 9.3,
    strongAgainst: ["Phoenix Order", "Earth Titans"],
    weakAgainst: ["Storm Knights", "Shadow Legion"],
  },
  {
    id: "a8",
    name: "Desert Raiders",
    icon: "🏜️",
    color: "from-amber-500 to-orange-700",
    totalPicks: 987,
    wins: 484,
    losses: 503,
    winRate: 49.0,
    avgScore: 3.3,
    popularity: 7.4,
    strongAgainst: ["Void Walkers", "Ocean Depths"],
    weakAgainst: ["Shadow Legion", "Earth Titans"],
  },
];
