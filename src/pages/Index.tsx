import { StatCard } from "@/components/StatCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { players } from "@/data/players";
import { Users, Swords, Trophy, Zap } from "lucide-react";

const Index = () => {
  const totalPlayers = players.length;
  const totalMatches = players.reduce((sum, p) => sum + p.matchesPlayed, 0);
  const topPlayer = players.reduce((top, p) => (p.winRate > top.winRate ? p : top));
  const averageWinRate = (players.reduce((sum, p) => sum + p.winRate, 0) / players.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(180_100%_50%/0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(280_100%_65%/0.08),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12 opacity-0 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Rankings</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black mb-4">
            <span className="gradient-text text-glow">GAME</span>
            <span className="text-foreground"> LEADERBOARD</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track player performance, matches played, and compete for the top ranks
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
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
            subtitle="Total games"
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
            title="Avg. Win Rate"
            value={`${averageWinRate}%`}
            subtitle="Across all players"
            icon={Zap}
            delay={400}
          />
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable players={players} />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: "800ms" }}>
          <p>Rankings update in real-time • Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
