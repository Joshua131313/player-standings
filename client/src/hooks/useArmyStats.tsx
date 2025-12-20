import { useMemo } from "react";
import { useMatchups } from "./useMatchups";

export type ArmyStatRow = {
  army: string;        // normalized id (lowercase)
  picks: number;       // per-player appearances
  matches: number;     // per-matchup (army appears anywhere in matchup => +1)
  wins: number;        // per-matchup (army appears on any winning team => +1)
  losses: number;      // per-matchup (army appears on any losing team => +1)
  winRate: number;     // wins / matches (0-100)
  popularity: number;  // picks / total picks (0-100)
};

// ✅ safely extract army id from player objects (supports different field names)
const getArmyId = (p: any): string => {
  const raw =
    p?.army ??
    p?.faction ??
    p?.armyId ??
    p?.factionId ??
    ""; // add more keys here if you use others

  const s = String(raw).trim();
  if (!s) return "";

  // normalize: "Dwarves" -> "dwarves"
  return s.toLowerCase();
};

export const useArmyStats = () => {
  const { matchups, loading, error, reload } = useMatchups();

  const armyStats = useMemo<ArmyStatRow[]>(() => {
    const map = new Map<string, ArmyStatRow>();

    const ensure = (army: string) => {
      if (!map.has(army)) {
        map.set(army, {
          army,
          picks: 0,
          matches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          popularity: 0,
        });
      }
      return map.get(army)!;
    };

    let totalPicksAllArmies = 0;

    for (const m of matchups || []) {
      const armiesInMatch = new Set<string>();
      const armiesInWinningTeams = new Set<string>();
      const armiesInLosingTeams = new Set<string>();

      for (const team of m.teams || []) {
        const isWin = team.result === "win";

        for (const p of team.players || []) {
          const army = getArmyId(p);
          if (!army) continue;

          // ✅ picks counts every appearance
          ensure(army).picks += 1;
          totalPicksAllArmies += 1;

          // ✅ presence sets for per-matchup counting
          armiesInMatch.add(army);
          if (isWin) armiesInWinningTeams.add(army);
          else armiesInLosingTeams.add(army);
        }
      }

      // ✅ matches counted ONCE per matchup
      for (const army of armiesInMatch) {
        ensure(army).matches += 1;
      }

      // ✅ wins/losses max 1 per matchup each
      for (const army of armiesInWinningTeams) {
        ensure(army).wins += 1;
      }
      for (const army of armiesInLosingTeams) {
        ensure(army).losses += 1;
      }
    }

    // finalize rates
    for (const r of map.values()) {
      const denom = r.wins + r.losses;
      r.winRate = denom ? Math.round((r.wins / denom) * 1000) / 10 : 0;
      r.popularity = totalPicksAllArmies
        ? Math.round((r.picks / totalPicksAllArmies) * 1000) / 10
        : 0;
    }

    return [...map.values()].sort((a, b) => {
      if (b.picks !== a.picks) return b.picks - a.picks;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return a.army.localeCompare(b.army);
    });
  }, [matchups]);

  return { armyStats, matchups, loading, error, reload };
};
