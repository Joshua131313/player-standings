import { Layout } from "@/components/Layout";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { players } from "@/data/players";
import { Trophy } from "lucide-react";

const Rankings = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black">
                <span className="gradient-text">PLAYER</span>
                <span className="text-foreground"> RANKINGS</span>
              </h1>
              <p className="text-muted-foreground">
                Complete leaderboard of all active players
              </p>
            </div>
          </div>
        </header>

        {/* Leaderboard Table */}
        <LeaderboardTable players={players} />
      </div>
    </Layout>
  );
};

export default Rankings;
