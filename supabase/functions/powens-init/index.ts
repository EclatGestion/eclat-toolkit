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
    let POWENS_DOMAIN = Deno.env.get("POWENS_DOMAIN");
    const POWENS_CLIENT_ID = Deno.env.get("POWENS_CLIENT_ID");
    const POWENS_CLIENT_SECRET = Deno.env.get("POWENS_CLIENT_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!POWENS_DOMAIN || !POWENS_CLIENT_ID || !POWENS_CLIENT_SECRET) {
      throw new Error("Missing Powens configuration");
    }

    // Clean domain: remove protocol and trailing slashes
    POWENS_DOMAIN = POWENS_DOMAIN
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");
    
    console.log("[POWENS-INIT] Using domain:", POWENS_DOMAIN);

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

    console.log("[POWENS-INIT] User authenticated:", user.id);

    // Check if user already has a Powens account
    const { data: existingPowens } = await supabase
      .from("powens_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let powensUserId = existingPowens?.powens_user_id;
    let accessToken = existingPowens?.access_token;

    // If no Powens account, create one
    if (!powensUserId) {
      console.log("[POWENS-INIT] Creating new Powens user");

      // Initialize Powens user via /auth/init
      const initResponse = await fetch(`https://${POWENS_DOMAIN}/auth/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: POWENS_CLIENT_ID,
          client_secret: POWENS_CLIENT_SECRET,
        }),
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error("[POWENS-INIT] Init error:", errorText);
        throw new Error(`Failed to initialize Powens user: ${errorText}`);
      }

      const initData = await initResponse.json();
      console.log("[POWENS-INIT] Powens user created:", initData);

      powensUserId = initData.id_user?.toString();
      accessToken = initData.auth_token;

      // Save Powens user info to database
      const { error: insertError } = await supabase
        .from("powens_users")
        .upsert({
          user_id: user.id,
          powens_user_id: powensUserId,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("[POWENS-INIT] Database insert error:", insertError);
      }
    }

    // Generate temporary code for webview
    console.log("[POWENS-INIT] Generating webview code");
    const codeResponse = await fetch(`https://${POWENS_DOMAIN}/auth/token/code`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!codeResponse.ok) {
      const errorText = await codeResponse.text();
      console.error("[POWENS-INIT] Code generation error:", errorText);
      throw new Error(`Failed to generate webview code: ${errorText}`);
    }

    const codeData = await codeResponse.json();
    const tempCode = codeData.code;

    console.log("[POWENS-INIT] Webview code generated successfully");

    // Build webview URL
    const { redirectUrl } = await req.json();
    const webviewUrl = `https://${POWENS_DOMAIN}/auth/webview/connect?` +
      `client_id=${POWENS_CLIENT_ID}` +
      `&code=${tempCode}` +
      `&redirect_uri=${encodeURIComponent(redirectUrl || window.location.origin)}`;

    return new Response(
      JSON.stringify({
        success: true,
        webviewUrl,
        powensUserId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POWENS-INIT] Error:", error);
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
