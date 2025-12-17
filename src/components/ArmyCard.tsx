import { Card, CardContent } from "@/components/ui/card";
import { Army } from "@/data/armies";
import { WinRateBar } from "./WinRateBar";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Shield, Target } from "lucide-react";

interface ArmyCardProps {
  army: Army;
  index: number;
}

export const ArmyCard = ({ army, index }: ArmyCardProps) => {
  return (
    <Card
      variant="glass"
      className={cn(
        "overflow-hidden hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Header with gradient */}
      <div className={cn("h-2 bg-gradient-to-r", army.color)} />

      <CardContent className="p-5">
        {/* Army Info */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br",
              army.color
            )}
          >
            {army.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg">{army.name}</h3>
            <p className="text-sm text-muted-foreground">
              {army.totalPicks.toLocaleString()} picks •{" "}
              {army.popularity.toFixed(1)}% popularity
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Wins
            </p>
            <p className="font-display font-bold text-success">
              {army.wins.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Losses
            </p>
            <p className="font-display font-bold text-destructive">
              {army.losses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Avg Score
            </p>
            <p className="font-display font-bold text-foreground">
              {army.avgScore.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Win Rate */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Win Rate
          </p>
          <WinRateBar winRate={army.winRate} />
        </div>

        {/* Matchups */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-1 text-success text-xs font-semibold mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>Strong Against</span>
            </div>
            <div className="space-y-1">
              {army.strongAgainst.map((enemy) => (
                <p key={enemy} className="text-xs text-muted-foreground">
                  {enemy}
                </p>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-1 text-destructive text-xs font-semibold mb-2">
              <TrendingDown className="w-3 h-3" />
              <span>Weak Against</span>
            </div>
            <div className="space-y-1">
              {army.weakAgainst.map((enemy) => (
                <p key={enemy} className="text-xs text-muted-foreground">
                  {enemy}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
