import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Swords } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ✅ Adjust this import if your file/path/export differs
import { armies } from "@/data/armies";
import { apiFetch } from "@/lib/api";
import { SearchableOption, SearchableSelect } from "@/components/ui/SearchableSelect";

type Mode = "1v1" | "2v2" | "3v3";

const DEFAULT_MAP_BY_MODE: Record<Mode, string> = {
  "1v1": "Rohan",
  "2v2": "Buckland",
  "3v3": "Rhun",
};

const TEAM_SIZE_BY_MODE: Record<Mode, number> = {
  "1v1": 1,
  "2v2": 2,
  "3v3": 3,
};

const AddMatchup = () => {
  const [players, setPlayers] = useState<any[]>([]);

  const [mode, setMode] = useState<Mode>("1v1");

  const [team1, setTeam1] = useState<string[]>([""]);
  const [team2, setTeam2] = useState<string[]>([""]);

  // ✅ NEW: faction selection per player slot
  const [team1Factions, setTeam1Factions] = useState<string[]>([""]);
  const [team2Factions, setTeam2Factions] = useState<string[]>([""]);

  // winner selector
  const [winningTeam, setWinningTeam] = useState<"team1" | "team2" | "">("");

  const [mapName, setMapName] = useState(DEFAULT_MAP_BY_MODE["1v1"]);
  const [mapTouched, setMapTouched] = useState(false);

  const [replayFile, setReplayFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch players for dropdowns
  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then((data) => setPlayers(Array.isArray(data) ? data : []))
      .catch(() => setPlayers([]));
  }, []);

  // Resize teams/factions when mode changes + apply default map
  useEffect(() => {
    const size = TEAM_SIZE_BY_MODE[mode];

    setTeam1((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push("");
      return next;
    });

    setTeam2((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push("");
      return next;
    });

    // ✅ resize factions arrays too
    setTeam1Factions((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push("");
      return next;
    });

    setTeam2Factions((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push("");
      return next;
    });

    setWinningTeam("");

    if (!mapTouched) setMapName(DEFAULT_MAP_BY_MODE[mode]);
  }, [mode, mapTouched]);

  const allSelectedPlayerIds = useMemo(() => {
    return [...team1, ...team2].filter(Boolean);
  }, [team1, team2]);

  const setTeamValue = (team: "team1" | "team2", index: number, value: string) => {
    if (team === "team1") {
      setTeam1((prev) => {
        const copy = [...prev];
        copy[index] = value;
        return copy;
      });
    } else {
      setTeam2((prev) => {
        const copy = [...prev];
        copy[index] = value;
        return copy;
      });
    }
  };

  // ✅ new setter for factions
  const setTeamFaction = (team: "team1" | "team2", index: number, value: string) => {
    if (team === "team1") {
      setTeam1Factions((prev) => {
        const copy = [...prev];
        copy[index] = value;
        return copy;
      });
    } else {
      setTeam2Factions((prev) => {
        const copy = [...prev];
        copy[index] = value;
        return copy;
      });
    }
  };

  const validate = () => {
    const size = TEAM_SIZE_BY_MODE[mode];

    if (team1.length !== size || team2.length !== size) return "Team size mismatch.";
    if (team1.some((p) => !p) || team2.some((p) => !p)) return "Please select all players.";

    // ✅ require faction for each slot
    if (team1Factions.length !== size || team2Factions.length !== size) return "Faction size mismatch.";
    if (team1Factions.some((f) => !f) || team2Factions.some((f) => !f)) return "Please select a faction for every player.";

    const ids = [...team1, ...team2];
    if (new Set(ids).size !== ids.length) return "A player cannot be selected twice in the same matchup.";

    if (!winningTeam) return "Please select the winning team.";
    if (!mapName.trim()) return "Map name is required.";

    return "";
  };

  // ✅ now includes factions in participants
 const addMatchup = async () => {
  setError("");
  setSuccess("");

  const msg = validate();
  if (msg) {
    setError(msg);
    return;
  }

  try {
    setLoading(true);

    const teams = [
      {
        teamIndex: 0,
        result: winningTeam === "team1" ? "win" : "loss",
        players: team1.map((id, i) => ({
          playerId: id,
          army: team1Factions[i],
        })),
      },
      {
        teamIndex: 1,
        result: winningTeam === "team2" ? "win" : "loss",
        players: team2.map((id, i) => ({
          playerId: id,
          army: team2Factions[i],
        })),
      },
    ];

    const fd = new FormData();
    fd.append("playedAt", new Date().toISOString());
    fd.append("mode", mode);
    fd.append("map", mapName.trim());
    fd.append("teams", JSON.stringify(teams));

    // only append replay if a file exists (avoids backend multer errors)
    if (replayFile) {
      fd.append("replay", replayFile as File); // MUST be "replay"
    }

    // ✅ apiFetch returns parsed data or throws an Error
    await apiFetch("/api/matchups", {
      method: "POST",
      body: fd,
    });

    setSuccess("Matchup added successfully.");
    setReplayFile(null);

    const size = TEAM_SIZE_BY_MODE[mode];
    setTeam1(Array.from({ length: size }, () => ""));
    setTeam2(Array.from({ length: size }, () => ""));
    setTeam1Factions(Array.from({ length: size }, () => ""));
    setTeam2Factions(Array.from({ length: size }, () => ""));
    setWinningTeam("");

    if (!mapTouched) setMapName(DEFAULT_MAP_BY_MODE[mode]);
  } catch (e: any) {
    setError(e?.message || "Network error. Is the server running?");
  } finally {
    setLoading(false);
  }
};


  const SelectPlayer = ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  }) => (
    <select
      className="h-11 w-full rounded-md border border-border/60 bg-background/40 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">Select player...</option>
      {players.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  );

  const SelectFaction = ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  }) => (
    <select
      className="h-11 w-full rounded-md border border-border/60 bg-background/40 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">Faction...</option>
      {(armies || []).map((a: any) => {
        const id = a.id ?? a.value ?? a.key ?? a.name;
        const label = a.label ?? a.name ?? String(id);
        return (
          <option key={String(id)} value={String(id)}>
            {label}
          </option>
        );
      })}
    </select>
  );
  type Player = { _id: string; name: string };

  // ✅ row that contains player select + faction select
  const PlayerRow = ({
    team,
    index,
    playerValue,
    factionValue,
  }: {
    team: "team1" | "team2";
    index: number;
    playerValue: string;
    factionValue: string;
  }) => {
    // ✅ build options (memo is optional but recommended)
    const playerOptions: SearchableOption[] = useMemo(() => {
      // replace `players` with your actual players array from state/hook
      return (players || []).map((p: Player) => ({
        value: p._id,
        label: p.name,
        meta: p._id, // optional: shows id under the name
      }));
    }, [players]);

    const factionOptions: SearchableOption[] = useMemo(() => {
      return (armies || []).map((a: any) => ({
        value: String(a.id),
        label: String(a.name ?? a.label ?? a.id),
        meta: "Faction",
      }));
    }, []);

    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Player {index + 1}</p>

        <div className="flex gap-2 items-center">
          <div className="flex-1 min-w-0">
            <SearchableSelect
              value={playerValue}
              onChange={(v) => setTeamValue(team, index, v)}
              options={playerOptions}
              placeholder="Select player..."
              disabled={loading}
              emptyText="No players match your search"
            />
          </div>

          <div className="w-[160px]">
            <SearchableSelect
              value={factionValue}
              onChange={(v) => setTeamFaction(team, index, v)}
              options={factionOptions}
              placeholder="Faction..."
              disabled={loading}
              emptyText="No factions found"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black">
                <span className="gradient-text">ADD</span>
                <span className="text-foreground"> MATCHUP</span>
              </h1>
              <p className="text-muted-foreground">Keep track of recent matchups</p>
            </div>
          </div>
        </header>

        {/* Panel */}
        <div className="max-w-4xl">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md shadow-lg p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" />
                  Create a matchup
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose match type, pick teams, set factions, select the winner, set map name, and upload the replay.
                </p>
              </div>

              <div className="text-xs px-2.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary">
                {mode.toUpperCase()}
              </div>
            </div>

            {/* Top controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">Match type</p>
                <select
                  className="h-11 w-full rounded-md border border-border/60 bg-background/40 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={mode}
                  onChange={(e) => {
                    setError("");
                    setSuccess("");
                    setMode(e.target.value as Mode);
                  }}
                  disabled={loading}
                >
                  <option value="1v1">1v1</option>
                  <option value="2v2">2v2</option>
                  <option value="3v3">3v3</option>
                </select>
                <p className="text-xs text-muted-foreground">Defaults map to {DEFAULT_MAP_BY_MODE[mode]}.</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">Winning team</p>
                <select
                  className="h-11 w-full rounded-md border border-border/60 bg-background/40 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={winningTeam}
                  onChange={(e) => {
                    setWinningTeam(e.target.value as any);
                    if (error) setError("");
                    if (success) setSuccess("");
                  }}
                  disabled={loading}
                >
                  <option value="">Select winner...</option>
                  <option value="team1">Team 1</option>
                  <option value="team2">Team 2</option>
                </select>
                <p className="text-xs text-muted-foreground">Sets win/loss for participants.</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">Map name</p>
                <Input
                  value={mapName}
                  onChange={(e) => {
                    setMapTouched(true);
                    setMapName(e.target.value);
                    if (error) setError("");
                    if (success) setSuccess("");
                  }}
                  placeholder="Map name"
                  className="h-11"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Example: {DEFAULT_MAP_BY_MODE[mode]}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/90">Replay file</p>

                <label className="h-11 w-full rounded-md border border-border/60 bg-background/40 px-3 text-sm flex items-center justify-between cursor-pointer hover:bg-background/60">
                  <span className="flex items-center gap-2 min-w-0">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">
                      {replayFile ? replayFile.name : "Choose replay (.BFME2Replay)..."}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">Browse</span>
                  <input
                    type="file"
                    accept=".BFME2Replay"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setReplayFile(f);
                      if (error) setError("");
                      if (success) setSuccess("");
                    }}
                    disabled={loading}
                  />
                </label>

                <p className="text-xs text-muted-foreground">Only .BFME2Replay allowed (max 1MB).</p>
              </div>
            </div>

            {/* Teams */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="rounded-2xl border border-border/60 bg-background/30 p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Team 1</p>
                  <p className="text-xs text-muted-foreground">{TEAM_SIZE_BY_MODE[mode]} slots</p>
                </div>

                <div className="space-y-4">
                  {team1.map((val, idx) => (
                    <PlayerRow
                      key={`t1-${idx}`}
                      team="team1"
                      index={idx}
                      playerValue={val}
                      factionValue={team1Factions[idx] || ""}
                    />
                  ))}
                </div>
              </div>

              {/* Team 2 */}
              <div className="rounded-2xl border border-border/60 bg-background/30 p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Team 2</p>
                  <p className="text-xs text-muted-foreground">{TEAM_SIZE_BY_MODE[mode]} slots</p>
                </div>

                <div className="space-y-4">
                  {team2.map((val, idx) => (
                    <PlayerRow
                      key={`t2-${idx}`}
                      team="team2"
                      index={idx}
                      playerValue={val}
                      factionValue={team2Factions[idx] || ""}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview + Submit */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="text-foreground/90">
                  {allSelectedPlayerIds.length}/{TEAM_SIZE_BY_MODE[mode] * 2}
                </span>
                {" • "}
                Winner:{" "}
                <span className="text-foreground/90">
                  {winningTeam ? (winningTeam === "team1" ? "Team 1" : "Team 2") : "(none)"}
                </span>
                {" • "}
                Map: <span className="text-foreground/90">{mapName || "(none)"}</span>
                {" • "}
                Replay: <span className="text-foreground/90">{replayFile ? replayFile.name : "(none)"}</span>
              </div>

              <Button onClick={addMatchup} disabled={loading} className="h-11 md:w-auto w-full">
                {loading ? "Saving..." : "Add Matchup"}
              </Button>
            </div>

            {/* Status area */}
            {error && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddMatchup;
