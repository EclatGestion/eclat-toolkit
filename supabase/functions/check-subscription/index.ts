import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product IDs mapping to tiers
const TIER_PRODUCTS = {
  premium: [
    "prod_TY2MOQ5r4jvvuO", // Premium Mensuel
    "prod_TY2NnrRNxrpsyC", // Premium Annuel
  ],
  expert: [
    "prod_TZZ1CE1G03xadZ", // Expert Mensuel
    "prod_TZZqIkF9Q92w4v", // Expert Annuel
  ],
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

const getTierFromProductId = (productId: string): "free" | "premium" | "expert" => {
  if (TIER_PRODUCTS.expert.includes(productId)) {
    return "expert";
  }
  if (TIER_PRODUCTS.premium.includes(productId)) {
    return "premium";
  }
  return "free";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "free",
        plan_type: null,
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("Auth error", { message: userError.message });
      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "free",
        plan_type: null,
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      
      await supabaseClient
        .from("profiles")
        .update({ is_premium: false })
        .eq("id", user.id);

      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "free",
        plan_type: null,
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    // Accept both "active" and "trialing" subscriptions as valid
    // deno-lint-ignore no-explicit-any
    const validSubscriptions = subscriptions.data.filter(
      (sub: any) => sub.status === "active" || sub.status === "trialing"
    );
    const hasActiveSub = validSubscriptions.length > 0;
    let subscriptionEnd: string | null = null;
    let planType: string | null = null;
    let tier: "free" | "premium" | "expert" = "free";
    let productId: string | null = null;

    if (hasActiveSub) {
      const subscription = validSubscriptions[0];
      const endTimestamp = subscription.status === "trialing" && subscription.trial_end 
        ? subscription.trial_end 
        : subscription.current_period_end;
      if (endTimestamp) {
        subscriptionEnd = new Date(endTimestamp * 1000).toISOString();
      }
      
      // Get product ID and determine tier
      productId = subscription.items.data[0]?.price?.product as string;
      tier = getTierFromProductId(productId);
      
      // Determine plan type based on interval
      const interval = subscription.items.data[0]?.price?.recurring?.interval;
      planType = interval === "year" ? "annual" : "monthly";
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        productId,
        tier,
        planType, 
        endDate: subscriptionEnd 
      });
    } else {
      logStep("No active subscription found");
    }

    // Update profile premium status (expert also counts as premium)
    const isPremium = tier === "premium" || tier === "expert";
    await supabaseClient
      .from("profiles")
      .update({ is_premium: isPremium })
      .eq("id", user.id);

    logStep("Profile updated", { is_premium: isPremium, tier });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      tier,
      plan_type: planType,
      subscription_end: subscriptionEnd,
      product_id: productId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
