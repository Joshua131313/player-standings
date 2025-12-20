import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { RankBadge } from "./RankBadge";
import { WinRateBar } from "./WinRateBar";
import { SearchInput } from "./SearchInput";
import { ChevronUp, ChevronDown, Gamepad2, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerRankings } from "@/hooks/usePlayerRankings";

// ✅ This is the shape returned by your usePlayerRankings hook
export type PlayerRankingRow = {
  playerId: string;
  name?: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
};
export interface Player {
  id: string;
  name: string;
  avatar: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
}
type SortKey = "rank" | "name" | "matches" | "wins" | "winRate";
type SortDirection = "asc" | "desc";

const FALLBACK_NAME = "Unknown";

export const LeaderboardTable = () => {
  const { rankings, loading, error, reload } = usePlayerRankings();

  // use rankings as players
  const players: PlayerRankingRow[] = rankings;

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("winRate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "name" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;

    return players.filter((p) =>
      (p.name || FALLBACK_NAME).toLowerCase().includes(q)
    );
  }, [players, search]);

  const sortedPlayers = useMemo(() => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    const defaultSort = (a: PlayerRankingRow, b: PlayerRankingRow) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      if (b.matches !== a.matches) return b.matches - a.matches;
      return (a.name || FALLBACK_NAME).localeCompare(b.name || FALLBACK_NAME);
    };

    const list = [...filtered];

    list.sort((a, b) => {
      if (sortKey === "rank") return defaultSort(a, b) * modifier;

      if (sortKey === "name") {
        return (a.name || FALLBACK_NAME).localeCompare(b.name || FALLBACK_NAME) * modifier;
      }

      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;

      if (bVal !== aVal) return (aVal - bVal) * modifier;

      return defaultSort(a, b);
    });

    return list.map((p, i) => ({
      ...p,
      rank: i + 1,
      displayName: p.name || FALLBACK_NAME,
    }));
  }, [filtered, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const HeaderButton = ({
    columnKey,
    children,
    className,
  }: {
    columnKey: SortKey;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={() => handleSort(columnKey)}
      className={cn(
        "flex items-center gap-1 hover:text-primary transition-colors uppercase tracking-wider text-xs font-semibold",
        sortKey === columnKey ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {children}
      <SortIcon columnKey={columnKey} />
    </button>
  );

  return (
    <Card
      variant="glass"
      className="overflow-hidden opacity-0 animate-fade-in"
      style={{ animationDelay: "400ms" }}
    >
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Player Rankings</h2>
              <p className="text-sm text-muted-foreground">
                Sorted from matchups recorded in the database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SearchInput value={search} onChange={setSearch} className="w-full sm:w-72" />
            <button
              onClick={reload}
              className={cn(
                "h-10 px-3 rounded-lg border border-border/60 bg-background/30 hover:bg-background/40 transition",
                loading && "opacity-60 cursor-not-allowed"
              )}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Status */}
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-4 text-left">
                <HeaderButton columnKey="rank">Rank</HeaderButton>
              </th>

              <th className="px-6 py-4 text-left">
                <HeaderButton columnKey="name">Player</HeaderButton>
              </th>

              <th className="px-6 py-4 text-left">
                <HeaderButton columnKey="matches">Matches</HeaderButton>
              </th>

              <th className="px-6 py-4 text-left">
                <HeaderButton columnKey="wins">W / L</HeaderButton>
              </th>

              <th className="px-6 py-4 text-left min-w-[200px]">
                <HeaderButton columnKey="winRate">Win Rate</HeaderButton>
              </th>

              <th className="px-6 py-4 text-left">
                <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                  Notes
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && sortedPlayers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                  Loading rankings...
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player, index) => (
                <tr
                  key={player.playerId}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-secondary/20",
                    "opacity-0 animate-slide-in-right"
                  )}
                  style={{ animationDelay: `${500 + index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <RankBadge rank={player.rank} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-border bg-secondary/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <span className="font-semibold text-foreground">
                        {player.displayName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-display font-bold text-lg text-foreground">
                      {player.matches}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-success font-semibold">{player.wins}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive font-semibold">{player.losses}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <WinRateBar winRate={player.winRate} />
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs text-muted-foreground">
                      {player.wins >= 10 ? "Veteran" : "Rising"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && sortedPlayers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No players found matching "{search}"
          </div>
        )}
      </div>
    </Card>
  );
};
