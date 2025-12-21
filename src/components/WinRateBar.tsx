import { cn } from "@/lib/utils";

interface WinRateBarProps {
  winRate: number;
  className?: string;
}

export const WinRateBar = ({ winRate, className }: WinRateBarProps) => {
  const getBarColor = () => {
    if (winRate >= 70) return "bg-gradient-to-r from-emerald-500 to-green-400";
    if (winRate >= 50) return "bg-gradient-to-r from-cyan-500 to-blue-400";
    if (winRate >= 30) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-red-500 to-orange-400";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            getBarColor()
          )}
          style={{ width: `${winRate}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground min-w-[45px] text-right">
        {winRate.toFixed(1)}%
      </span>
    </div>
  );
};
