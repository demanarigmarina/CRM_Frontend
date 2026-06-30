import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.error || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
