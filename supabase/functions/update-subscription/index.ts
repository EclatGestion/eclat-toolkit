import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Product and price mapping
const TIER_PRODUCTS = {
  premium: {
    monthly: { product_id: "prod_TY2MOQ5r4jvvuO", price_id: "price_1SYUhnCqNxHTprKBLJ7j1pBW" },
    annual: { product_id: "prod_TY2NnrRNxrpsyC", price_id: "price_1SYUiSCqNxHTprKBtHYqNYrH" },
  },
  expert: {
    monthly: { product_id: "prod_TZZ1CE1G03xadZ", price_id: "price_1ScPt8CqNxHTprKBcSzg2cLY" },
    annual: { product_id: "prod_TZZqIkF9Q92w4v", price_id: "price_1ScQgmCqNxHTprKBMfxUKi0m" },
  },
};

type TierType = "premium" | "expert";
type PlanType = "monthly" | "annual";

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
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { newTier, newPlanType } = await req.json() as { newTier: TierType; newPlanType: PlanType };
    logStep("Request payload", { newTier, newPlanType });

    if (!TIER_PRODUCTS[newTier] || !TIER_PRODUCTS[newTier][newPlanType]) {
      throw new Error("Invalid tier or plan type");
    }

    const newPriceId = TIER_PRODUCTS[newTier][newPlanType].price_id;
    logStep("Target price determined", { newPriceId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription found");
    }

    const subscription = subscriptions.data[0];
    const currentPriceId = subscription.items.data[0].price.id;
    const currentProductId = subscription.items.data[0].price.product as string;
    logStep("Current subscription", { subscriptionId: subscription.id, currentPriceId, currentProductId });

    // Determine if this is an upgrade or downgrade
    const tierOrder = { premium: 1, expert: 2 };
    let currentTier: TierType = "premium";
    
    // Find current tier based on product ID
    for (const [tier, plans] of Object.entries(TIER_PRODUCTS)) {
      for (const [, plan] of Object.entries(plans)) {
        if (plan.product_id === currentProductId) {
          currentTier = tier as TierType;
          break;
        }
      }
    }

    const isUpgrade = tierOrder[newTier] > tierOrder[currentTier];
    const isDowngrade = tierOrder[newTier] < tierOrder[currentTier];
    const isSameTierPlanChange = newTier === currentTier && currentPriceId !== newPriceId;
    
    logStep("Change type determined", { currentTier, newTier, isUpgrade, isDowngrade, isSameTierPlanChange });

    if (currentPriceId === newPriceId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Vous êtes déjà sur ce plan" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    let updatedSubscription;
    let message: string;

    if (isUpgrade) {
      // Upgrade: apply immediately with proration
      updatedSubscription = await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'always_invoice',
      });
      message = `Votre abonnement a été mis à niveau vers ${newTier === 'expert' ? 'Expert' : 'Premium'}. Le prorata a été facturé.`;
      logStep("Upgrade applied immediately", { newSubscriptionId: updatedSubscription.id });
    } else if (isDowngrade) {
      // Downgrade: schedule for end of period
      updatedSubscription = await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none',
      });
      const endDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      message = `Votre abonnement passera à ${newTier === 'premium' ? 'Premium' : 'Standard'} le ${endDate}.`;
      logStep("Downgrade scheduled", { effectiveDate: endDate });
    } else if (isSameTierPlanChange) {
      // Same tier, different billing cycle (monthly <-> annual)
      updatedSubscription = await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'always_invoice',
      });
      message = `Votre cycle de facturation a été modifié.`;
      logStep("Billing cycle changed", { newPriceId });
    } else {
      throw new Error("Unable to determine change type");
    }

    return new Response(JSON.stringify({
      success: true,
      message,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in update-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
