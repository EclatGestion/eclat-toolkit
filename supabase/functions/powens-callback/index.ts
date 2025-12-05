import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POWENS_DOMAIN = Deno.env.get("POWENS_DOMAIN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

    const { connectionId } = await req.json();

    if (!connectionId) {
      throw new Error("Missing connection ID");
    }

    console.log("[POWENS-CALLBACK] Processing connection:", connectionId);

    // Get Powens user data
    const { data: powensUser, error: powensError } = await supabase
      .from("powens_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (powensError || !powensUser) {
      throw new Error("Powens user not found");
    }

    // Get connection details from Powens API
    const connectionResponse = await fetch(
      `https://${POWENS_DOMAIN}/users/${powensUser.powens_user_id}/connections/${connectionId}`,
      {
        headers: {
          "Authorization": `Bearer ${powensUser.access_token}`,
        },
      }
    );

    if (!connectionResponse.ok) {
      const errorText = await connectionResponse.text();
      console.error("[POWENS-CALLBACK] Connection fetch error:", errorText);
      throw new Error("Failed to fetch connection details");
    }

    const connectionData = await connectionResponse.json();
    console.log("[POWENS-CALLBACK] Connection data:", connectionData);

    // Get connector info for bank name and logo
    let bankName = "Banque connectée";
    let bankLogo = null;

    if (connectionData.id_connector) {
      const connectorResponse = await fetch(
        `https://${POWENS_DOMAIN}/connectors/${connectionData.id_connector}`,
        {
          headers: {
            "Authorization": `Bearer ${powensUser.access_token}`,
          },
        }
      );

      if (connectorResponse.ok) {
        const connectorData = await connectorResponse.json();
        bankName = connectorData.name || bankName;
        bankLogo = connectorData.logo || null;
      }
    }

    // Save bank connection
    const { error: insertError } = await supabase
      .from("bank_connections")
      .upsert({
        user_id: user.id,
        powens_connection_id: parseInt(connectionId),
        bank_name: bankName,
        bank_logo_url: bankLogo,
        status: connectionData.state || "active",
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,powens_connection_id",
      });

    if (insertError) {
      console.error("[POWENS-CALLBACK] Insert error:", insertError);
      throw new Error("Failed to save bank connection");
    }

    console.log("[POWENS-CALLBACK] Connection saved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        bankName,
        connectionId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POWENS-CALLBACK] Error:", error);
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
