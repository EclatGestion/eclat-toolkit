import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify HMAC signature from state parameter
async function verifySignedState(signedState: string, secret: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const parts = signedState.split(':');
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid state format" };
    }

    const [userId, timestampStr, providedSignature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
      return { valid: false, error: "Invalid timestamp" };
    }

    // Check if state is expired (10 minutes = 600000ms)
    const now = Date.now();
    const age = now - timestamp;
    if (age > 600000) {
      return { valid: false, error: "State expired" };
    }

    // Check if timestamp is not in the future (with 30s tolerance for clock skew)
    if (timestamp > now + 30000) {
      return { valid: false, error: "Invalid timestamp (future)" };
    }

    // Verify HMAC signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${userId}:${timestampStr}`);
    const keyData = encoder.encode(secret);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const expectedSignature = await crypto.subtle.sign("HMAC", key, data);
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (providedSignature !== expectedSignatureHex) {
      return { valid: false, error: "Invalid signature" };
    }

    return { valid: true, userId };
  } catch (e) {
    console.error("Signature verification error:", e);
    return { valid: false, error: "Verification failed" };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get frontend URL from environment or fallback
  const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://eclat-toolkit.lovable.app";

  try {
    const url = new URL(req.url);
    
    // Get connection_id from query params (Powens redirects with this)
    const connectionId = url.searchParams.get("connection_id");
    const signedState = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    console.log("📥 Callback received:", { connectionId, hasState: !!signedState, error });

    if (error) {
      console.warn("⚠️ Callback error from Powens:", error);
      // Redirect to frontend with error
      return Response.redirect(`${frontendUrl}/powens-callback?error=${encodeURIComponent(error)}`, 302);
    }

    if (!connectionId) {
      console.error("❌ Missing connection_id in callback");
      throw new Error("Missing connection_id in callback");
    }

    if (!signedState) {
      console.error("❌ Missing state parameter in callback");
      throw new Error("Missing state parameter");
    }

    // Get Powens credentials for signature verification
    const clientSecret = Deno.env.get("POWENS_CLIENT_SECRET") ?? "";
    if (!clientSecret) {
      console.error("❌ POWENS_CLIENT_SECRET not configured");
      throw new Error("Server configuration error");
    }

    // Verify the signed state parameter
    const verification = await verifySignedState(decodeURIComponent(signedState), clientSecret);
    if (!verification.valid) {
      console.error("❌ State verification failed:", verification.error);
      throw new Error(`Invalid callback state: ${verification.error}`);
    }

    const userId = verification.userId!;
    console.log("✅ State verified for user:", userId);

    // Get Powens credentials
    let powensDomain = Deno.env.get("POWENS_DOMAIN") ?? "";
    powensDomain = powensDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the user's Powens data
    const { data: powensUser, error: powensUserError } = await supabaseAdmin
      .from("powens_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (powensUserError || !powensUser?.access_token) {
      console.error("❌ Could not find Powens user for verified userId:", userId);
      throw new Error("User configuration not found");
    }

    // Verify connection belongs to this user
    const connResponse = await fetch(`https://${powensDomain}/2.0/users/me/connections/${connectionId}`, {
      headers: { "Authorization": `Bearer ${powensUser.access_token}` },
    });

    if (!connResponse.ok) {
      console.error("❌ Connection does not belong to user or invalid:", connResponse.status);
      throw new Error("Connection validation failed");
    }

    const connectionDetails = await connResponse.json();
    console.log("✅ Connection validated:", connectionId);

    // Get bank info from connector
    let bankName = "Banque connectée";
    let bankLogo = null;

    if (connectionDetails.id_connector) {
      try {
        const connectorResponse = await fetch(`https://${powensDomain}/2.0/connectors/${connectionDetails.id_connector}`, {
          headers: { "Authorization": `Bearer ${powensUser.access_token}` },
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
        user_id: userId,
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
    
    return Response.redirect(`${frontendUrl}/powens-callback?error=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`, 302);
  }
});
