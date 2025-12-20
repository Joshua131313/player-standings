import { Armies } from "@/data/armies";
import { useEffect, useMemo, useState } from "react";

export type PopulatedPlayer = { _id: string; name: string };
export type PlayerRef = string | PopulatedPlayer;

export type TeamPlayer = {
  playerId: PlayerRef;
  army: Armies; // your army/faction id (from armies array)
};

export type Team = {
  teamIndex: number;
  result: "win" | "loss";
  players: TeamPlayer[];
};

export type Matchup = {
  _id: string;
  playedAt: string; // ISO date
  mode: "1v1" | "2v2" | "3v3";
  map: string;
  teams: Team[];
  replay?: {
    bucket?: string;
    key?: string;
    originalName?: string;
    size?: number;
    contentType?: string;
  };
};

export const useMatchups = () => {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const reload = async () => {
    setError("");
    setLoading(true);

    const controller = new AbortController();
    try {
      const res = await fetch("/api/matchups", { signal: controller.signal });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load matchups");
        setMatchups([]);
        return;
      }

      setMatchups(Array.isArray(data) ? data : []);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byMostRecent = useMemo(() => {
    return [...matchups].sort(
      (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
    );
  }, [matchups]);

  return { matchups, byMostRecent, loading, error, reload };
};
