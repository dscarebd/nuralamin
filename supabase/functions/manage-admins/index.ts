import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller is admin
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email, user_id } = await req.json();

    if (action === "list") {
      // Get all admin roles
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "admin");
      if (error) throw error;

      // Get user emails from auth
      const admins = [];
      for (const role of roles ?? []) {
        const { data: { user } } = await supabase.auth.admin.getUserById(role.user_id);
        admins.push({
          user_id: role.user_id,
          email: user?.email ?? "Unknown",
          is_caller: role.user_id === caller.id,
        });
      }

      return new Response(JSON.stringify({ admins }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add") {
      if (!email) throw new Error("Email is required");

      // Find user by email
      const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
      if (listErr) throw listErr;
      const target = users.find((u) => u.email === email);
      if (!target) {
        return new Response(JSON.stringify({ error: "No user found with that email. They must sign up first." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already admin
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", target.id)
        .eq("role", "admin")
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "User is already an admin" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: insertErr } = await supabase
        .from("user_roles")
        .insert({ user_id: target.id, role: "admin" });
      if (insertErr) throw insertErr;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "remove") {
      if (!user_id) throw new Error("user_id is required");

      // Prevent removing yourself
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "You cannot remove yourself as admin" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: delErr } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", "admin");
      if (delErr) throw delErr;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
