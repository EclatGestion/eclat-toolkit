import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helpers
function validateNumericRange(value: unknown, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

function validateBilanData(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid bilan data format' };
  }
  
  const d = data as Record<string, unknown>;
  
  // Validate score fields (0-100)
  const scoreFields = ['financesScore', 'epargneScore', 'immobilierScore', 'fiscaliteScore', 'transmissionScore', 'scoreGlobal'];
  for (const field of scoreFields) {
    if (d[field] !== undefined && !validateNumericRange(d[field], 0, 100)) {
      return { valid: false, error: `Invalid ${field}: must be between 0 and 100` };
    }
  }
  
  // Validate monetary fields (reasonable limits)
  const maxMoney = 100_000_000_000; // 100 billion max
  const moneyFields = ['revenus', 'depenses', 'epargneMensuelle', 'liquidites', 'assuranceVie', 'per', 'peaCto', 
                       'residencePrincipale', 'immobilierLocatif', 'loyersPercus', 'creditsImmo', 
                       'revenusImposables', 'patrimoineTotal', 'donationsRealisees'];
  for (const field of moneyFields) {
    if (d[field] !== undefined && !validateNumericRange(d[field], 0, maxMoney)) {
      return { valid: false, error: `Invalid ${field}: must be between 0 and ${maxMoney}` };
    }
  }
  
  // Validate percentage fields
  const percentFields = ['tauxEpargne', 'tauxEndettement', 'tmi'];
  for (const field of percentFields) {
    if (d[field] !== undefined && !validateNumericRange(d[field], 0, 100)) {
      return { valid: false, error: `Invalid ${field}: must be between 0 and 100` };
    }
  }
  
  return { valid: true };
}

interface BilanData {
  // Scores
  financesScore: number;
  epargneScore: number;
  immobilierScore: number;
  fiscaliteScore: number;
  transmissionScore: number;
  scoreGlobal: number;
  
  // Données brutes
  tauxEpargne: number;
  tauxEndettement: number;
  epargneMensuelle: number;
  revenus: number;
  depenses: number;
  
  // Répartition
  repartitionPatrimoine: {
    immobilier: number;
    financier: number;
    liquidites: number;
  };
  
  // Détails épargne
  liquidites: number;
  assuranceVie: number;
  per: number;
  peaCto: number;
  
  // Immobilier
  residencePrincipale: number;
  immobilierLocatif: number;
  loyersPercus: number;
  creditsImmo: number;
  
  // Fiscalité
  revenusImposables: number;
  tmi: number;
  perUtilise: boolean;
  lmnpUtilise: boolean;
  
  // Transmission
  situationFamiliale: string;
  nombreEnfants: number;
  patrimoineTotal: number;
  donationsRealisees: number;
  assuranceVieBeneficiaire: boolean;
}

interface Recommandation {
  titre: string;
  description: string;
  impact: string;
}

