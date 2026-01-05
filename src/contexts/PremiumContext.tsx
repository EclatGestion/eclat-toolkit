import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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

interface PremiumContextType {
  tier: SubscriptionTier;
  isPremium: boolean;
  isExpert: boolean;
  isLoading: boolean;
  subscriptionData: SubscriptionData | null;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
  refreshSubscription: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setTier("free");
        setSubscriptionData(null);
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profile?.is_premium && !hasCheckedOnce) {
        setTier("premium");
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        const errorMessage = error.message || "";
        const isAuthError = errorMessage.includes("401") || 
                           errorMessage.includes("Auth session missing") ||
                           errorMessage.includes("unauthorized");
        
        if (!isAuthError) {
          console.error("Error checking subscription:", error);
        }
        
        if (!hasCheckedOnce) {
          setTier(profile?.is_premium ? "premium" : "free");
          setHasCheckedOnce(true);
        }
      } else if (data) {
        setTier(data.tier || "free");
        setSubscriptionData(data);
        setHasCheckedOnce(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isAuthError = errorMessage.includes("401") || 
                         errorMessage.includes("Auth session missing");
      
      if (!isAuthError) {
        console.error("Error checking premium status:", error);
      }
      
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

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (requiredTier === "free") return true;
    if (requiredTier === "premium") return isPremium;
    if (requiredTier === "expert") return isExpert;
    return false;
  }, [isPremium, isExpert]);

  return (
    <PremiumContext.Provider value={{ 
      tier,
      isPremium,
      isExpert,
      isLoading, 
      subscriptionData,
      hasAccess,
      refreshSubscription: checkSubscription,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremiumContext() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremiumContext must be used within a PremiumProvider");
  }
  return context;
}
