import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RankBadge } from "./RankBadge";
import { WinRateBar } from "./WinRateBar";
import { SearchInput } from "./SearchInput";
import { ChevronUp, ChevronDown, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface LeaderboardTableProps {
  players: Player[];
}

type SortKey = "rank" | "name" | "matchesPlayed" | "wins" | "winRate";
type SortDirection = "asc" | "desc";

export const LeaderboardTable = ({ players }: LeaderboardTableProps) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("winRate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedPlayers = [...players]
    .filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "name") {
        return a.name.localeCompare(b.name) * modifier;
      }
      return (a[sortKey] - b[sortKey]) * modifier;
    })
    .map((player, index) => ({ ...player, rank: index + 1 }));

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
    <Card variant="glass" className="overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold">Player Rankings</h2>
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            className="w-full sm:w-72"
          />
        </div>
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
                <HeaderButton columnKey="matchesPlayed">Matches</HeaderButton>
              </th>
              <th className="px-6 py-4 text-left">
                <HeaderButton columnKey="wins">W / L</HeaderButton>
              </th>
              <th className="px-6 py-4 text-left min-w-[200px]">
                <HeaderButton columnKey="winRate">Win Rate</HeaderButton>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                  Streak
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id}
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
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-10 h-10 rounded-full border-2 border-border object-cover"
                    />
                    <span className="font-semibold text-foreground">
                      {player.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-display font-bold text-lg text-foreground">
                    {player.matchesPlayed}
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
                  <span
                    className={cn(
                      "font-display font-bold",
                      player.streak > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {player.streak > 0 ? `+${player.streak}` : player.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedPlayers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No players found matching "{search}"
          </div>
        )}
      </div>
    </Card>
  );
};
