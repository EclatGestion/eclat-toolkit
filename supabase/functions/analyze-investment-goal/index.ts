import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 5000;

// Règles d'allocation d'actifs par type d'objectif
const ALLOCATION_RULES: Record<string, { actions: number; obligations: number; fondsEuro: number; scpi: number }> = {
  "rp_court": { actions: 10, obligations: 30, fondsEuro: 60, scpi: 0 },
  "rp_moyen": { actions: 50, obligations: 50, fondsEuro: 0, scpi: 0 },
  "retraite": { actions: 70, obligations: 20, fondsEuro: 0, scpi: 10 },
  "revenus_passifs": { actions: 20, obligations: 20, fondsEuro: 10, scpi: 50 },
  "education": { actions: 70, obligations: 30, fondsEuro: 0, scpi: 0 },
  "capital": { actions: 60, obligations: 30, fondsEuro: 10, scpi: 0 },
};

// Règles de répartition par enveloppes (AV prioritaire, peu de PEA)
const ENVELOPPE_RULES: Record<string, { av: number; per: number; pea: number; cto: number }> = {
  "court": { av: 85, per: 0, pea: 5, cto: 10 },
  "moyen": { av: 60, per: 25, pea: 10, cto: 5 },
  "long": { av: 45, per: 40, pea: 10, cto: 5 },
  "revenus_passifs": { av: 70, per: 15, pea: 5, cto: 10 },
};

