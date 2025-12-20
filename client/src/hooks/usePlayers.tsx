import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type PlayerDoc = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export const usePlayers = () => {
  const [players, setPlayers] = useState<PlayerDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch<PlayerDoc[]>("/api/players");
      setPlayers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load players");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { players, loading, error, reload };
};
