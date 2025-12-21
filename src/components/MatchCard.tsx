import { Card } from "@/components/ui/card";
import { Match } from "@/data/matches";
import { Clock, MapPin, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  index: number;
}

export const MatchCard = ({ match, index }: MatchCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModeColor = () => {
    switch (match.mode) {
      case "1v1":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "2v2":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "3v3":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "p-4 hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Mode & Date */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border",
              getModeColor()
            )}
          >
            {match.mode}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDate(match.date)}
          </span>
        </div>

        {/* Match Result */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="text-right flex-1">
            <div className="flex items-center justify-end gap-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="font-semibold text-success truncate max-w-[150px] md:max-w-none">
                {match.winner}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50">
            <span className="font-display font-bold text-lg text-success">
              {match.winnerScore}
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="font-display font-bold text-lg text-destructive">
              {match.loserScore}
            </span>
          </div>

          <div className="text-left flex-1">
            <span className="font-semibold text-muted-foreground truncate max-w-[150px] md:max-w-none block">
              {match.loser}
            </span>
          </div>
        </div>

        {/* Map & Duration */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="hidden lg:inline">{match.map}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{match.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
