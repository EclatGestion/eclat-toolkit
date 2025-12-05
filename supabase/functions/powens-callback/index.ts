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

    if (error) {
      // Redirect to frontend with error
      const frontendUrl = Deno.env.get("SUPABASE_URL")?.includes("localhost") 
        ? "http://localhost:5173" 
        : "https://eclat-toolkit.lovable.app";
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

    // Find the Powens user by looking for recent users (since we don't have state param reliably)
    // In production, you'd pass the user_id in the state parameter
    const { data: powensUsers } = await supabaseAdmin
      .from("powens_users")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(10);

    if (!powensUsers || powensUsers.length === 0) {
      throw new Error("No Powens users found");
    }

    // Try to find which user this connection belongs to
    let matchedUser = null;
    let connectionDetails = null;

    for (const pu of powensUsers) {
      if (!pu.access_token) continue;

      try {
        // Get connection details using this user's token
        const connResponse = await fetch(`https://${powensDomain}/users/me/connections/${connectionId}`, {
          headers: { "Authorization": `Bearer ${pu.access_token}` },
        });

        if (connResponse.ok) {
          connectionDetails = await connResponse.json();
          matchedUser = pu;
          console.log("✅ Found matching user:", pu.user_id);
          break;
        }
      } catch (e) {
        // This user doesn't own this connection, continue
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
        const connectorResponse = await fetch(`https://${powensDomain}/connectors/${connectionDetails.id_connector}`, {
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
    const frontendUrl = Deno.env.get("SUPABASE_URL")?.includes("localhost") 
      ? "http://localhost:5173" 
      : "https://eclat-toolkit.lovable.app";
    
    return Response.redirect(`${frontendUrl}/powens-callback?success=true&bank=${encodeURIComponent(bankName)}`, 302);

  } catch (error) {
    console.error("❌ Error in powens-callback:", error);
    
    const frontendUrl = Deno.env.get("SUPABASE_URL")?.includes("localhost") 
      ? "http://localhost:5173" 
      : "https://eclat-toolkit.lovable.app";
    
    return Response.redirect(`${frontendUrl}/powens-callback?error=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`, 302);
  }
});
