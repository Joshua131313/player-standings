import { useMemo } from "react";
import { useMatchups } from "./useMatchups";
import { usePlayers } from "./usePlayers";

// these should match your useMatchups types
import type { PlayerRef } from "./useMatchups";

export type PlayerRankingRow = {
  playerId: string;
  name?: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number; // 0-100
};

const getPlayerId = (ref: PlayerRef) => (typeof ref === "string" ? ref : ref._id);
const getPlayerName = (ref: PlayerRef) => (typeof ref === "string" ? undefined : ref.name);

export const usePlayerRankings = () => {
  const { matchups, loading: loadingMatchups, error: errorMatchups, reload: reloadMatchups } = useMatchups();
  const { players, loading: loadingPlayers, error: errorPlayers, reload: reloadPlayers } = usePlayers();

  const rankings = useMemo<PlayerRankingRow[]>(() => {
    const map = new Map<string, PlayerRankingRow>();

    // ✅ 1) Seed ALL players first (0 matches allowed)
    for (const p of players) {
      map.set(p._id, {
        playerId: p._id,
        name: p.name,
        matches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
      });
    }

    // ✅ helper ensures matchups-only players also appear (if any)
    const ensure = (ref: PlayerRef) => {
      const id = getPlayerId(ref);
      if (!map.has(id)) {
        map.set(id, {
          playerId: id,
          name: getPlayerName(ref),
          matches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
        });
      } else {
        const cur = map.get(id)!;
        if (!cur.name) cur.name = getPlayerName(ref);
      }
      return map.get(id)!;
    };

    // ✅ 2) Apply matchup stats
    for (const m of matchups || []) {
      for (const team of m.teams || []) {
        const isWin = team.result === "win";

        for (const p of team.players || []) {
          const row = ensure(p.playerId);
          row.matches += 1;
          row.wins += isWin ? 1 : 0;
          row.losses += isWin ? 0 : 1;
        }
      }
    }

    // ✅ 3) Compute winRate
    for (const r of map.values()) {
      r.winRate = r.matches ? Math.round((r.wins / r.matches) * 1000) / 10 : 0;
    }

    // ✅ 4) Sort: wins desc, winRate desc, matches desc, name asc
    return [...map.values()].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      if (b.matches !== a.matches) return b.matches - a.matches;
      return (a.name || a.playerId).localeCompare(b.name || b.playerId);
    });
  }, [players, matchups]);

  // combine loading/error
  const loading = loadingPlayers || loadingMatchups;
  const error = errorPlayers || errorMatchups;

  const reload = async () => {
    await Promise.all([reloadPlayers(), reloadMatchups()]);
  };

  return { rankings, loading, error, reload };
};
