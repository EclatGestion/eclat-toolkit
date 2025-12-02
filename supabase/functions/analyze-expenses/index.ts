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

    // Call Lovable AI with tool calling for structured output
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en analyse financière. Analyse le relevé bancaire fourni et extrais les informations structurées.
            
Catégories disponibles: ${EXPENSE_CATEGORIES.join(", ")}

Instructions:
1. Identifie toutes les transactions (dépenses uniquement, montants négatifs)
2. Classe chaque transaction dans une catégorie
3. Calcule le total par catégorie
4. Identifie le top 5 des plus grosses dépenses
5. Génère 3-5 recommandations personnalisées pour optimiser les dépenses

Sois précis et pertinent dans ton analyse.`
          },
          {
            role: "user",
            content: `Voici le contenu du relevé bancaire à analyser:\n\n${pdfContent}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_bank_statement",
              description: "Analyse structurée d'un relevé bancaire avec catégorisation des dépenses",
              parameters: {
                type: "object",
                properties: {
                  transactions: {
                    type: "array",
                    description: "Liste des transactions extraites",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", description: "Date de la transaction (DD/MM/YYYY)" },
                        label: { type: "string", description: "Libellé de la transaction" },
                        amount: { type: "number", description: "Montant (négatif pour les dépenses)" },
                        category: { 
                          type: "string", 
                          enum: EXPENSE_CATEGORIES,
                          description: "Catégorie de la dépense" 
                        }
                      },
                      required: ["date", "label", "amount", "category"]
                    }
                  },
                  categorizedExpenses: {
                    type: "array",
                    description: "Dépenses agrégées par catégorie",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        total: { type: "number", description: "Total des dépenses pour cette catégorie" },
                        count: { type: "number", description: "Nombre de transactions" },
                        percentage: { type: "number", description: "Pourcentage du total des dépenses" }
                      },
                      required: ["category", "total", "count", "percentage"]
                    }
                  },
                  topExpenses: {
                    type: "array",
                    description: "Top 5 des plus grosses dépenses",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        amount: { type: "number" },
                        category: { type: "string" },
                        date: { type: "string" }
                      },
                      required: ["label", "amount", "category", "date"]
                    }
                  },
                  recommendations: {
                    type: "array",
                    description: "Recommandations personnalisées pour optimiser les dépenses",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Titre court de la recommandation" },
                        description: { type: "string", description: "Description détaillée" },
                        potentialSavings: { type: "number", description: "Économie potentielle estimée en euros" },
                        priority: { 
                          type: "string", 
                          enum: ["high", "medium", "low"],
                          description: "Priorité de la recommandation" 
                        }
                      },
                      required: ["title", "description", "priority"]
                    }
                  },
                  totalExpenses: {
                    type: "number",
                    description: "Total des dépenses du relevé"
                  },
                  period: {
                    type: "string",
                    description: "Période couverte par le relevé (ex: Janvier 2024)"
                  }
                },
                required: ["transactions", "categorizedExpenses", "topExpenses", "recommendations", "totalExpenses"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_bank_statement" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Veuillez ajouter des crédits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "analyze_bank_statement") {
      throw new Error("Invalid AI response format");
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    console.log("Analysis complete:", {
      transactionCount: analysisResult.transactions?.length,
      categoriesCount: analysisResult.categorizedExpenses?.length,
      totalExpenses: analysisResult.totalExpenses
    });

    // Save to database if user is authenticated
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
