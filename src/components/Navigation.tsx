import { NavLink, useLocation } from "react-router-dom";
import { Trophy, Swords, Shield, Home, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/rankings", label: "Rankings", icon: Trophy },
  { path: "/matches", label: "Matches", icon: Swords },
  { path: "/armies", label: "Armies", icon: Shield },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 animate-pulse-glow">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              GAME STATS
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_hsl(180_100%_50%/0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
