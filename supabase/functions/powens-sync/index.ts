import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXPENSE_CATEGORIES = [
  "Logement", "Alimentation", "Transport", "Santé", 
  "Loisirs", "Abonnements", "Shopping", "Épargne", "Divers"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get Powens credentials
    let powensDomain = Deno.env.get("POWENS_DOMAIN") ?? "";
    powensDomain = powensDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user's Powens credentials
    const { data: powensUser } = await supabaseAdmin
      .from("powens_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!powensUser?.access_token) {
      throw new Error("No Powens account linked");
    }

    // Get user's bank connections
    const { data: bankConnections } = await supabaseAdmin
      .from("bank_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (!bankConnections || bankConnections.length === 0) {
      throw new Error("No active bank connections");
    }

    console.log(`📊 Syncing ${bankConnections.length} bank connection(s)...`);

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const minDate = startDate.toISOString().split("T")[0];
    const maxDate = endDate.toISOString().split("T")[0];

    // Fetch transactions from Powens
    const transactionsUrl = `https://${powensDomain}/users/me/transactions?min_date=${minDate}&max_date=${maxDate}&limit=500`;
    
    console.log("📥 Fetching transactions...");
    const transResponse = await fetch(transactionsUrl, {
      headers: { "Authorization": `Bearer ${powensUser.access_token}` },
    });

    if (!transResponse.ok) {
      const errorText = await transResponse.text();
      console.error("Transactions fetch error:", errorText);
      throw new Error(`Failed to fetch transactions: ${transResponse.status}`);
    }

    const transData = await transResponse.json();
    const transactions = transData.transactions || [];
    
    console.log(`✅ Fetched ${transactions.length} transactions`);

    if (transactions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No transactions found for the period",
          data: null 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format transactions for AI analysis
    const formattedTransactions = transactions
      .filter((t: any) => t.value < 0) // Only expenses (negative amounts)
      .map((t: any) => ({
        date: t.date || t.rdate,
        label: t.original_wording || t.simplified_wording || t.wording,
        amount: Math.abs(t.value),
        category: t.id_category,
      }));

    console.log(`📤 Sending ${formattedTransactions.length} expenses to AI...`);

    // Call Lovable AI for categorization
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `Tu es un assistant d'analyse financière. Analyse les transactions bancaires et retourne un JSON avec:
1. categorizedExpenses: tableau avec {category, total, count, percentage} pour chaque catégorie (${EXPENSE_CATEGORIES.join(", ")})
2. topExpenses: les 5 plus grosses dépenses avec {label, amount, category, date}
3. recommendations: 2-3 conseils personnalisés avec {title, description, potentialSavings, priority: "high"|"medium"|"low"}
4. totalExpenses: total des dépenses

Réponds UNIQUEMENT avec du JSON valide, sans markdown.`;

    const userPrompt = `Analyse ces transactions bancaires:\n${JSON.stringify(formattedTransactions, null, 2)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI credits exhausted. Please add credits.");
      }
      throw new Error(`AI request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let analysisText = aiData.choices?.[0]?.message?.content || "";

    // Clean up potential markdown formatting
    analysisText = analysisText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    console.log("🤖 AI analysis received");

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error("Failed to parse AI response:", analysisText);
      throw new Error("Invalid AI response format");
    }

    // Get bank name for file_name field
    const bankName = bankConnections[0]?.bank_name || "Banque connectée";

    // Save analysis to database
    const { error: saveError } = await supabaseAdmin
      .from("expense_analyses")
      .insert({
        user_id: user.id,
        categorized_expenses: analysis.categorizedExpenses,
        top_expenses: analysis.topExpenses,
        recommendations: analysis.recommendations,
        total_amount: analysis.totalExpenses,
        raw_transactions: formattedTransactions,
        source: "bank",
        file_name: bankName,
        analysis_date: new Date().toISOString(),
      });

    if (saveError) {
      console.error("Error saving analysis:", saveError);
    }

    // Update last_sync_at for all connections
    await supabaseAdmin
      .from("bank_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("user_id", user.id);

    console.log("✅ Analysis saved successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analysis 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in powens-sync:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
