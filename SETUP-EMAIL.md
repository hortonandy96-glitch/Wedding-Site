# Setting up RSVP reminder emails 📮

This connects the dashboard's **✉️ Send reminders** button to real email,
sent from your domain (`hortonhearsido.com` — outstanding name, by the way).

**Prerequisite:** finish `SETUP-SUPABASE.md` first. Until both are done, the
button works in demo mode (it pretends to send and stamps the date).

**What you're wiring up, in plain English:** websites can't send email
directly — they ask an email service to do it, using a secret API key. Secrets
can't live in website code (anyone can read a website's code), so the key
lives in a tiny program on Supabase's servers (an "Edge Function"). The
dashboard hands that program the emails; it checks you're really signed in,
sends them through **Resend** (free: 3,000/month, 100/day — plenty), and
stamps each household as reminded.

Total time: ~30 minutes, most of it waiting for DNS. Cost: $0 beyond the domain.

---

## Step 1 — Resend account + verify your domain (~15 min, mostly waiting)

Email providers make you prove you own your domain so spammers can't send
mail pretending to be you. The proof is adding a few DNS records.

1. Sign up at [resend.com](https://resend.com) (free, no card).
2. In Resend: **Domains → Add Domain** → enter `hortonhearsido.com` → it
   shows you 3–4 DNS records (SPF, DKIM — anti-forgery signatures).
3. In a second tab, open your **domain registrar** (wherever you bought
   hortonhearsido.com) → find **DNS settings / DNS records**.
4. For each record Resend shows, click **Add record** at the registrar and
   copy the **Type** (TXT/MX/CNAME), **Name/Host**, and **Value** exactly.
   Registrar support chat will happily do this with you if it looks scary.
5. Back in Resend, click **Verify**. It can take from minutes to a few hours
   for DNS to propagate — go make coffee and re-check.
6. Once verified: **API Keys → Create API Key** → name it `wedding`, permission
   "Sending access" → copy the key (starts with `re_`). **This is a real
   secret** — treat it like a password; it goes in exactly one place (Step 3).

## Step 2 — Create the Edge Function (~5 min, no command line)

1. Supabase dashboard → **Edge Functions** (left sidebar) → **Deploy a new
   function** → choose **Via Editor** (the in-browser editor).
2. Name it exactly: `send-reminders`
3. Delete the example code, then copy-paste the entire contents of
   `supabase/functions/send-reminders/index.ts` from this repository.
4. Click **Deploy**.

## Step 3 — Give the function its secrets (~2 min)

1. **Edge Functions → Secrets** (or Settings → Edge Functions → Secrets).
2. Add:
   - `RESEND_API_KEY` = the `re_…` key from Step 1
   - `FROM_ADDRESS` = `Robin & Andy <rsvp@hortonhearsido.com>`
     (the name part shows in inboxes; the address must be on your verified domain)
   - `REPLY_TO` = `horton.andy96@gmail.com` (when guests hit reply, it goes here)

That's it for secrets — note that **nothing was added to the website code or
git**. The key lives only inside Supabase.

## Step 4 — Test it (~2 min)

1. Add a test household in your admin dashboard with **your own email** and
   no RSVP response.
2. Click **✉️ Send reminders** — your test household appears, the preview
   shows the exact email with its personal link. Send it.
3. Check your inbox (and spam, the first time). Click the link — it should
   open your RSVP page already knowing the household. 🎉
4. Delete the test household afterward.

## Troubleshooting

- **"RESEND_API_KEY secret is not set"** → Step 3 didn't save, or the function
  was deployed before the secret existed — redeploy the function.
- **"Recipient mismatch"** → the household's email changed between opening the
  dialog and sending; reopen the dialog.
- **Email lands in spam** → normal for a brand-new domain's first sends.
  Resend's domain page has an optional DMARC record that helps; add it at
  your registrar.
- **"Not signed in"** → your dashboard session expired; sign out and back in.

## Sensible expectations

The free tier allows 100 emails/day. The dashboard sends at most 50 per batch,
which for a wedding guest list is more than you'll ever click in a day. Each
household gets its own personal link — never forward one household's email to
another household.
