import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Armies } from "@/data/armies";

export type PopulatedPlayer = { _id: string; name: string };
export type PlayerRef = string | PopulatedPlayer;

export type TeamPlayer = {
  playerId: PlayerRef;
  army: Armies;
};

export type Team = {
  teamIndex: number;
  result: "win" | "loss";
  players: TeamPlayer[];
};

export type Matchup = {
  _id: string;
  playedAt: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch<Matchup[]>("/api/matchups");
      setMatchups(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load matchups");
      setMatchups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const byMostRecent = useMemo(() => {
    return [...matchups].sort(
      (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
    );
  }, [matchups]);

  return { matchups, byMostRecent, loading, error, reload };
};
