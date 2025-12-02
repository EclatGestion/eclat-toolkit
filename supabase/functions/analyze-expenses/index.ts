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

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    console.log("Analyzing expenses from PDF:", fileName);
    console.log("Text content length:", pdfContent.length, "characters");

    // Prompt optimisé pour texte brut (plus court = moins de tokens)
    const systemPrompt = `Analyse ce texte brut extrait d'un relevé bancaire.
Ignore les en-têtes répétés et mentions légales.
Catégories: ${EXPENSE_CATEGORIES.join(", ")}

Réponds UNIQUEMENT en JSON:
{
  "transactions": [{"date": "DD/MM/YYYY", "label": "description", "amount": -123.45, "category": "Catégorie"}],
  "categorizedExpenses": [{"category": "Catégorie", "total": 123.45, "count": 5, "percentage": 25.5}],
  "topExpenses": [{"label": "description", "amount": -123.45, "category": "Catégorie", "date": "DD/MM/YYYY"}],
  "recommendations": [{"title": "Titre", "description": "Description", "potentialSavings": 50, "priority": "high"}],
  "totalExpenses": 1234.56,
  "period": "Janvier 2024"
}

Données brutes du relevé:
${pdfContent}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Google Gemini API error: ${response.status}`);
    }

    const geminiResponse = await response.json();
    console.log("Gemini Response received");

    const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("Invalid Gemini response format");
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
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
