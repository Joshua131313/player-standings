import { Layout } from "@/components/Layout";
import { ArmyCard } from "@/components/ArmyCard";
import { StatCard } from "@/components/StatCard";
import { armies as ARMIES_CONFIG } from "@/data/armies";
import { Shield, Target, TrendingUp, Users, RefreshCw } from "lucide-react";
import { useArmyStats } from "@/hooks/useArmyStats";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type ArmyCardData = (typeof ARMIES_CONFIG)[number] & {
  totalPicks: number; // ✅ appearances (picks)
  wins: number;       // ✅ per-matchup, max 1 per matchup
  losses: number;     // ✅ per-matchup, max 1 per matchup
  winRate: number;    // ✅ wins/matches
  popularity: number; // ✅ picks / total picks
};

const Armies = () => {
  const { armyStats, loading, error, reload } = useArmyStats();

  // ✅ lookup by normalized army id
  const statsByArmyId = useMemo(() => {
    const m = new Map<string, (typeof armyStats)[number]>();
    for (const s of armyStats) {
      m.set(String(s.army).toLowerCase(), s);
    }
    return m;
  }, [armyStats]);

  const armies: ArmyCardData[] = ARMIES_CONFIG.map((a) => {
    const id = String(a.id).toLowerCase();
    const s = statsByArmyId.get(id);

    const totalPicks = s?.picks ?? 0; // ✅ FIX: picks not matches
    const wins = s?.wins ?? 0;
    const losses = s?.losses ?? 0;
    const winRate = s?.winRate ?? 0;

    return {
      ...a,
      totalPicks,
      wins,
      losses,
      winRate,
      popularity: 0, // filled below
    };
  });

  // ✅ total picks across all armies (appearances)
  const totalPicksAll = armies.reduce((sum, a) => sum + a.totalPicks, 0);

  // ✅ popularity % based on total picks
  const armiesWithPopularity: ArmyCardData[] = armies.map((a) => ({
    ...a,
    popularity: totalPicksAll ? Math.round((a.totalPicks / totalPicksAll) * 1000) / 10 : 0,
  }));

  const avgWinRate = (() => {
    // weighted by picks (more accurate)
    if (!totalPicksAll) return "0.0";
    const weighted = armiesWithPopularity.reduce((sum, a) => sum + a.winRate * a.totalPicks, 0);
    return (weighted / totalPicksAll).toFixed(1);
  })();

  const topArmy = armiesWithPopularity.reduce(
    (top, a) => (a.totalPicks > 0 && a.winRate > top.winRate ? a : top),
    armiesWithPopularity[0]
  );

  const mostPopular = armiesWithPopularity.reduce(
    (top, a) => (a.popularity > top.popularity ? a : top),
    armiesWithPopularity[0]
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-black">
                  <span className="gradient-text">ARMY</span>
                  <span className="text-foreground"> STATISTICS</span>
                </h1>
                <p className="text-muted-foreground">
                  Performance data and matchup analysis for all factions
                </p>
              </div>
            </div>

            <button
              onClick={reload}
              disabled={loading}
              className={cn(
                "h-10 px-3 rounded-lg border border-border/60 bg-background/30 hover:bg-background/40 transition flex items-center gap-2",
                loading && "opacity-60 cursor-not-allowed"
              )}
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Armies"
            value={ARMIES_CONFIG.length}
            subtitle="Unique factions"
            icon={Shield}
            delay={100}
          />
          <StatCard
            title="Total Picks"
            value={totalPicksAll.toLocaleString()}
            subtitle={loading ? "Loading..." : "Army selections"}
            icon={Users}
            delay={200}
          />
          <StatCard
            title="Highest Win Rate"
            value={totalPicksAll ? `${topArmy.winRate}%` : "—"}
            subtitle={totalPicksAll ? topArmy.name : "No games yet"}
            icon={TrendingUp}
            delay={300}
          />
          <StatCard
            title="Most Popular"
            value={totalPicksAll ? `${mostPopular.popularity}%` : "—"}
            subtitle={totalPicksAll ? mostPopular.name : "No games yet"}
            icon={Target}
            delay={400}
          />
        </div>

        {/* Optional: small summary row */}
        <div className="mb-6 text-sm text-muted-foreground">
          Average win rate (weighted):{" "}
          <span className="text-foreground font-semibold">{avgWinRate}%</span>
          {loading && <span className="ml-2">(updating...)</span>}
        </div>

        {/* Army Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {armiesWithPopularity.map((army, index) => (
            <ArmyCard key={army.id} army={army} index={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Armies;
