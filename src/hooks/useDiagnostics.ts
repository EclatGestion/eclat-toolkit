import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Recommandation {
  titre: string;
  description: string;
  impact: string;
}

export interface AIRecommendations {
  synthese: string;
  haute: Recommandation[];
  moyenne: Recommandation[];
  longTerme: Recommandation[];
  planAction: { mois: string; action: string }[];
}

export interface DiagnosticResult {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  // Finances personnelles
  revenus: number;
  depenses: number;
  epargne: number;
  credits_restants: number;
  // Épargne & Investissements
  liquidites: number;
  assurance_vie: number;
  per: number;
  pea_cto: number;
  // Immobilier
  residence_principale: number;
  immobilier_locatif: number;
  loyers_percus: number;
  credits_immo: number;
  // Fiscalité
  revenus_imposables: number;
  tmi: number;
  per_utilise: boolean;
  lmnp_utilise: boolean;
  // Transmission
  situation_familiale: string;
  nombre_enfants: number;
  donations_realisees: number;
  assurance_vie_beneficiaire: boolean;
  // Scores
  score_global: number;
  patrimoine_total: number;
  // AI Recommendations
  ai_recommendations?: AIRecommendations | null;
}

export interface DiagnosticInput {
  name?: string;
  revenus?: number;
  depenses?: number;
  epargne?: number;
  credits_restants?: number;
  liquidites?: number;
  assurance_vie?: number;
  per?: number;
  pea_cto?: number;
  residence_principale?: number;
  immobilier_locatif?: number;
  loyers_percus?: number;
  credits_immo?: number;
  revenus_imposables?: number;
  tmi?: number;
  per_utilise?: boolean;
  lmnp_utilise?: boolean;
  situation_familiale?: string;
  nombre_enfants?: number;
  donations_realisees?: number;
  assurance_vie_beneficiaire?: boolean;
  score_global?: number;
  patrimoine_total?: number;
}

export function useDiagnostics() {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDiagnostics = useCallback(async () => {
    if (!user) {
      setDiagnostics([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      // Cast the data to handle JSONB ai_recommendations field
      const formattedData = (data || []).map((d) => ({
        ...d,
        ai_recommendations: d.ai_recommendations as unknown as AIRecommendations | null,
      }));
      setDiagnostics(formattedData);
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const createDiagnostic = useCallback(async (input: DiagnosticInput): Promise<DiagnosticResult | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .insert({
          user_id: user.id,
          name: input.name || "Mon diagnostic",
          revenus: input.revenus || 0,
          depenses: input.depenses || 0,
          epargne: input.epargne || 0,
          credits_restants: input.credits_restants || 0,
          liquidites: input.liquidites || 0,
          assurance_vie: input.assurance_vie || 0,
          per: input.per || 0,
          pea_cto: input.pea_cto || 0,
          residence_principale: input.residence_principale || 0,
          immobilier_locatif: input.immobilier_locatif || 0,
          loyers_percus: input.loyers_percus || 0,
          credits_immo: input.credits_immo || 0,
          revenus_imposables: input.revenus_imposables || 0,
          tmi: input.tmi || 30,
          per_utilise: input.per_utilise || false,
          lmnp_utilise: input.lmnp_utilise || false,
          situation_familiale: input.situation_familiale || "celibataire",
          nombre_enfants: input.nombre_enfants || 0,
          donations_realisees: input.donations_realisees || 0,
          assurance_vie_beneficiaire: input.assurance_vie_beneficiaire || false,
          score_global: input.score_global || 0,
          patrimoine_total: input.patrimoine_total || 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchDiagnostics();
      return {
        ...data,
        ai_recommendations: data.ai_recommendations as unknown as AIRecommendations | null,
      } as DiagnosticResult;
    } catch (err) {
      console.error("Error creating diagnostic:", err);
      toast.error("Erreur lors de la création du diagnostic");
      return null;
    }
  }, [user, fetchDiagnostics]);

  const updateDiagnostic = useCallback(async (id: string, input: DiagnosticInput): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("diagnostic_results")
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      await fetchDiagnostics();
      return true;
    } catch (err) {
      console.error("Error updating diagnostic:", err);
      toast.error("Erreur lors de la mise à jour");
      return false;
    }
  }, [user, fetchDiagnostics]);

  const deleteDiagnostic = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("diagnostic_results")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      await fetchDiagnostics();
      toast.success("Diagnostic supprimé");
      return true;
    } catch (err) {
      console.error("Error deleting diagnostic:", err);
      toast.error("Erreur lors de la suppression");
      return false;
    }
  }, [user, fetchDiagnostics]);

  return {
    diagnostics,
    isLoading,
    createDiagnostic,
    updateDiagnostic,
    deleteDiagnostic,
    refreshDiagnostics: fetchDiagnostics,
  };
}
