import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "@/components/MatchCard";
import { Swords, Users, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMatchups } from "@/hooks/useMatchups";

type GameMode = "1v1" | "2v2" | "3v3";

const modes: { value: GameMode | "all"; label: string }[] = [
  { value: "all", label: "All Modes" },
  { value: "1v1", label: "1v1" },
  { value: "2v2", label: "2v2" },
  { value: "3v3", label: "3v3" },
];

const MODE_LIST: GameMode[] = ["1v1", "2v2", "3v3"];

const playersForMode = (mode: GameMode) => (mode === "1v1" ? 2 : mode === "2v2" ? 4 : 6);

// If your backend stores duration as a string ("12:34") OR number of seconds,
// this helper converts it to seconds safely.
const durationToSeconds = (duration: any): number => {
  if (duration == null) return 0;

  // numeric seconds
  if (typeof duration === "number" && Number.isFinite(duration)) return duration;

  // "mm:ss" or "hh:mm:ss"
  if (typeof duration === "string") {
    const s = duration.trim();
    if (!s) return 0;
    const parts = s.split(":").map((p) => Number(p));
    if (parts.some((n) => Number.isNaN(n))) return 0;

    if (parts.length === 2) {
      const [mm, ss] = parts;
      return mm * 60 + ss;
    }
    if (parts.length === 3) {
      const [hh, mm, ss] = parts;
      return hh * 3600 + mm * 60 + ss;
    }
  }

  return 0;
};

const secondsToPretty = (secs: number) => {
  if (!secs || secs <= 0) return "—";
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const Matches = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode | "all">("all");
  const { byMostRecent, loading, error } = useMatchups();

  const filteredMatches = useMemo(() => {
    return selectedMode === "all"
      ? byMostRecent
      : byMostRecent.filter((m) => m.mode === selectedMode);
  }, [byMostRecent, selectedMode]);

  // Build real stats per mode from backend matchups
  const modeStats = useMemo(() => {
    const stats: Record<GameMode, { total: number; avgSeconds: number }> = {
      "1v1": { total: 0, avgSeconds: 0 },
      "2v2": { total: 0, avgSeconds: 0 },
      "3v3": { total: 0, avgSeconds: 0 },
    };

    const sums: Record<GameMode, { count: number; secondsSum: number }> = {
      "1v1": { count: 0, secondsSum: 0 },
      "2v2": { count: 0, secondsSum: 0 },
      "3v3": { count: 0, secondsSum: 0 },
    };

    for (const m of byMostRecent) {
      const mode = m.mode as GameMode;
      if (!MODE_LIST.includes(mode)) continue;

      stats[mode].total += 1;

      const secs = durationToSeconds((m as any).duration);
      if (secs > 0) {
        sums[mode].count += 1;
        sums[mode].secondsSum += secs;
      }
    }

    for (const mode of MODE_LIST) {
      stats[mode].avgSeconds =
        sums[mode].count > 0 ? sums[mode].secondsSum / sums[mode].count : 0;
    }

    return stats;
  }, [byMostRecent]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in flex justify-between items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Swords className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black">
                <span className="gradient-text">MATCH</span>
                <span className="text-foreground"> HISTORY</span>
              </h1>
              <p className="text-muted-foreground">
                Browse all competitive matches by game mode
              </p>
            </div>
          </div>

          <Button asChild>
            <Link to="/add-matchup">Add Matchup</Link>
          </Button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Stats (real) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {MODE_LIST.map((mode, index) => (
            <Card
              key={mode}
              variant="stat"
              className={cn(
                "cursor-pointer opacity-0 animate-fade-in",
                selectedMode === mode && "border-primary/50 glow-primary"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedMode(mode)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {mode} Matches
                    </p>
                    <p className="text-3xl font-display font-bold gradient-text">
                      {loading ? "…" : modeStats[mode].total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        Avg: {loading ? "…" : secondsToPretty(modeStats[mode].avgSeconds)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-muted-foreground text-sm mt-1">
                      <Users className="w-4 h-4" />
                      <span>{playersForMode(mode)} players</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mode Filter */}
        <div
          className="flex items-center gap-2 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setSelectedMode(mode.value)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                selectedMode === mode.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Match List */}
        <div className="space-y-3">
          {loading && filteredMatches.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading matches...
            </div>
          ) : (
            filteredMatches.map((match, index) => (
              <MatchCard key={match._id} match={match} index={index} />
            ))
          )}
        </div>

        {!loading && filteredMatches.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No matches found for this mode.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
