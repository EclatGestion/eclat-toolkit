import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type RecoStatus = "pending" | "in_progress" | "completed";

interface RecommendationStatusRecord {
  id: string;
  recommendation_key: string;
  status: RecoStatus;
}

export function useRecommendationStatus(diagnosticId?: string) {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Record<string, RecoStatus>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatuses = useCallback(async () => {
    if (!user || !diagnosticId) {
      setStatuses({});
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("recommendation_status")
        .select("recommendation_key, status")
        .eq("user_id", user.id)
        .eq("diagnostic_id", diagnosticId);

      if (error) throw error;

      const statusMap: Record<string, RecoStatus> = {};
      (data || []).forEach((record: { recommendation_key: string; status: string }) => {
        statusMap[record.recommendation_key] = record.status as RecoStatus;
      });
      setStatuses(statusMap);
    } catch (err) {
      console.error("Error fetching recommendation statuses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, diagnosticId]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const updateStatus = useCallback(
    async (recommendationKey: string, status: RecoStatus): Promise<boolean> => {
      if (!user || !diagnosticId) return false;

      try {
        const { error } = await supabase
          .from("recommendation_status")
          .upsert(
            {
              user_id: user.id,
              diagnostic_id: diagnosticId,
              recommendation_key: recommendationKey,
              status,
            },
            {
              onConflict: "user_id,diagnostic_id,recommendation_key",
            }
          );

        if (error) throw error;

        setStatuses((prev) => ({
          ...prev,
          [recommendationKey]: status,
        }));
        return true;
      } catch (err) {
        console.error("Error updating recommendation status:", err);
        return false;
      }
    },
    [user, diagnosticId]
  );

  const getCompletedCount = useCallback(() => {
    return Object.values(statuses).filter((s) => s === "completed").length;
  }, [statuses]);

  const getInProgressCount = useCallback(() => {
    return Object.values(statuses).filter((s) => s === "in_progress").length;
  }, [statuses]);

  return {
    statuses,
    isLoading,
    updateStatus,
    getCompletedCount,
    getInProgressCount,
    refreshStatuses: fetchStatuses,
  };
}
