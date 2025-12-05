import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXPENSE_CATEGORIES = [
  "Logement",
  "Alimentation",
  "Transport",
  "Santé",
  "Loisirs",
  "Abonnements",
  "Shopping",
  "Épargne",
  "Divers",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let POWENS_DOMAIN = Deno.env.get("POWENS_DOMAIN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Clean domain: remove protocol and trailing slashes
    if (POWENS_DOMAIN) {
      POWENS_DOMAIN = POWENS_DOMAIN
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
    }

    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    console.log("[POWENS-SYNC] User:", user.id);

    // Get Powens user and connection
    const { data: powensUser, error: powensError } = await supabase
      .from("powens_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (powensError || !powensUser) {
      throw new Error("No Powens account found. Please connect your bank first.");
    }

    const { data: bankConnection, error: connectionError } = await supabase
      .from("bank_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (connectionError || !bankConnection) {
      throw new Error("No active bank connection found.");
    }

    console.log("[POWENS-SYNC] Fetching transactions for connection:", bankConnection.powens_connection_id);

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    // Fetch transactions from Powens
    const transactionsUrl = `https://${POWENS_DOMAIN}/users/${powensUser.powens_user_id}/transactions?` +
      `min_date=${formattedStartDate}&max_date=${formattedEndDate}&limit=500`;

    const transactionsResponse = await fetch(transactionsUrl, {
      headers: {
        "Authorization": `Bearer ${powensUser.access_token}`,
      },
    });

    if (!transactionsResponse.ok) {
      const errorText = await transactionsResponse.text();
      console.error("[POWENS-SYNC] Transactions fetch error:", errorText);
      throw new Error("Failed to fetch transactions from bank");
    }

    const transactionsData = await transactionsResponse.json();
    const transactions = transactionsData.transactions || [];

    console.log("[POWENS-SYNC] Fetched", transactions.length, "transactions");

    if (transactions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No transactions found for this period",
          data: null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format transactions for AI analysis
    const formattedTransactions = transactions
      .filter((t: any) => t.value < 0) // Only expenses (negative amounts)
      .map((t: any) => ({
        date: t.date || t.rdate,
        label: t.wording || t.original_wording || "Transaction",
        amount: Math.abs(t.value),
        category: t.id_category,
      }));

    console.log("[POWENS-SYNC] Formatted", formattedTransactions.length, "expense transactions");

    // Build prompt for AI analysis
    const transactionsText = formattedTransactions
      .map((t: any) => `${t.date}: ${t.label} - ${t.amount}€`)
      .join("\n");

    const systemPrompt = `Tu es un expert en analyse financière personnelle. Analyse ces transactions bancaires et fournis une réponse JSON structurée.

CATÉGORIES DISPONIBLES: ${EXPENSE_CATEGORIES.join(", ")}

Ta réponse doit être un JSON valide avec cette structure exacte:
{
  "categorizedExpenses": [
    {"category": "Nom", "total": 0, "count": 0, "percentage": 0}
  ],
  "topExpenses": [
    {"label": "Description", "amount": 0, "category": "Catégorie", "date": "YYYY-MM-DD"}
  ],
  "recommendations": [
    {"title": "Titre", "description": "Description détaillée", "potentialSavings": 0, "priority": "high|medium|low"}
  ],
  "totalExpenses": 0
}

Règles:
- Catégorise CHAQUE transaction dans une des catégories disponibles
- Les top 5 dépenses sont les transactions individuelles les plus élevées
- Donne 2-4 recommandations personnalisées basées sur les patterns observés
- Les montants doivent être positifs
- Les pourcentages doivent totaliser 100%`;

    const userPrompt = `Voici les transactions bancaires à analyser:\n\n${transactionsText}`;

    // Call Lovable AI for analysis
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
      const errorText = await aiResponse.text();
      console.error("[POWENS-SYNC] AI error:", errorText);

      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI credits exhausted. Please add more credits.");
      }
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("Empty AI response");
    }

    // Parse AI response
    let analysisResult;
    try {
      // Clean markdown formatting if present
      const cleanedContent = aiContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("[POWENS-SYNC] JSON parse error:", parseError);
      throw new Error("Failed to parse AI analysis");
    }

    console.log("[POWENS-SYNC] Analysis complete, saving to database");

    // Save analysis to database
    const { error: saveError } = await supabase
      .from("expense_analyses")
      .insert({
        user_id: user.id,
        source: "powens",
        file_name: bankConnection.bank_name,
        total_amount: analysisResult.totalExpenses,
        categorized_expenses: analysisResult.categorizedExpenses,
        top_expenses: analysisResult.topExpenses,
        recommendations: analysisResult.recommendations,
        raw_transactions: formattedTransactions,
      });

    if (saveError) {
      console.error("[POWENS-SYNC] Save error:", saveError);
    }

    // Update last sync timestamp
    await supabase
      .from("bank_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", bankConnection.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: analysisResult,
        source: "powens",
        bankName: bankConnection.bank_name,
        transactionCount: formattedTransactions.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POWENS-SYNC] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
