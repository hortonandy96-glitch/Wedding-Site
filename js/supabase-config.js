/* =========================================================================
   Supabase connection settings.

   Until you fill these in, the admin page runs in DEMO MODE with sample
   data saved only in your own browser — great for clicking around.

   To go live, follow SETUP-SUPABASE.md, then paste your two values here:
     - url:     Supabase Dashboard → Settings → API → "Project URL"
     - anonKey: same page → "anon / publishable" key

   IS IT OK THAT THIS FILE IS PUBLIC? Yes — and it has to be, because the
   guest's browser uses it. The anon key is designed to be publishable:
   it only grants what the database's security rules allow (for visitors:
   almost nothing). The key that must NEVER appear here or anywhere in the
   repo is the "service_role" key — that one bypasses all rules. We never
   use it in this project.
   ========================================================================= */

window.SUPABASE_CONFIG = {
  // Base project URL only — the client library adds /rest/v1, /auth/v1,
  // etc. itself, so don't include any path here.
  url: "https://erkvgabptawgrlyoeimw.supabase.co",
  anonKey: "sb_publishable_24S6pNGEVa_0dexTHQGSPA_m63SRuvD",
};
