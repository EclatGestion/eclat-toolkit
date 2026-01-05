import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface SavedSimulation {
  id: string;
  user_id: string;
  name: string;
  tool_type: string;
  tool_label: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useSavedSimulations(toolType?: string) {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSimulations = async () => {
    if (!user) {
      setSimulations([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("saved_simulations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (toolType) {
        query = query.eq("tool_type", toolType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSimulations((data as SavedSimulation[]) || []);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      toast.error("Erreur lors du chargement des simulations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, [user, toolType]);

  const saveSimulation = async (
    name: string,
    toolType: string,
    toolLabel: string,
    parameters: Record<string, any>,
    results: Record<string, any>
  ): Promise<SavedSimulation | null> => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("saved_simulations")
        .insert({
          user_id: user.id,
          name,
          tool_type: toolType,
          tool_label: toolLabel,
          parameters,
          results,
        })
        .select()
        .single();

      if (error) throw error;

      const newSimulation = data as SavedSimulation;
      setSimulations((prev) => [newSimulation, ...prev]);
      toast.success("Simulation sauvegardée !");
      return newSimulation;
    } catch (error) {
      console.error("Error saving simulation:", error);
      toast.error("Erreur lors de la sauvegarde");
      return null;
    }
  };

  const updateSimulation = async (
    id: string,
    updates: { name?: string; parameters?: Record<string, any>; results?: Record<string, any> }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("saved_simulations")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setSimulations((prev) =>
        prev.map((sim) => (sim.id === id ? { ...sim, ...updates } : sim))
      );
      toast.success("Simulation mise à jour");
      return true;
    } catch (error) {
      console.error("Error updating simulation:", error);
      toast.error("Erreur lors de la mise à jour");
      return false;
    }
  };

  const deleteSimulation = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("saved_simulations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSimulations((prev) => prev.filter((sim) => sim.id !== id));
      toast.success("Simulation supprimée");
      return true;
    } catch (error) {
      console.error("Error deleting simulation:", error);
      toast.error("Erreur lors de la suppression");
      return false;
    }
  };

  const duplicateSimulation = async (simulation: SavedSimulation): Promise<SavedSimulation | null> => {
    return saveSimulation(
      `${simulation.name} (copie)`,
      simulation.tool_type,
      simulation.tool_label,
      simulation.parameters,
      simulation.results
    );
  };

  return {
    simulations,
    loading,
    saveSimulation,
    updateSimulation,
    deleteSimulation,
    duplicateSimulation,
    refetch: fetchSimulations,
  };
}
