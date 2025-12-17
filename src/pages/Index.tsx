import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/RankBadge";
import { WinRateBar } from "@/components/WinRateBar";
import { players } from "@/data/players";
import { matches, matchStats } from "@/data/matches";
import { armies } from "@/data/armies";
import { Users, Swords, Trophy, Shield, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Index = () => {
  const totalPlayers = players.length;
  const totalMatches = Object.values(matchStats).reduce(
    (sum, s) => sum + s.total,
    0
  );
  const topPlayer = players.reduce((top, p) =>
    p.winRate > top.winRate ? p : top
  );
  const topArmy = armies.reduce((top, a) => (a.winRate > top.winRate ? a : top));

  const topPlayers = [...players]
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);

  const recentMatches = matches.slice(0, 3);

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
            <span className="gradient-text text-glow">GAME</span>
            <span className="text-foreground"> DASHBOARD</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track player rankings, match history, and army performance in
            real-time
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <StatCard
            title="Total Players"
            value={totalPlayers}
            subtitle="Active competitors"
            icon={Users}
            delay={100}
          />
          <StatCard
            title="Matches Played"
            value={totalMatches.toLocaleString()}
            subtitle="All game modes"
            icon={Swords}
            delay={200}
          />
          <StatCard
            title="Top Player"
            value={topPlayer.name}
            subtitle={`${topPlayer.winRate}% win rate`}
            icon={Trophy}
            delay={300}
          />
          <StatCard
            title="Top Army"
            value={topArmy.name}
            subtitle={`${topArmy.winRate}% win rate`}
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
                {topPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors opacity-0 animate-slide-in-right"
                    )}
                    style={{ animationDelay: `${600 + index * 75}ms` }}
                  >
                    <RankBadge rank={index + 1} />
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-10 h-10 rounded-full border-2 border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.matchesPlayed} matches
                      </p>
                    </div>
                    <div className="w-24">
                      <WinRateBar winRate={player.winRate} />
                    </div>
                  </div>
                ))}
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
                {recentMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className={cn(
                      "p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors opacity-0 animate-slide-in-right"
                    )}
                    style={{ animationDelay: `${650 + index * 75}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-bold",
                          match.mode === "1v1"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : match.mode === "2v2"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-amber-500/20 text-amber-400"
                        )}
                      >
                        {match.mode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {match.map}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-success truncate max-w-[40%]">
                        {match.winner}
                      </span>
                      <span className="font-display font-bold text-sm">
                        <span className="text-success">{match.winnerScore}</span>
                        <span className="text-muted-foreground mx-1">-</span>
                        <span className="text-destructive">
                          {match.loserScore}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[40%]">
                        {match.loser}
                      </span>
                    </div>
                  </div>
                ))}
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
