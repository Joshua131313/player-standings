import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "@/components/MatchCard";
import { matches, matchStats, GameMode } from "@/data/matches";
import { Swords, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const modes: { value: GameMode | "all"; label: string }[] = [
  { value: "all", label: "All Modes" },
  { value: "1v1", label: "1v1" },
  { value: "2v2", label: "2v2" },
  { value: "3v3", label: "3v3" },
];

const Matches = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode | "all">("all");

  const filteredMatches =
    selectedMode === "all"
      ? matches
      : matches.filter((m) => m.mode === selectedMode);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
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
        </header>

        {/* Mode Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(Object.keys(matchStats) as GameMode[]).map((mode, index) => (
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
                      {matchStats[mode].total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Avg: {matchStats[mode].avgDuration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {mode === "1v1" ? "2" : mode === "2v2" ? "4" : "6"}{" "}
                        players
                      </span>
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
          {filteredMatches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No matches found for this mode.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