interface RecommandationsIA {
  haute: Recommandation[];
  moyenne: Recommandation[];
  longTerme: Recommandation[];
  synthese: string;
  planAction: {
    mois: string;
    action: string;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[GENERATE-BILAN-IA] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const bilanData = await req.json();
    
    // Input validation
    const validation = validateBilanData(bilanData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("[GENERATE-BILAN-IA] User", user.id, "requesting bilan analysis");
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[GENERATE-BILAN-IA] LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Tu es un conseiller en gestion de patrimoine certifié CGP expert en fiscalité française.

Analyse ce bilan patrimonial et génère des recommandations personnalisées et concrètes.

## DONNÉES DU CLIENT

### Scores (sur 100)
- Finances personnelles: ${bilanData.financesScore}/100
- Épargne & Investissements: ${bilanData.epargneScore}/100
- Immobilier: ${bilanData.immobilierScore}/100
- Fiscalité: ${bilanData.fiscaliteScore}/100
- Transmission: ${bilanData.transmissionScore}/100
- Score Global: ${bilanData.scoreGlobal}/100

### Finances Personnelles
- Revenus mensuels: ${bilanData.revenus}€
- Dépenses mensuelles: ${bilanData.depenses}€
- Épargne mensuelle: ${bilanData.epargneMensuelle}€
- Taux d'épargne: ${bilanData.tauxEpargne}%
- Taux d'endettement: ${bilanData.tauxEndettement}%

### Répartition du Patrimoine Total (${bilanData.patrimoineTotal}€)
- Immobilier: ${bilanData.repartitionPatrimoine.immobilier}%
- Financier: ${bilanData.repartitionPatrimoine.financier}%
- Liquidités: ${bilanData.repartitionPatrimoine.liquidites}%

### Épargne & Placements
- Liquidités: ${bilanData.liquidites}€
- Assurance-vie: ${bilanData.assuranceVie}€
- PER: ${bilanData.per}€
- PEA/CTO: ${bilanData.peaCto}€

### Immobilier
- Résidence principale: ${bilanData.residencePrincipale}€
- Immobilier locatif: ${bilanData.immobilierLocatif}€
- Loyers perçus mensuels: ${bilanData.loyersPercus}€
- Crédits immobiliers restants: ${bilanData.creditsImmo}€

### Fiscalité
- Revenus imposables: ${bilanData.revenusImposables}€
- TMI: ${bilanData.tmi}%
- PER utilisé: ${bilanData.perUtilise ? 'Oui' : 'Non'}
- LMNP utilisé: ${bilanData.lmnpUtilise ? 'Oui' : 'Non'}

### Transmission
- Situation familiale: ${bilanData.situationFamiliale}
- Nombre d'enfants: ${bilanData.nombreEnfants}
- Donations déjà réalisées: ${bilanData.donationsRealisees}€
- AV avec clause bénéficiaire: ${bilanData.assuranceVieBeneficiaire ? 'Oui' : 'Non'}

## CONSIGNES

Génère une analyse structurée au format JSON avec :

1. "synthese": Un paragraphe de 2-3 phrases résumant la situation globale et les axes d'amélioration prioritaires.

2. "haute": Array de 2-3 recommandations PRIORITAIRES (impact élevé + faible complexité)
   Chaque recommandation: { "titre": "...", "description": "explication détaillée en 2 phrases", "impact": "estimation chiffrée (€ ou %)" }

3. "moyenne": Array de 2-3 recommandations de priorité MOYENNE
   Même format

4. "longTerme": Array de 2 recommandations pour le LONG TERME
   Même format

5. "planAction": Array de 6 actions concrètes sur 12 mois
   Format: { "mois": "Mois 1-2", "action": "description courte" }

Réponds UNIQUEMENT avec le JSON valide, sans markdown ni explication.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Tu es un conseiller en gestion de patrimoine CGP. Tu réponds uniquement en JSON valide." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GENERATE-BILAN-IA] AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;
    
    console.log("[GENERATE-BILAN-IA] AI Response:", aiContent);

    // Parse the JSON response
    let recommandations: RecommandationsIA;
    try {
      // Clean the response (remove potential markdown code blocks)
      const cleanedContent = aiContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      recommandations = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("[GENERATE-BILAN-IA] JSON parse error:", parseError);
      // Fallback to default recommendations
      recommandations = {
        synthese: "Votre bilan patrimonial révèle des opportunités d'optimisation. Concentrez-vous sur l'augmentation de votre capacité d'épargne et la diversification de vos placements.",
        haute: [
          {
            titre: "Optimisez votre capacité d'épargne",
            description: "Avec un taux d'épargne actuel, il existe une marge de progression significative. Automatisez vos virements vers un compte épargne dédié.",
            impact: `+${Math.round(bilanData.revenus * 0.05)}€/mois potentiel`
          },
          {
            titre: "Diversifiez vos liquidités",
            description: "Une partie de vos liquidités pourrait être placée sur un fonds euros ou une assurance-vie pour générer des intérêts.",
            impact: "+2-3% de rendement annuel"
          }
        ],
        moyenne: [
          {
            titre: "Explorez les avantages du PER",
            description: "Le Plan d'Épargne Retraite permet de déduire vos versements de vos revenus imposables.",
            impact: `-${Math.round(bilanData.revenusImposables * 0.03 * bilanData.tmi / 100)}€ d'impôts`
          }
        ],
        longTerme: [
          {
            titre: "Préparez votre transmission",
            description: "Anticipez la transmission de votre patrimoine via des donations ou une assurance-vie avec clause bénéficiaire optimisée.",
            impact: "Réduction significative des droits de succession"
          }
        ],
        planAction: [
          { mois: "Mois 1-2", action: "Audit complet des charges et optimisation des dépenses" },
          { mois: "Mois 3-4", action: "Mise en place d'une épargne automatique" },
          { mois: "Mois 5-6", action: "Ouverture d'un PER ou versement sur existant" },
          { mois: "Mois 7-8", action: "Diversification des placements financiers" },
          { mois: "Mois 9-10", action: "Bilan fiscalité et optimisation IR" },
          { mois: "Mois 11-12", action: "Revue succession et clauses bénéficiaires" }
        ]
      };
    }

    console.log("[GENERATE-BILAN-IA] Returning recommendations");
    
    return new Response(JSON.stringify(recommandations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[GENERATE-BILAN-IA] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
