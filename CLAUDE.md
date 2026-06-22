# Robin & Andy Wedding — Project Context

This file orients any Claude session (web or on-device/Cowork) working on this
project. It's the wedding website **and** the couple's private planning suite.

## What this is

- **Public site** for Robin Beattie & Andy Horton's wedding — May 21, 2027,
  Salvage One, Chicago — live at **https://hortonhearsido.com**.
- **Private admin** at `/admin.html` (password login): RSVP tracking, guest
  list, budget, vendors, and planning lists.
- Owner is a **non-coder**. Explain decisions in plain language; prefer simple,
  low-maintenance solutions; never assume CLI/dev knowledge.

## Tech & architecture

- **Vanilla HTML/CSS/JS. No build step, no framework, no npm install** to run.
  What's in the repo is exactly what ships.
- **Hosting:** GitHub Pages off the `gh-pages` branch. The
  `.github/workflows/deploy-pages.yml` workflow mirrors `main` → `gh-pages`
  (and runs tests) on every push, so **committing to `main` = deploying**.
- **Backend:** Supabase (free tier) — Postgres + Auth + one Edge Function.
  Project URL and the **publishable** anon key live in `js/supabase-config.js`
  (safe to commit; they only allow what the DB's Row Level Security permits).
  The **service_role key and admin password are NOT in the repo and must never
  be** — the only place a secret lives is the Supabase dashboard (Edge Function
  secrets for email).
- **Demo vs live:** every admin/RSVP feature has a `DemoStore` (browser
  localStorage, sample data) that activates automatically when Supabase isn't
  configured, and a `SupabaseStore` for real data. Same method names; the UI
  doesn't know which is active. See `js/admin-store.js` and `js/rsvp-link.js`.

## File map

```
index.html              public site (hero, day, RSVP CTA, travel, registry, FAQ)
rsvp.html               guest RSVP screen (name search → household form)
admin.html              private dashboard (5 tabs)
css/styles.css          shared palette/typography (CSS variables in :root)
css/admin.css           admin-only styles
css/rsvp-link.css       RSVP screen styles
css/print.css           print styles
js/content.js           ⭐ EDIT-ME: itineraries, hotels, registry, FAQ, dietary copy
js/validate.js          RSVP validation (pure fns, unit-tested)
js/rsvp-link.js         RSVP screen behavior (search, household form, unmatched)
js/admin.js             admin shell: tabs, auth, RSVP dashboard + report
js/admin-store.js       data layer: DemoStore + SupabaseStore (all DB access)
js/admin-planning.js    Guest List tab + generic sheet engine (vendors, planning)
js/admin-budget.js      Budget tab (funds, items, expense log, payments)
js/demo-data.js         shared sample data for demo mode
js/main.js              public-site nav/accordion/rendering
js/vendor/qrcode.js     vendored MIT QR generator
supabase/               SQL: setup.sql (full), migrations 001-003, imports, Edge Fn
tests/validate.test.js  run: npm test  (Node built-in test runner, zero deps)
```

## Run / test / deploy

- **Preview locally:** open `index.html` in a browser (or `npm start` for a
  local server). Maps and webfonts need internet.
- **Tests:** `npm test` (validation logic only).
- **Deploy:** push to `main`. Wait ~2 min. No manual step.

## Database (Supabase) — current state

Setup is **done** (project created, admin user made, signups disabled, all SQL
run, guest list + planning data imported). Tables:
`households`, `guests`, `unmatched_rsvps`, `planning_rows`, `budget_items`,
`expenses`, `planning_settings`. Functions: `rsvp_lookup`, `rsvp_submit`,
`rsvp_search`, `rsvp_submit_unmatched`. All tables are admin-only via RLS;
guest-facing actions go through the scoped functions, which require a valid
invite code or return at most 8 search hits.

To change schema: write a new `supabase/migration-NNN-*.sql`, have the owner
paste it into Supabase → SQL Editor → Run, and fold it into `setup.sql`.

## Admin tabs

- **RSVPs** — households & guests, summary counts, reminders (✉️), printable
  report (📊), per-household + general QR downloads.
- **Guest List** — flat filterable table of all guests; CSV export.
- **Budget** — wedding funds, budget items (estimates), expense log. **Actual
  spend is always computed from logged expenses**, never stored directly.
  "Planned" expenses with due dates = the payment schedule.
- **Vendors** / **Planning** — generic editable sheets (one engine in
  `admin-planning.js`; add a sheet by adding a config entry).

## Conventions

- **Palette** (CSS vars in `css/styles.css :root`): `--cream #faf3da`,
  `--pink #f2c2cf`, `--burgundy #5a2434`, `--green #5b8c5a`,
  `--forest #11301f`, `--ink #1d3a28`.
- **Fonts:** Sorts Mill Goudy (display) + Crimson Pro (body), via Google Fonts
  `<link>` in each HTML head; referenced through `--font-display`/`--font-body`.
- Global `[hidden] { display:none !important }` — keep it; some flex rows would
  otherwise ignore the `hidden` attribute.
- Most site **content** is editable in `js/content.js` without touching logic.
- Accessibility matters: semantic HTML, focus states, labeled controls.
- **Commit to `main` only when the owner asks to ship** (it auto-deploys).

## Not in the repo (by design)

- Source spreadsheets (The Knot guest export, the Ultimate Planning workbook) —
  their data was transformed into `supabase/import-*.sql`. Keep the originals
  in the project folder for reference if desired.
- Any secret: service_role key, admin password, Resend API key.

## Open threads / next up

- Resend email setup for reminders (`SETUP-EMAIL.md`) — not yet done.
- Robin's Night Out itinerary needs the rest of her picks (`js/content.js`).
- "Ashley Evers & Curtis" household — Curtis needs a last name (admin edit).
- Real photos + social-preview image (`assets/`).
- Possible future sheets: seating chart, rehearsal.
- A fuller budget will be provided to load into the Budget tab.
