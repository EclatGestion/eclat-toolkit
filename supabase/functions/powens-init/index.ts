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
    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get Powens credentials
    let powensDomain = Deno.env.get("POWENS_DOMAIN") ?? "";
    const clientId = Deno.env.get("POWENS_CLIENT_ID") ?? "";
    const clientSecret = Deno.env.get("POWENS_CLIENT_SECRET") ?? "";

    // Clean domain (remove protocol if present)
    powensDomain = powensDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    if (!powensDomain || !clientId || !clientSecret) {
      throw new Error("Powens credentials not configured");
    }

    console.log("🔧 Powens domain:", powensDomain);

    // Check if user already has a Powens account
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: existingPowensUser } = await supabaseAdmin
      .from("powens_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let accessToken: string;
    let powensUserId: string;

    if (existingPowensUser?.access_token && existingPowensUser?.powens_user_id) {
      // User already has Powens account
      console.log("✅ Existing Powens user found:", existingPowensUser.powens_user_id);
      accessToken = existingPowensUser.access_token;
      powensUserId = existingPowensUser.powens_user_id;
    } else {
      // Create new Powens user via auth/init
      console.log("🆕 Creating new Powens user...");
      
      const initResponse = await fetch(`https://${powensDomain}/auth/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error("Powens init error:", errorText);
        throw new Error(`Failed to initialize Powens user: ${initResponse.status}`);
      }

      const initData = await initResponse.json();
      console.log("✅ Powens user created:", initData);

      accessToken = initData.auth_token;
      powensUserId = String(initData.id_user);

      // Save to database
      await supabaseAdmin.from("powens_users").upsert({
        user_id: user.id,
        powens_user_id: powensUserId,
        access_token: accessToken,
        updated_at: new Date().toISOString(),
      });
    }

    // Generate temporary code for webview
    console.log("🔑 Generating temp code...");
    const codeResponse = await fetch(`https://${powensDomain}/auth/token/code`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!codeResponse.ok) {
      const errorText = await codeResponse.text();
      console.error("Code generation error:", errorText);
      throw new Error(`Failed to generate auth code: ${codeResponse.status}`);
    }

    const codeData = await codeResponse.json();
    const tempCode = codeData.code;
    console.log("✅ Temp code generated");

    // Build webview URL
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")?.replace("/rest/v1", "")}/functions/v1/powens-callback`;
    const redirectUri = encodeURIComponent(callbackUrl);
    
    const webviewUrl = `https://${powensDomain}/auth/webview/connect?client_id=${clientId}&code=${tempCode}&redirect_uri=${redirectUri}`;

    console.log("🌐 Webview URL generated");

    return new Response(
      JSON.stringify({ 
        success: true, 
        webviewUrl,
        powensUserId 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in powens-init:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