// Rendements moyens par classe d'actifs
const RENDEMENTS = {
  actions: 0.085,
  obligations: 0.04,
  fondsEuro: 0.025,
  scpi: 0.05,
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GoalData {
  type: string | null;
  horizon: number | null;
  montantCible: number | null;
  age: number | null;
  capaciteEpargne: number | null;
  capitalInitial: number | null;
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
      console.error('[analyze-investment-goal] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, goalData } = await req.json() as { messages: Message[]; goalData: GoalData };
    
    // Input validation
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum ${MAX_MESSAGES} allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate individual messages
    for (const msg of messages) {
      if (!msg.content || typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Invalid message content. Maximum ${MAX_MESSAGE_LENGTH} characters per message.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Validate goalData numeric fields if present
    if (goalData) {
      const numericFields = ['horizon', 'montantCible', 'age', 'capaciteEpargne', 'capitalInitial'];
      for (const field of numericFields) {
        const value = goalData[field as keyof GoalData];
        if (value !== null && value !== undefined) {
          if (typeof value !== 'number' || value < 0 || value > 100_000_000_000) {
            return new Response(
              JSON.stringify({ error: `Invalid ${field}: must be a reasonable positive number` }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }
    }

    console.log(`[analyze-investment-goal] User ${user.id} analyzing goal`);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[analyze-investment-goal] LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Tu es un conseiller en gestion de patrimoine expert et bienveillant chez Éclat Toolkit.
Tu aides les utilisateurs à définir leur stratégie d'investissement basée sur leurs objectifs de vie.

MISSION:
1. Analyser le message de l'utilisateur pour extraire son objectif financier
2. Identifier les informations présentes et manquantes
3. Poser des questions de clarification si nécessaire
4. Une fois toutes les infos collectées, proposer une stratégie

INFORMATIONS À COLLECTER:
- Type d'objectif: résidence principale (rp), retraite, revenus passifs, éducation enfants, constitution capital
- Horizon: nombre d'années avant l'objectif
- Montant cible: somme visée ou revenu mensuel souhaité
- Âge: pour personnaliser les conseils
- Capacité d'épargne mensuelle: montant disponible chaque mois
- Capital initial: épargne déjà disponible

DONNÉES DÉJÀ COLLECTÉES:
${JSON.stringify(goalData, null, 2)}

INSTRUCTIONS:
- Si des données sont manquantes, pose UNE question claire et engageante
- Sois chaleureux et professionnel, style private banking
- Utilise des emojis avec parcimonie (1-2 max)
- Quand tu as TOUTES les informations (type, horizon, montantCible, capaciteEpargne), réponds EXACTEMENT avec ce format JSON:

{
  "complete": true,
  "goalData": {
    "type": "retraite|rp|revenus_passifs|education|capital",
    "horizon": <nombre_annees>,
    "montantCible": <montant_euros>,
    "age": <age_ou_null>,
    "capaciteEpargne": <mensuel_euros>,
    "capitalInitial": <capital_initial_ou_0>
  },
  "summary": "Résumé élégant de l'objectif en 1-2 phrases"
}

Si des infos manquent, réponds en texte normal avec ta question.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans quelques instants." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits épuisés, veuillez recharger votre compte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", aiMessage);

    // Vérifier si l'IA a retourné un JSON complet
    let parsedResult = null;
    try {
      // Chercher un bloc JSON dans la réponse
      const jsonMatch = aiMessage.match(/\{[\s\S]*"complete"[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Pas de JSON complet dans la réponse");
    }

    if (parsedResult?.complete && parsedResult?.goalData) {
      // Calculs d'allocation
      const goal = parsedResult.goalData;
      const horizonCategory = goal.horizon <= 5 ? "court" : goal.horizon <= 15 ? "moyen" : "long";
      
      let allocationType = "capital";
      if (goal.type === "rp" && goal.horizon <= 5) allocationType = "rp_court";
      else if (goal.type === "rp") allocationType = "rp_moyen";
      else if (goal.type === "retraite") allocationType = "retraite";
      else if (goal.type === "revenus_passifs") allocationType = "revenus_passifs";
      else if (goal.type === "education") allocationType = "education";

      const allocation = ALLOCATION_RULES[allocationType] || ALLOCATION_RULES["capital"];
      const enveloppes = goal.type === "revenus_passifs" 
        ? ENVELOPPE_RULES["revenus_passifs"] 
        : ENVELOPPE_RULES[horizonCategory];

      // Calcul du rendement pondéré
      const rendementPondere = 
        (allocation.actions / 100 * RENDEMENTS.actions) +
        (allocation.obligations / 100 * RENDEMENTS.obligations) +
        (allocation.fondsEuro / 100 * RENDEMENTS.fondsEuro) +
        (allocation.scpi / 100 * RENDEMENTS.scpi);

      // Projection du capital
      const n = goal.horizon;
      const r = rendementPondere;
      const capitalInitial = goal.capitalInitial || 0;
      const versementMensuel = goal.capaciteEpargne || 0;
      const versementAnnuel = versementMensuel * 12;

      // Formule: capitalFinal = CI * (1+r)^n + VA * ((1+r)^n - 1) / r
      const facteurCroissance = Math.pow(1 + r, n);
      const capitalFinal = capitalInitial * facteurCroissance + 
        (r > 0 ? versementAnnuel * (facteurCroissance - 1) / r : versementAnnuel * n);

      // Calcul du versement mensuel recommandé pour atteindre l'objectif
      const montantCible = goal.montantCible || 0;
      const capitalManquant = Math.max(0, montantCible - capitalInitial * facteurCroissance);
      const versementAnnuelRecommande = r > 0 
        ? capitalManquant * r / (facteurCroissance - 1)
        : capitalManquant / n;
      const versementMensuelRecommande = Math.ceil(versementAnnuelRecommande / 12);

      // Probabilité de succès simplifiée
      const probabiliteSucces = Math.min(100, Math.round((capitalFinal / montantCible) * 100));

      // Projection année par année
      const projection: Array<{ annee: number; capital: number; versements: number }> = [];
      let capitalCumule = capitalInitial;
      let versementsCumules = capitalInitial;
      for (let i = 0; i <= n; i++) {
        projection.push({
          annee: i,
          capital: Math.round(capitalCumule),
          versements: Math.round(versementsCumules),
        });
        capitalCumule = capitalCumule * (1 + r) + versementAnnuel;
        versementsCumules += versementAnnuel;
      }

      // Plan d'action
      const actionPlan = generateActionPlan(goal, allocation, enveloppes, versementMensuelRecommande);

      return new Response(JSON.stringify({
        complete: true,
        message: parsedResult.summary,
        goalData: goal,
        results: {
          allocation,
          enveloppes,
          rendementPondere: Math.round(rendementPondere * 1000) / 10,
          capitalFinal: Math.round(capitalFinal),
          versementMensuelRecommande,
          probabiliteSucces,
          projection,
          actionPlan,
        },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sinon retourner le message de l'IA (question de clarification)
    return new Response(JSON.stringify({
      complete: false,
      message: aiMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-investment-goal:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Une erreur est survenue" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateActionPlan(
  goal: GoalData, 
  allocation: { actions: number; obligations: number; fondsEuro: number; scpi: number },
  enveloppes: { av: number; per: number; pea: number; cto: number },
  versementRecommande: number
): Array<{ mois: number; action: string; priorite: 'haute' | 'moyenne' | 'basse'; categorie: string }> {
  const plan: Array<{ mois: number; action: string; priorite: 'haute' | 'moyenne' | 'basse'; categorie: string }> = [];
  
  // Mois 1-2: Ouverture des enveloppes
  if (enveloppes.av > 0) {
    plan.push({ mois: 1, action: "Ouvrir une assurance-vie multisupport", priorite: "haute", categorie: "Enveloppes" });
  }
  if (enveloppes.per > 20) {
    plan.push({ mois: 1, action: "Ouvrir un Plan d'Épargne Retraite (PER)", priorite: "haute", categorie: "Enveloppes" });
  }
  if (enveloppes.pea > 0) {
    plan.push({ mois: 2, action: "Ouvrir un PEA pour les actions long terme", priorite: "moyenne", categorie: "Enveloppes" });
  }

  // Mois 2-3: Allocation initiale
  if (goal.capitalInitial && goal.capitalInitial > 0) {
    plan.push({ mois: 2, action: `Investir le capital initial (${goal.capitalInitial.toLocaleString('fr-FR')}€) selon l'allocation cible`, priorite: "haute", categorie: "Investissement" });
  }

  // Mois 3: Mise en place des versements
  plan.push({ 
    mois: 3, 
    action: `Mettre en place un virement automatique de ${versementRecommande.toLocaleString('fr-FR')}€/mois`, 
    priorite: "haute", 
    categorie: "Épargne" 
  });

  // Mois 4-6: Allocation par classe d'actifs
  if (allocation.fondsEuro > 0) {
    plan.push({ mois: 4, action: `Placer ${allocation.fondsEuro}% en fonds euros (sécurité)`, priorite: "moyenne", categorie: "Allocation" });
  }
  if (allocation.obligations > 0) {
    plan.push({ mois: 4, action: `Investir ${allocation.obligations}% en obligations (stabilité)`, priorite: "moyenne", categorie: "Allocation" });
  }
  if (allocation.actions > 0) {
    plan.push({ mois: 5, action: `Investir ${allocation.actions}% en actions/ETF (croissance)`, priorite: "moyenne", categorie: "Allocation" });
  }
  if (allocation.scpi > 0) {
    plan.push({ mois: 6, action: `Investir ${allocation.scpi}% en SCPI (immobilier papier)`, priorite: "moyenne", categorie: "Allocation" });
  }

  // Mois 6-12: Suivi et optimisation
  plan.push({ mois: 6, action: "Premier bilan de performance et ajustements", priorite: "moyenne", categorie: "Suivi" });
  
  if (goal.type === "retraite" && enveloppes.per > 0) {
    plan.push({ mois: 10, action: "Optimiser les versements PER avant fin d'année fiscale", priorite: "haute", categorie: "Fiscalité" });
  }

  plan.push({ mois: 12, action: "Bilan annuel complet et rééquilibrage du portefeuille", priorite: "haute", categorie: "Suivi" });

  // Conseils spécifiques par objectif
  if (goal.type === "rp" && goal.horizon && goal.horizon <= 5) {
    plan.push({ mois: 8, action: "Sécuriser progressivement vers fonds euros (glissement)", priorite: "haute", categorie: "Sécurisation" });
  }

  if (goal.type === "revenus_passifs") {
    plan.push({ mois: 7, action: "Sélectionner des SCPI à haut rendement (4-6%)", priorite: "haute", categorie: "Revenus" });
  }

  return plan.sort((a, b) => a.mois - b.mois);
}
