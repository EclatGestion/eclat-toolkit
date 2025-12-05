import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BankConnection {
  id: string;
  powens_connection_id: number;
  bank_name: string | null;
  bank_logo_url: string | null;
  last_sync_at: string | null;
  status: string | null;
}

export function usePowens() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [bankConnection, setBankConnection] = useState<BankConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load existing bank connection
  const loadBankConnection = useCallback(async () => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bank_connections")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setBankConnection(data as BankConnection);
        setIsConnected(true);
      } else {
        setBankConnection(null);
        setIsConnected(false);
      }
    } catch (e) {
      console.error("Error loading bank connection:", e);
    } finally {
      setIsInitialLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBankConnection();
  }, [loadBankConnection]);

  // Initialize Powens connection (opens webview)
  const initConnection = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("powens-init");

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.webviewUrl) {
        // Open Powens webview in new window
        window.open(data.webviewUrl, "_blank", "width=600,height=700");
        
        toast({
          title: "Connexion bancaire",
          description: "Une fenêtre s'est ouverte pour connecter votre banque. Revenez ici une fois terminé.",
        });
      }
    } catch (error) {
      console.error("Error initializing Powens:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de démarrer la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync transactions
  const syncTransactions = async () => {
    if (!user || !isConnected) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("powens-sync");

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Synchronisation réussie",
        description: "Vos transactions ont été analysées avec succès.",
      });

      // Refresh connection info
      await loadBankConnection();

      return data?.data || null;
    } catch (error) {
      console.error("Error syncing transactions:", error);
      toast({
        title: "Erreur de synchronisation",
        description: error instanceof Error ? error.message : "Impossible de synchroniser",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect bank
  const disconnect = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("powens-disconnect", {
        body: { connectionId: bankConnection?.powens_connection_id },
      });

      if (error) throw error;

      setBankConnection(null);
      setIsConnected(false);

      toast({
        title: "Banque déconnectée",
        description: "Votre connexion bancaire a été supprimée.",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de déconnecter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    bankConnection,
    isLoading,
    isInitialLoading,
    initConnection,
    syncTransactions,
    disconnect,
    refresh: loadBankConnection,
  };
}
