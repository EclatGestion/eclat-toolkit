import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      
      // Update profile to not premium
      await supabaseClient
        .from("profiles")
        .update({ is_premium: false })
        .eq("id", user.id);

      return new Response(JSON.stringify({ subscribed: false }), {
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

    // Accept both "active" and "trialing" subscriptions as valid premium
    // deno-lint-ignore no-explicit-any
    const validSubscriptions = subscriptions.data.filter(
      (sub: any) => sub.status === "active" || sub.status === "trialing"
    );
    const hasActiveSub = validSubscriptions.length > 0;
    let subscriptionEnd: string | null = null;
    let planType: string | null = null;

    if (hasActiveSub) {
      const subscription = validSubscriptions[0];
      // Use trial_end for trialing subscriptions, current_period_end for active
      const endTimestamp = subscription.status === "trialing" && subscription.trial_end 
        ? subscription.trial_end 
        : subscription.current_period_end;
      if (endTimestamp) {
        subscriptionEnd = new Date(endTimestamp * 1000).toISOString();
      }
      
      // Determine plan type based on interval
      const interval = subscription.items.data[0]?.price?.recurring?.interval;
      planType = interval === "year" ? "annual" : "monthly";
      
      logStep("Active subscription found", { subscriptionId: subscription.id, planType, endDate: subscriptionEnd });
    } else {
      logStep("No active subscription found");
    }

    // Update profile premium status
    await supabaseClient
      .from("profiles")
      .update({ is_premium: hasActiveSub })
      .eq("id", user.id);

    logStep("Profile updated", { is_premium: hasActiveSub });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan_type: planType,
      subscription_end: subscriptionEnd,
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
