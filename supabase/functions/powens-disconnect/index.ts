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

    const { connectionId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get Powens credentials
    let powensDomain = Deno.env.get("POWENS_DOMAIN") ?? "";
    powensDomain = powensDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    // Get user's Powens token
    const { data: powensUser } = await supabaseAdmin
      .from("powens_users")
      .select("access_token")
      .eq("user_id", user.id)
      .single();

    if (powensUser?.access_token && connectionId) {
      // Try to delete connection from Powens API
      try {
        await fetch(`https://${powensDomain}/users/me/connections/${connectionId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${powensUser.access_token}` },
        });
        console.log("✅ Connection deleted from Powens");
      } catch (e) {
        console.log("Could not delete from Powens API:", e);
      }
    }

    // Delete from our database
    if (connectionId) {
      await supabaseAdmin
        .from("bank_connections")
        .delete()
        .eq("user_id", user.id)
        .eq("powens_connection_id", connectionId);
    } else {
      // Delete all connections for this user
      await supabaseAdmin
        .from("bank_connections")
        .delete()
        .eq("user_id", user.id);
    }

    console.log("✅ Bank connection(s) removed from database");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in powens-disconnect:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
