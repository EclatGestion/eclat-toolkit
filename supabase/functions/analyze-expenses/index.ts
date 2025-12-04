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

interface ParsedTransaction {
  date: string;
  label: string;
  amount: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, transactions, userId, fileName, source } = await req.json();
    
    // Support both PDF (legacy) and CSV (new structured format)
    const isCSV = source === "csv" && Array.isArray(transactions);
    
    if (!pdfContent && !isCSV) {
      throw new Error("PDF content or transactions array is required");
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    console.log("Analyzing expenses from:", source || "pdf", "- File:", fileName);
    
    let systemPrompt: string;
    
    if (isCSV) {
      // Optimized prompt for structured CSV data - much fewer tokens!
      const txList = (transactions as ParsedTransaction[])
        .map(t => `${t.date}|${t.label}|${t.amount}`)
        .join("\n");
      
      console.log("Processing", transactions.length, "structured transactions");
      
      systemPrompt = `Tu es un expert financier. Voici une liste de dépenses extraites d'un relevé bancaire (format: date|libellé|montant).

TÂCHES:
1. Catégorise chaque transaction dans une des catégories: ${EXPENSE_CATEGORIES.join(", ")}
2. Calcule les totaux par catégorie avec pourcentages
3. Identifie les 5 plus grosses dépenses (par montant absolu)
4. Génère 2-3 recommandations d'économies personnalisées

TRANSACTIONS:
${txList}

Réponds en JSON STRICT:
{
  "transactions": [{"date": "YYYY-MM-DD", "label": "description", "amount": -123.45, "category": "Catégorie"}],
  "categorizedExpenses": [{"category": "Catégorie", "total": 123.45, "count": 5, "percentage": 25.5}],
  "topExpenses": [{"label": "description", "amount": -543.21, "category": "Catégorie", "date": "YYYY-MM-DD"}],
  "recommendations": [{"title": "Titre", "description": "Conseil actionnable", "potentialSavings": 50, "priority": "high|medium|low"}],
  "totalExpenses": 1234.56,
  "period": "Période analysée"
}`;
    } else {
      // Legacy PDF prompt
      console.log("Text content length:", pdfContent.length, "characters");
      
      systemPrompt = `Tu es un expert financier. Analyse ce relevé bancaire et extrait les dépenses (montants NÉGATIFS uniquement).

RÈGLES IMPORTANTES:
- Chaque transaction a un montant UNIQUE et DIFFÉRENT - ne jamais inventer ou dupliquer les montants
- Les montants sont généralement au format "123,45" ou "-123,45" dans le texte
- Pour topExpenses: trie les 5 plus GROSSES dépenses par montant absolu (pas les mêmes montants!)
- Utilise les montants EXACTS du relevé

Catégories: ${EXPENSE_CATEGORIES.join(", ")}

Format JSON STRICT:
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
    }

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
