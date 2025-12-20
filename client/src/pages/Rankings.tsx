import { Layout } from "@/components/Layout";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Rankings = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
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

            <Button asChild>
              <Link to="/add-player">Add Player</Link>
            </Button>
          </div>
        </header>

        {/* Leaderboard Table (fetches from backend hooks internally) */}
        <LeaderboardTable />
      </div>
    </Layout>
  );
};

export default Rankings;
