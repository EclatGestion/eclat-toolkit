import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BankConnection {
  id: string;
  powens_connection_id: number;
  bank_name: string | null;
  bank_logo_url: string | null;
  last_sync_at: string | null;
  status: string | null;
}

export function usePowens() {
  const { user } = useAuth();
  const [bankConnection, setBankConnection] = useState<BankConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load existing bank connection
  const loadBankConnection = useCallback(async () => {
    if (!user) return;

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
    } else {
      setBankConnection(null);
    }
  }, [user]);

  useEffect(() => {
    loadBankConnection();
  }, [loadBankConnection]);

  // Initialize Powens connection (opens webview)
  const initConnection = async (redirectUrl: string): Promise<string | null> => {
    if (!user) return null;

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("powens-init", {
        body: { redirectUrl },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || "Failed to initialize Powens");
      }

      return data.webviewUrl;
    } catch (err) {
      console.error("Powens init error:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle callback after webview
  const handleCallback = async (connectionId: string): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("powens-callback", {
        body: { connectionId },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || "Failed to save connection");
      }

      // Reload bank connection
      await loadBankConnection();
    } catch (err) {
      console.error("Powens callback error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sync transactions and get AI analysis
  const syncTransactions = async () => {
    if (!user || !bankConnection) return null;

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("powens-sync");

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || "Failed to sync transactions");
      }

      // Reload bank connection to update last_sync_at
      await loadBankConnection();

      return data.data;
    } catch (err) {
      console.error("Powens sync error:", err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  // Disconnect bank
  const disconnect = async () => {
    if (!user || !bankConnection) return;

    setIsLoading(true);
    try {
      await supabase
        .from("bank_connections")
        .update({ status: "disconnected" })
        .eq("id", bankConnection.id);

      setBankConnection(null);
    } catch (err) {
      console.error("Disconnect error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bankConnection,
    isLoading,
    isConnecting,
    isSyncing,
    hasConnection: !!bankConnection,
    initConnection,
    handleCallback,
    syncTransactions,
    disconnect,
    refresh: loadBankConnection,
  };
}
