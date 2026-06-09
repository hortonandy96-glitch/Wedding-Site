# Connecting the real database (Supabase) 🔌

Until you do this, the admin page (`admin.html`) runs in **demo mode** — sample
data, stored only in your own browser. That's on purpose so you can click
around first. When you're ready to track real guests, follow these steps.
Total time: ~15 minutes, cost: $0.

## What you're creating, in plain English

- **Supabase** hosts a real database (your guest list) on the internet.
- A **security rulebook** in that database says: *the signed-in admin (you)
  can do anything; anonymous visitors can do almost nothing.*
- Your website talks to it from the browser. The "anon key" you'll paste into
  the code is like the building's street address — public by design. The
  *locks* are the rulebook and your password, which stay on Supabase's servers.

## Step 1 — Create the project (5 min)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign
   up (signing in with GitHub is easiest).
2. Click **New project**. Name it `wedding`, set a strong **database password**
   (save it in your password manager — you rarely need it again), pick the
   region closest to Chicago (US East/Central), click **Create**.
3. Wait ~2 minutes while it sets up.

## Step 2 — Create the tables and security rules (3 min)

1. In the left sidebar, click **SQL Editor** → **New query**.
2. Open the file `supabase/setup.sql` from this repository, copy **all** of it,
   paste it into the editor, and click **Run**.
3. You should see "Success. No rows returned." Now click **Table Editor** in
   the sidebar — you'll see your two new tables, `households` and `guests`.
   This Table Editor is also your emergency backup admin panel: you can always
   view and fix data right here.

## Step 3 — Create your admin login & lock the door (3 min)

1. Sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
   Use your real email and a strong password. This is what you'll type into
   `admin.html`.
2. Now disable public signups so no one else can make an account:
   **Authentication** → **Sign In / Up** (or **Providers** → **Email**) →
   turn **off** "Allow new users to sign up" → Save.
   ⚠️ This step matters: our rulebook says "any signed-in user is an admin,"
   which is only safe because you just made yourself the only possible user.

## Step 4 — Connect the website (2 min)

1. Sidebar → **Settings** (gear) → **API**.
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Copy the **anon / publishable** key (a long string starting with `eyJ` or `sb_publishable_`).
   **Not** the `service_role` / secret key — that one never leaves Supabase.
4. Open `js/supabase-config.js` in this repository and paste both values over
   the placeholders. Commit the change.
5. Reload `admin.html` — the "demo mode" badge is gone, and your real
   email/password from Step 3 signs you in. 🎉

## Step 5 — Keep the free project awake (2 min, optional but recommended)

Supabase pauses free projects after **7 days with zero database activity**.
Real guest traffic counts as activity, but during quiet months you have two
easy options:

- Visit your admin page once a week (checking RSVPs counts!), **or**
- Ask Claude to add a tiny scheduled GitHub Action that pings the database
  weekly so you never have to think about it.

If it ever does pause: nothing is lost — log into supabase.com and click
**Restore**, and it's back in a minute.

## FAQ

**Is my guest data private?** Yes. Without your password, visitors can't read
the guest list. In Phase 2, a guest's QR code will let them see and answer for
*their own household only* — enforced by the database, not by hidden links.

**What must never go in git?** Your admin password and the `service_role` key.
Neither is used anywhere in this code, so there's nothing to leak — the only
thing in `js/supabase-config.js` is the publishable address+key pair.

**What if I get stuck?** Take a screenshot of where you are and ask Claude in
a new session — every step above is recognizable from the Supabase dashboard.
