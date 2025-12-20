import { cn } from "@/lib/utils";
import { Trophy, Medal, Award, User } from "lucide-react";

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export const RankBadge = ({ rank, className }: RankBadgeProps) => {
  const getRankStyles = () => {
    switch (rank) {
      case 1:
        return {
          icon: Trophy,
          bg: "bg-gradient-to-br from-yellow-400 to-amber-600",
          glow: "shadow-[0_0_20px_hsl(45_100%_50%/0.5)]",
          text: "text-yellow-900",
        };
      case 2:
        return {
          icon: Medal,
          bg: "bg-gradient-to-br from-slate-300 to-slate-500",
          glow: "shadow-[0_0_15px_hsl(220_20%_70%/0.4)]",
          text: "text-slate-900",
        };
      case 3:
        return {
          icon: Award,
          bg: "bg-gradient-to-br from-orange-400 to-orange-700",
          glow: "shadow-[0_0_15px_hsl(30_60%_45%/0.4)]",
          text: "text-orange-900",
        };
      default:
        return {
          icon: User,
          bg: "bg-secondary",
          glow: "",
          text: "text-muted-foreground",
        };
    }
  };

  const styles = getRankStyles();
  const Icon = styles.icon;

  if (rank <= 3) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center animate-float",
          styles.bg,
          styles.glow,
          className
        )}
      >
        <Icon className={cn("w-5 h-5", styles.text)} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg",
        styles.bg,
        className
      )}
    >
      <span className={styles.text}>{rank}</span>
    </div>
  );
};
