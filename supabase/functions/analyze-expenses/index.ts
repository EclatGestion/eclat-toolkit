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
  "Divers"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, userId, fileName } = await req.json();
    
    if (!pdfContent) {
      throw new Error("PDF content is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing expenses from PDF:", fileName);
    console.log("Text content length:", pdfContent.length, "characters");

    // Prompt optimisé pour texte brut
    const systemPrompt = `Tu es un expert financier. Analyse ce relevé bancaire et extrait les dépenses (montants NÉGATIFS uniquement).

RÈGLES IMPORTANTES:
- Chaque transaction a un montant UNIQUE et DIFFÉRENT - ne jamais inventer ou dupliquer les montants
- Les montants sont généralement au format "123,45" ou "-123,45" dans le texte
- Pour topExpenses: trie les 5 plus GROSSES dépenses par montant absolu (pas les mêmes montants!)
- Utilise les montants EXACTS du relevé

Catégories: ${EXPENSE_CATEGORIES.join(", ")}`;

    const userPrompt = `Analyse ce relevé bancaire et retourne un JSON avec cette structure exacte:
{
  "transactions": [{"date": "DD/MM/YYYY", "label": "description", "amount": -123.45, "category": "Catégorie"}],
  "categorizedExpenses": [{"category": "Catégorie", "total": 123.45, "count": 5, "percentage": 25.5}],
  "topExpenses": [{"label": "description exacte", "amount": -543.21, "category": "Catégorie", "date": "DD/MM/YYYY"}],
  "recommendations": [{"title": "Titre", "description": "Conseil", "potentialSavings": 50, "priority": "high"}],
  "totalExpenses": 1234.56,
  "period": "Mois Année"
}

Relevé bancaire:
${pdfContent}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits épuisés. Veuillez recharger votre compte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    const responseText = aiResponse.choices?.[0]?.message?.content;
    if (!responseText) {
      throw new Error("Invalid AI response format");
    }

    let analysisResult;
    try {
      // Strip markdown code blocks if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();
      
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Analysis complete:", {
      transactionCount: analysisResult.transactions?.length,
      categoriesCount: analysisResult.categorizedExpenses?.length,
      totalExpenses: analysisResult.totalExpenses
    });

    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: dbError } = await supabase
        .from("expense_analyses")
        .insert({
          user_id: userId,
          file_name: fileName,
          source: "pdf",
          raw_transactions: analysisResult.transactions,
          categorized_expenses: analysisResult.categorizedExpenses,
          top_expenses: analysisResult.topExpenses,
          recommendations: analysisResult.recommendations,
          total_amount: Math.abs(analysisResult.totalExpenses || 0)
        });

      if (dbError) {
        console.error("Database error:", dbError);
      } else {
        console.log("Analysis saved to database");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: analysisResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-expenses:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erreur lors de l'analyse" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
