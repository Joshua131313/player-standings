import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/RankBadge";
import { WinRateBar } from "@/components/WinRateBar";
import { Users, Swords, Trophy, Shield, ChevronRight, Zap, User, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { useMatchups } from "@/hooks/useMatchups";
import { usePlayerRankings } from "@/hooks/usePlayerRankings";
import { useArmyStats } from "@/hooks/useArmyStats";
import { MatchCard } from "@/components/MatchCard";
import { armies as ARMIES_CONFIG } from "@/data/armies";

const MIN_MATCHES_FOR_TOP_ARMY = 1; // change to 3/5 if you want to avoid "1 game = 100%"

const Index = () => {
  const {
    byMostRecent = [],
    loading: matchupsLoading,
    error: matchupsError,
  } = useMatchups();

  const {
    rankings = [],
    loading: rankingsLoading,
    error: rankingsError,
  } = usePlayerRankings();

  const {
    armyStats = [],
    loading: armiesLoading,
    error: armiesError,
  } = useArmyStats();

  const loading = matchupsLoading || rankingsLoading || armiesLoading;
  const error = matchupsError || rankingsError || armiesError;

  // Totals (from backend)
  const totalPlayers = rankings.length;
  const totalMatches = byMostRecent.length;

  // Top players (backend)
  const topPlayers = [...rankings]
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.matches - a.matches;
    })
    .slice(0, 5);

  const topPlayer = topPlayers[0];

  // Top army (backend stats joined with config for display name)
  const armyNameById = new Map(ARMIES_CONFIG.map((a) => [String(a.id), a.name]));
  const eligibleArmies = armyStats.filter((a) => (a.matches ?? 0) >= MIN_MATCHES_FOR_TOP_ARMY);

  const topArmy =
    eligibleArmies.length > 0
      ? eligibleArmies.reduce((best, a) => (a.winRate > best.winRate ? a : best), eligibleArmies[0])
      : null;

  const topArmyName = topArmy ? (armyNameById.get(String(topArmy.army)) || String(topArmy.army)) : "—";

  // Recent matches
  const recentMatches = byMostRecent.slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 opacity-0 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Live Statistics
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black mb-4">
            <span className="gradient-text">GAME</span>
            <span className="text-foreground"> DASHBOARD</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track player rankings, match history, and army performance in real-time
          </p>

          {error && (
            <div className="mt-6 max-w-2xl mx-auto rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-10">
          <StatCard
            title="Total Players"
            value={loading ? "…" : totalPlayers}
            subtitle="Active competitors"
            icon={Users}
            delay={100}
          />

          <StatCard
            title="Matches Played"
            value={loading ? "…" : totalMatches.toLocaleString()}
            subtitle="All game modes"
            icon={Swords}
            delay={200}
          />

          <StatCard
            title="Top Player"
            value={topPlayer?.name || "—"}
            subtitle={
              topPlayer ? `${topPlayer.winRate}% win rate` : (loading ? "Loading..." : "No games yet")
            }
            icon={Trophy}
            delay={300}
          />

          <StatCard
            title="Top Army"
            value={topArmyName}
            subtitle={
              topArmy
                ? `${topArmy.winRate}% win rate`
                : (loading ? "Loading..." : "No games yet")
            }
            icon={Shield}
            delay={400}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Players */}
          <Card
            variant="glass"
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-bold">
                    Top Players
                  </h2>
                </div>

                <Link
                  to="/rankings"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {rankingsLoading && topPlayers.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading top players...
                  </div>
                ) : topPlayers.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    No players yet. Add matchups to generate rankings.
                  </div>
                ) : (
                  topPlayers.map((player, index) => (
                    <div
                      key={player.playerId}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors opacity-0 animate-slide-in-right"
                      )}
                      style={{ animationDelay: `${600 + index * 75}ms` }}
                    >
                      <RankBadge rank={index + 1} />

                      {/* avatar placeholder */}
                      <div className="w-10 h-10 rounded-full border-2 border-border bg-secondary/40 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{player.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.matches} matches •{" "}
                          <span className="text-success font-medium">{player.wins}W</span>
                          <span className="text-muted-foreground"> / </span>
                          <span className="text-destructive font-medium">{player.losses}L</span>
                        </p>
                      </div>

                      <div className="w-24">
                        <WinRateBar winRate={player.winRate} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Matches */}
          <Card
            variant="glass"
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: "550ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Swords className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-bold">
                    Recent Matches
                  </h2>
                </div>

                <Link
                  to="/matches"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {matchupsLoading && recentMatches.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading recent matches...
                  </div>
                ) : recentMatches.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    No matchups yet. Upload a replay to get started.
                  </div>
                ) : (
                  recentMatches.map((match, index) => (
                    <MatchCard key={match._id  || index} index={index} match={match} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer
          className="mt-12 text-center text-sm text-muted-foreground opacity-0 animate-fade-in"
          style={{ animationDelay: "900ms" }}
        >
          <p>
            Rankings update in real-time • Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
