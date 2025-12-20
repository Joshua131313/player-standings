import { Link, NavLink, useLocation } from "react-router-dom";
import { Trophy, Swords, Shield, Home, Zap, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAdmin } from "@/auth/adminAuth";



export const Navigation = () => {
  const location = useLocation();
  const admin = isAdmin();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/rankings", label: "Rankings", icon: Trophy },
    { path: "/matches", label: "Matches", icon: Swords },
    { path: "/armies", label: "Armies", icon: Shield },
    { path: "/add-matchup", label: "Add Matchup", icon: Plus, admin: true },
    { path: "/add-player", label: "Add Player", icon: UserPlus, admin: true },
  ].filter(item => !item.admin || admin);
  const linkBase =
    "flex items-center gap-2 rounded-lg font-medium text-sm transition-all duration-200";

  const linkActive =
    "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_hsl(180_100%_50%/0.2)]";

  const linkInactive =
    "text-muted-foreground hover:text-foreground hover:bg-secondary";

  return (
    <>
      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Zap className="w-5 h-5 text-primary" />
              </div>

              <Link to="/">
                <span className="font-display font-bold text-lg gradient-text">
                  GAME STATS
                </span>
              </Link>
            </div>

            {/* DESKTOP / TABLET LINKS */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={cn(
                      linkBase,
                      isActive ? linkActive : linkInactive,

                      // >= 1050px: comfy spacing + labels
                      "min-[1050px]:px-4 min-[1050px]:py-2",

                      // < 1050px: tighten to avoid collisions
                      "max-[1049px]:px-3 max-[1049px]:py-2 max-[1049px]:gap-0"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden min-[1050px]:inline">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV (mobile only) - sleeker */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/70 backdrop-blur-md">
        <div className="px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between gap-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={cn(
                    // tighter + slimmer
                    "flex flex-1 items-center justify-center rounded-xl transition-all",
                    "h-11",

                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {/* icon-only default; active gets a tiny label for clarity */}
                  <div className={cn("flex items-center justify-center", isActive && "gap-1.5 px-2")}>
                    <Icon className={cn("shrink-0", isActive ? "w-5.5 h-5.5" : "w-5 h-5")} />

                    {/* show label ONLY when active (keeps it clean) */}
                    <span
                      className={cn(
                        "text-[11px] font-semibold tracking-wide",
                        isActive ? "inline" : "hidden"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

    </>
  );
};
