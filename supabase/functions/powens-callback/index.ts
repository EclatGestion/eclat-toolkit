import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Get connection_id from query params (Powens redirects with this)
    const connectionId = url.searchParams.get("connection_id");
    const userId = url.searchParams.get("state"); // We can pass user ID as state
    const error = url.searchParams.get("error");

    console.log("📥 Callback received:", { connectionId, userId, error });

    // Get frontend URL from environment or fallback
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://eclat-toolkit.lovable.app";

    if (error) {
      // Redirect to frontend with error
      return Response.redirect(`${frontendUrl}/powens-callback?error=${encodeURIComponent(error)}`, 302);
    }

    if (!connectionId) {
      throw new Error("Missing connection_id in callback");
    }

    // Get Powens credentials
    let powensDomain = Deno.env.get("POWENS_DOMAIN") ?? "";
    powensDomain = powensDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let matchedUser = null;
    let connectionDetails = null;

    // Priority 1: Use state parameter (user_id) if available
    if (userId) {
      console.log("🔍 Looking for user via state parameter:", userId);
      const { data: powensUser } = await supabaseAdmin
        .from("powens_users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (powensUser && powensUser.access_token) {
        // Verify connection belongs to this user
        const connResponse = await fetch(`https://${powensDomain}/2.0/users/me/connections/${connectionId}`, {
          headers: { "Authorization": `Bearer ${powensUser.access_token}` },
        });

        if (connResponse.ok) {
          connectionDetails = await connResponse.json();
          matchedUser = powensUser;
          console.log("✅ Found user via state parameter:", userId);
        }
      }
    }

    // Priority 2: Fallback to searching recent users
    if (!matchedUser) {
      console.log("🔍 Fallback: searching recent Powens users...");
      const { data: powensUsers } = await supabaseAdmin
        .from("powens_users")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (!powensUsers || powensUsers.length === 0) {
        throw new Error("No Powens users found");
      }

      for (const pu of powensUsers) {
        if (!pu.access_token) continue;

        try {
          const connResponse = await fetch(`https://${powensDomain}/2.0/users/me/connections/${connectionId}`, {
            headers: { "Authorization": `Bearer ${pu.access_token}` },
          });

          if (connResponse.ok) {
            connectionDetails = await connResponse.json();
            matchedUser = pu;
            console.log("✅ Found matching user via fallback:", pu.user_id);
            break;
          }
        } catch (e) {
          // This user doesn't own this connection, continue
        }
      }
    }

    if (!matchedUser || !connectionDetails) {
      throw new Error("Could not find user for this connection");
    }

    // Get bank info from connector
    let bankName = "Banque connectée";
    let bankLogo = null;

    if (connectionDetails.id_connector) {
      try {
        const connectorResponse = await fetch(`https://${powensDomain}/2.0/connectors/${connectionDetails.id_connector}`, {
          headers: { "Authorization": `Bearer ${matchedUser.access_token}` },
        });
        if (connectorResponse.ok) {
          const connector = await connectorResponse.json();
          bankName = connector.name || bankName;
          bankLogo = connector.logo || null;
        }
      } catch (e) {
        console.log("Could not fetch connector details:", e);
      }
    }

    // Save bank connection
    const { error: insertError } = await supabaseAdmin
      .from("bank_connections")
      .upsert({
        user_id: matchedUser.user_id,
        powens_connection_id: parseInt(connectionId),
        bank_name: bankName,
        bank_logo_url: bankLogo,
        status: connectionDetails.state || "active",
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,powens_connection_id",
      });

    if (insertError) {
      console.error("Error saving bank connection:", insertError);
    }

    console.log("✅ Bank connection saved:", bankName);

    // Redirect to frontend success page
    return Response.redirect(`${frontendUrl}/powens-callback?success=true&bank=${encodeURIComponent(bankName)}`, 302);

  } catch (error) {
    console.error("❌ Error in powens-callback:", error);
    
    const errorFrontendUrl = Deno.env.get("FRONTEND_URL") || "https://eclat-toolkit.lovable.app";
    return Response.redirect(`${errorFrontendUrl}/powens-callback?error=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`, 302);
  }
});
