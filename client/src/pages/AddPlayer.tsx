import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminToken, isAdmin as isAdminFn, logoutAdmin } from "@/auth/adminAuth";

const AddPlayer = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ derived from JWT (works after refresh)
  const isAdmin = useMemo(() => isAdminFn(), []);

const addPlayer = async () => {
  const trimmed = name.trim();
  setError("");
  setSuccess("");

  if (!trimmed) {
    setError("Player name is required.");
    return;
  }

  try {
    setLoading(true);

    // apiFetch returns JSON data directly (not a Response)
    await apiFetch("/api/players", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    });

    setSuccess(trimmed);
    setName("");
  } catch (e: any) {
    setError(e?.message || "Failed to add player.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black">
                <span className="gradient-text">ADD</span>
                <span className="text-foreground"> PLAYER</span>
              </h1>
              <p className="text-muted-foreground">Manage active players</p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md shadow-lg p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add a player</h2>
                <p className="text-sm text-muted-foreground">
                  Create a player to track matchups, win rate, and top army.
                </p>
              </div>

              <div
                className={
                  isAdmin
                    ? "text-xs px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                    : "text-xs px-2.5 py-1 rounded-full border border-destructive/25 bg-destructive/10 text-destructive"
                }
              >
                {isAdmin ? "Admin" : "Not logged in"}
              </div>
            </div>

            {/* Row */}
            <div className="flex gap-[10px] items-center">
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                  if (success) setSuccess("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim() && !loading) addPlayer();
                }}
                placeholder="Player name"
                className="h-11"
                disabled={loading || !isAdmin}
              />
              <Button
                onClick={addPlayer}
                className="h-11"
                disabled={!name.trim() || loading || !isAdmin}
              >
                {loading ? "Adding..." : "Add Player"}
              </Button>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Tip: Use consistent spelling for accurate leaderboards.
              </p>
              <p className="text-xs text-muted-foreground">
                Press{" "}
                <span className="px-1.5 py-0.5 rounded border bg-background/40">
                  Enter
                </span>{" "}
                to add
              </p>
            </div>

            {!!name.trim() && (
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">Will add:</span>
                  <span className="text-sm font-medium text-foreground break-words min-w-0">
                    {name.trim()}
                  </span>
                </div>
              </div>
            )}

            {!isAdmin && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Admin login required to add players.{" "}
                <button
                  onClick={() => navigate("/admin-login")}
                  className="underline underline-offset-2"
                >
                  Go to Admin Login
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
                <span className="font-medium">Added:</span> {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPlayer;
