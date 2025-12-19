import { useState } from "react";
import { Layout } from "@/components/Layout";
import { LeaderboardTable, Player } from "@/components/LeaderboardTable";
import { AddPlayerForm } from "@/components/AddPlayerForm";
import { players as initialPlayers } from "@/data/players";
import { Trophy } from "lucide-react";

const Rankings = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handleAddPlayer = (newPlayer: { name: string; avatar: string }) => {
    const player: Player = {
      id: String(players.length + 1),
      name: newPlayer.name,
      avatar: newPlayer.avatar,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      streak: 0,
    };
    setPlayers((prev) => [...prev, player]);
  };

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
            <AddPlayerForm onAddPlayer={handleAddPlayer} />
          </div>
        </header>

        {/* Leaderboard Table */}
        <LeaderboardTable players={players} />
      </div>
    </Layout>
  );
};

export default Rankings;
