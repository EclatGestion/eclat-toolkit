import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "premium" | "expert";

interface SubscriptionData {
  subscribed: boolean;
  tier: SubscriptionTier;
  plan_type: "monthly" | "annual" | null;
  subscription_end: string | null;
  product_id: string | null;
}

// Stripe product IDs for reference
export const STRIPE_PRODUCTS = {
  premium: {
    monthly: {
      product_id: "prod_TY2MOQ5r4jvvuO",
      price_id: "price_1SYUhnCqNxHTprKBLJ7j1pBW", // Premium Mensuel 5.99€
    },
    annual: {
      product_id: "prod_TY2NnrRNxrpsyC",
      price_id: "price_1SYUiSCqNxHTprKBtHYqNYrH", // Premium Annuel 49.99€
    },
  },
  expert: {
    monthly: {
      product_id: "prod_TZZ1CE1G03xadZ",
      price_id: "price_1ScPt8CqNxHTprKBcSzg2cLY", // Expert Mensuel 14.99€
    },
    annual: {
      product_id: "prod_TZZqIkF9Q92w4v",
      price_id: "price_1ScQgmCqNxHTprKBMfxUKi0m", // Expert Annuel 149.99€ (-17%)
    },
  },
};

export function usePremium() {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  // Computed values for backward compatibility
  const isPremium = tier === "premium" || tier === "expert";
  const isExpert = tier === "expert";

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setTier("free");
      setSubscriptionData(null);
      setIsLoading(false);
      setHasCheckedOnce(false);
      return;
    }

    try {
      // First check local profile for quick response
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profile?.is_premium && !hasCheckedOnce) {
        // Temporary set, will be updated by Stripe check
        setTier("premium");
      }

      // Then verify with Stripe for accurate tier
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        // Only fallback if we haven't successfully checked before
        if (!hasCheckedOnce) {
          setTier(profile?.is_premium ? "premium" : "free");
          setHasCheckedOnce(true);
        }
        // Otherwise keep current tier to avoid jumps
      } else if (data) {
        setTier(data.tier || "free");
        setSubscriptionData(data);
        setHasCheckedOnce(true);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
      // Only reset to free if we've never successfully checked
      if (!hasCheckedOnce) {
        setTier("free");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, hasCheckedOnce]);

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

  // Helper function to check if user has access to a specific tier
  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (requiredTier === "free") return true;
    if (requiredTier === "premium") return isPremium;
    if (requiredTier === "expert") return isExpert;
    return false;
  }, [isPremium, isExpert]);

  return { 
    tier,
    isPremium, // Has premium OR expert
    isExpert,  // Has expert only
    isLoading, 
    subscriptionData,
    hasAccess,
    refreshSubscription: checkSubscription,
  };
}
