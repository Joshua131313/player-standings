import { Layout } from "@/components/Layout";
import { ArmyCard } from "@/components/ArmyCard";
import { StatCard } from "@/components/StatCard";
import { armies } from "@/data/armies";
import { Shield, Target, TrendingUp, Users } from "lucide-react";

const Armies = () => {
  const totalPicks = armies.reduce((sum, a) => sum + a.totalPicks, 0);
  const avgWinRate = (
    armies.reduce((sum, a) => sum + a.winRate, 0) / armies.length
  ).toFixed(1);
  const topArmy = armies.reduce((top, a) => (a.winRate > top.winRate ? a : top));
  const mostPopular = armies.reduce((top, a) =>
    a.popularity > top.popularity ? a : top
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
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
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Armies"
            value={armies.length}
            subtitle="Unique factions"
            icon={Shield}
            delay={100}
          />
          <StatCard
            title="Total Picks"
            value={totalPicks.toLocaleString()}
            subtitle="Army selections"
            icon={Users}
            delay={200}
          />
          <StatCard
            title="Highest Win Rate"
            value={`${topArmy.winRate}%`}
            subtitle={topArmy.name}
            icon={TrendingUp}
            delay={300}
          />
          <StatCard
            title="Most Popular"
            value={`${mostPopular.popularity}%`}
            subtitle={mostPopular.name}
            icon={Target}
            delay={400}
          />
        </div>

        {/* Army Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {armies.map((army, index) => (
            <ArmyCard key={army.id} army={army} index={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Armies;
