import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EXPORT-USER-DATA] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not found");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Collect all user data from all tables
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      emailConfirmedAt: user.email_confirmed_at,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
    };

    // Profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    exportData.profile = profile;
    logStep("Exported profile");

    // Assets
    const { data: assets } = await supabaseAdmin
      .from("assets")
      .select("*")
      .eq("user_id", user.id);
    exportData.assets = assets || [];
    logStep("Exported assets", { count: assets?.length || 0 });

    // Incomes
    const { data: incomes } = await supabaseAdmin
      .from("incomes")
      .select("*")
      .eq("user_id", user.id);
    exportData.incomes = incomes || [];
    logStep("Exported incomes", { count: incomes?.length || 0 });

    // Expenses
    const { data: expenses } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);
    exportData.expenses = expenses || [];
    logStep("Exported expenses", { count: expenses?.length || 0 });

    // Diagnostic results
    const { data: diagnostics } = await supabaseAdmin
      .from("diagnostic_results")
      .select("*")
      .eq("user_id", user.id);
    exportData.diagnostics = diagnostics || [];
    logStep("Exported diagnostics", { count: diagnostics?.length || 0 });

    // Saved simulations
    const { data: simulations } = await supabaseAdmin
      .from("saved_simulations")
      .select("*")
      .eq("user_id", user.id);
    exportData.savedSimulations = simulations || [];
    logStep("Exported simulations", { count: simulations?.length || 0 });

    // Expense analyses
    const { data: expenseAnalyses } = await supabaseAdmin
      .from("expense_analyses")
      .select("*")
      .eq("user_id", user.id);
    exportData.expenseAnalyses = expenseAnalyses || [];
    logStep("Exported expense analyses", { count: expenseAnalyses?.length || 0 });

    // Recommendation status
    const { data: recommendations } = await supabaseAdmin
      .from("recommendation_status")
      .select("*")
      .eq("user_id", user.id);
    exportData.recommendationStatus = recommendations || [];
    logStep("Exported recommendations", { count: recommendations?.length || 0 });

    logStep("Export complete");

    return new Response(
      JSON.stringify(exportData, null, 2),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="eclat-data-export-${new Date().toISOString().split('T')[0]}.json"`
        },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
