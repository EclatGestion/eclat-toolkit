import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionData {
  subscribed: boolean;
  plan_type: "monthly" | "annual" | null;
  subscription_end: string | null;
}

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setSubscriptionData(null);
      setIsLoading(false);
      return;
    }

    try {
      // First check local profile for quick response
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profile?.is_premium) {
        setIsPremium(true);
      }

      // Then verify with Stripe
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        // Fallback to profile data
        setIsPremium(profile?.is_premium ?? false);
      } else if (data) {
        setIsPremium(data.subscribed);
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Refresh subscription status periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      checkSubscription();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return { 
    isPremium, 
    isLoading, 
    subscriptionData,
    refreshSubscription: checkSubscription,
  };
}
