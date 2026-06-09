// =========================================================================
// Supabase Edge Function: send-reminders
//
// WHY THIS EXISTS (plain English): sending email requires a secret API key,
// and secrets can never live in website code (anyone can press F12 and read
// it). So the dashboard sends the prepared emails HERE, to a tiny program
// running on Supabase's servers, where the Resend key is stored as a secret.
//
// Safety checks before anything sends:
//   1. The caller must be a signed-in user (signups are disabled, so: you).
//   2. Each message must match a real household, and the "to" address must
//      equal that household's email on file — the function can't be used
//      to email arbitrary addresses.
//
// Deployment: see SETUP-EMAIL.md (you paste this file into the Supabase
// dashboard — no command line needed).
// =========================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

// Browsers ask permission ("CORS preflight") before calling cross-origin
// services; these headers grant it.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  // CONFIG: the verified sender address (domain must be verified in Resend)
  const fromAddress =
    Deno.env.get("FROM_ADDRESS") ?? "Robin & Andy <rsvp@hortonhearsido.com>";
  const replyTo = Deno.env.get("REPLY_TO") ?? "horton.andy96@gmail.com";

  if (!resendKey) {
    return json(500, { error: "RESEND_API_KEY secret is not set in Supabase." });
  }

  // ---- 1. Verify the caller is the signed-in admin ----------------------
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const authClient = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData?.user) {
    return json(401, { error: "Not signed in." });
  }

  // ---- 2. Validate the request ------------------------------------------
  const { messages } = await req.json().catch(() => ({ messages: null }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: "No messages provided." });
  }
  if (messages.length > 50) {
    return json(400, { error: "Max 50 reminders per batch (free email tier limit)." });
  }

  // The service-role client bypasses Row Level Security — safe here because
  // this code runs on the server and we verified the caller above.
  const db = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let sent = 0;
  let failed = 0;
  const results: Array<{ household_id: string; ok: boolean; error?: string }> = [];

  for (const m of messages) {
    // Each "to" must match the household's email on file
    const { data: household } = await db
      .from("households")
      .select("id, email")
      .eq("id", m.household_id)
      .single();

    if (!household || !household.email || household.email !== m.to) {
      failed++;
      results.push({ household_id: m.household_id, ok: false, error: "Recipient mismatch." });
      continue;
    }

    // ---- 3. Send via Resend's API ---------------------------------------
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [m.to],
        reply_to: replyTo,
        subject: m.subject,
        text: m.text,
        html: m.html,
      }),
    });

    if (res.ok) {
      sent++;
      results.push({ household_id: m.household_id, ok: true });
      await db
        .from("households")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", m.household_id);
    } else {
      failed++;
      const detail = await res.text();
      results.push({ household_id: m.household_id, ok: false, error: detail.slice(0, 200) });
    }

    // Gentle pacing for the email provider's rate limit (~2/second)
    await new Promise((r) => setTimeout(r, 600));
  }

  return json(200, { sent, failed, results });
});
