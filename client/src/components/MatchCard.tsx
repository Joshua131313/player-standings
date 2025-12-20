import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Matchup, Team } from "@/hooks/useMatchups";
import { Clock, MapPin, Swords, Trophy, Users, Download } from "lucide-react";
import { useMemo } from "react";

import { armies } from "@/data/armies";
import { MatchTeam } from "./ui/MatchTeam";
import { NormalizedTeam } from "@/types/team-types";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  match: Matchup;
  index: number;
}

export const MatchCard = ({ match, index }: MatchCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModeColor = () => {
    switch (match.mode) {
      case "1v1":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/25";
      case "2v2":
        return "bg-purple-500/15 text-purple-300 border-purple-500/25";
      case "3v3":
        return "bg-amber-500/15 text-amber-300 border-amber-500/25";
      default:
        return "bg-muted/20 text-muted-foreground border-border/40";
    }
  };

  const armyLabel = useMemo(() => {
    const map = new Map<string, string>();
    (armies || []).forEach((a: any) => {
      const id = String(a.id ?? a.value ?? a.key ?? a.name ?? "").trim();
      if (!id) return;
      map.set(id, String(a.label ?? a.name ?? id));
    });
    return (id: string) => map.get(String(id)) || String(id);
  }, []);

  const normalizeTeam = (team: Team): NormalizedTeam => {
    const roster = (team.players || []).map((p) => ({
      name: typeof p.playerId === "string" ? "Unknown" : p.playerId?.name || "Unknown",
      army: p.army,
      armyName: armyLabel(String(p.army || "")),
    }));

    return {
      teamIndex: team.teamIndex,
      result: team.result,
      names: roster.map((r) => r.name),
      roster,
    };
  };

  const teams = (match.teams || []).map(normalizeTeam);
  const winningTeams = teams.filter((t) => t.result === "win");
  const losingTeams = teams.filter((t) => t.result === "loss");
  const totalPlayers = teams.reduce((acc, t) => acc + t.roster.length, 0);

  const hasReplay = Boolean(match.replay?.key);
  const replayUrl = hasReplay ? `/api/matchups/${match._id}/replay` : "";

  const handleDownload = () => {
    if (!hasReplay) return;
    window.open(replayUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "p-4 md:p-5 hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getModeColor())}>
            {match.mode}
          </span>

          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatDate(match.playedAt)}
          </span>

          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            {totalPlayers} players
          </span>

          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[220px]">{match.map}</span>
          </span>
        </div>

        {/* Replay + Download */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground rounded-full border border-border/50 bg-background/30 px-2.5 py-1">
            Replay: {hasReplay ? "Uploaded" : "—"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-border/40" />

      {/* Teams grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Winners */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-semibold text-foreground">
                Winning Team{winningTeams.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="text-xs text-emerald-300/90 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {winningTeams.reduce((a, t) => a + t.roster.length, 0)} players
            </span>
          </div>

          {winningTeams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No winner recorded.</p>
          ) : (
            <div className="space-y-3">
              {winningTeams.map((t) => (
                <MatchTeam key={t.teamIndex} t={t} win />
              ))}
            </div>
          )}
        </div>

        {/* Losers */}
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-foreground">
                Losing Team{losingTeams.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="text-xs text-destructive/90 border border-destructive/20 bg-destructive/10 px-2 py-0.5 rounded-full">
              {losingTeams.reduce((a, t) => a + t.roster.length, 0)} players
            </span>
          </div>

          {losingTeams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No loser recorded.</p>
          ) : (
            <div className="space-y-3">
              {losingTeams.map((t) => (
                <MatchTeam key={t.teamIndex} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta row */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">
          Match ID: <span className="text-foreground/80">{match._id}</span>
        </span>
        {match.replay?.originalName && (
          <div className="download-replay flex items-center gap-2">
            <span className="truncate">
              Replay: <span className="text-foreground/80">{match.replay.originalName}</span>
            </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={!hasReplay}
                className={cn(
                  "h-9",
                  hasReplay
                    ? "border border-primary/20 bg-primary/10 hover:bg-primary/15 text-primary"
                    : "opacity-60 cursor-not-allowed"
                )}
              >
             <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

        )}
      </div>
    </Card>
  );
};
