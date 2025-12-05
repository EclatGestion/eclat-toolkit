import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Liste des emails administrateurs autorisés
const ADMIN_EMAILS = ["a.negro@eclat-gp.com"];

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[ADMIN-TOGGLE-PREMIUM] ${step}`, details ? JSON.stringify(details) : "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Starting admin premium toggle");

    // Vérifier que l'appelant est admin
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData.user) {
      logStep("Auth error", { error: authError?.message });
      throw new Error("Utilisateur non authentifié");
    }

    const adminEmail = userData.user.email;
    logStep("Admin check", { adminEmail, isAdmin: ADMIN_EMAILS.includes(adminEmail || "") });

    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
      throw new Error("Accès non autorisé - Admin uniquement");
    }

    // Récupérer les paramètres
    const { targetEmail, isPremium } = await req.json();
    logStep("Request params", { targetEmail, isPremium });

    if (!targetEmail) {
      throw new Error("Email cible requis");
    }

    // Mettre à jour le profil cible
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({ is_premium: isPremium })
      .eq("email", targetEmail)
      .select()
      .single();

    if (error) {
      logStep("Update error", { error: error.message });
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Aucun utilisateur trouvé avec l'email: ${targetEmail}`);
    }

    logStep("Success", { targetEmail, isPremium, profileId: data.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Premium ${isPremium ? "activé" : "désactivé"} pour ${targetEmail}`,
      profile: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    logStep("Error", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
