# Changelog

## v1.4.0 — Guided-fill RSVP + report + guest list import (2026-06-11)

### Implemented ✅

- **Guided fill box** — the RSVP screen now opens with "Find your invitation":
  type a few letters of your name and matching guests appear (accessible
  combobox: keyboard arrows/Enter, mobile-friendly). Picking yourself opens
  your household's RSVP form. Search runs through a new scoped database
  function (`rsvp_search`): 2+ characters required, max 8 results, wildcards
  stripped — the guest list can't be bulk-downloaded.
- **Unmatched RSVP fallback** — "Can't find your name?" leads to a short
  form (name, email, attending, party, dietary, note) stored in a new
  `unmatched_rsvps` table for manual reconciliation.
- **Public RSVP form removed** — the homepage RSVP section is now a single
  "Find my invitation" button; nav and hero CTAs link straight to the RSVP
  screen. Old localStorage form, `js/rsvp.js`, and its validation removed.
- **Admin report** (📊 Report) — printable report with totals (households/
  guests, response rate), every household not yet RSVPed (with contacts and
  reminder dates), all RSVPs received (per guest, with dietary + notes), and
  unmatched RSVPs with a "Resolved" button.
- **Guest list import** — `supabase/import-guest-list.sql` generated from
  The Knot export: 127 households, 201 named guests, 39 plus-ones, with
  phones/emails/mailing addresses (addresses kept in household notes).
- `supabase/migration-002-search-unmatched.sql` for existing databases;
  setup.sql updated for fresh installs.

### To do / notes 🚧

- Run migration-002 and the import SQL in Supabase (see README/chat).
- "Ashley Evers & Curtis" — Curtis has no last name in the source list.
- Guest list updates will arrive later; re-import strategy: edit in admin
  or wipe and re-run a regenerated import.

## v1.3.0 — Phase 3 reminders + design feedback round 1 (2026-06-09)

### Implemented ✅

- **Email reminders (Phase 3)** — "✉️ Send reminders" button on the admin
  dashboard: picks every household with an email and no response, editable
  subject/message with {{name}} and {{link}} placeholders, live preview of
  the exact email before sending. Real sending runs through a Supabase Edge
  Function (`supabase/functions/send-reminders/index.ts`) holding the Resend
  API key as a server-side secret (never in git); it verifies the admin's
  session and that each recipient matches the household's email on file.
  Households show a "reminded <date>" badge. `SETUP-EMAIL.md` walks through
  Resend + DNS for hortonhearsido.com + dashboard-only deployment.
- **Food stations rework** — meal choices removed everywhere (stations with
  guaranteed vegetarian options). Both RSVP forms now collect optional
  dietary restrictions per guest; admin summary shows a caterer-ready
  dietary list; schema renamed `meal` → `dietary`
  (migration provided for existing databases).
- **Plus ones** — public form: "I'm bringing a plus one" checkbox reveals
  name + dietary fields. Personal QR page: households the admin marks
  "+1 invited" can add one plus one (enforced in the database: only if
  allowed, only once, name required). Admin shows "+1 invited" and "+1"
  badges.
- **Hero** — RSVP button now vertically centered between the venue line and
  the arch's inner border.
- **Dress code** — jeans politely shown the door.
- **Itineraries** — Andy's real Logan Square Sunday (farmers market haul,
  Logan Theatre, Club Lucky), Robin's Night Out starting at Lone Wolf
  ("to be continued"), architecture cruise promoted to THE tourist pick,
  plus art fairs & street fests note.

### Notes 🚧

- Robin's Night Out awaits the rest of her research (edit `js/content.js`).
- If the original setup.sql was already run in Supabase, run
  `supabase/migration-001-stations.sql`, then re-run section 3 of `setup.sql`.

## v1.2.0 — RSVP tracker Phase 2: QR invite links (2026-06-09)

### Implemented ✅

- **`rsvp.html`** — personal RSVP page guests reach by scanning their QR
  code. Greets the household by name, one yes/no + dinner choice block per
  guest, optional note, validation with per-guest errors, confirmation
  screen. Re-opening the link shows current answers and allows updates.
  Manual invite-code entry as a fallback for missing/typo'd links.
- **Admin invite tools** — every household card now shows its personal link
  with **Copy link** and **Download QR** buttons. QR codes are generated in
  the browser (vendored MIT library, `js/vendor/qrcode.js`), painted at
  ~1000px for crisp printing, and verified to decode back to the right URL.
  Links adapt automatically to wherever the site is hosted.
- **Shared demo data** (`js/demo-data.js`) — in demo mode the guest page and
  admin dashboard share the same sample data, so you can RSVP via a demo
  link and watch the tracker update.
- **Validation + tests** — new `validateHouseholdResponses()` rules (every
  guest must decide; attendees need a meal) with 3 new tests (12 total).
- **Bug fix** — global `[hidden]` CSS rule; previously `display:flex` rows
  could ignore the `hidden` attribute (affected meal pickers on both forms).

### Phase 3 (next) 🚧

- RSVP reminders from the dashboard with preview before sending.

## v1.1.0 — RSVP tracker Phase 1: admin dashboard (2026-06-09)

### Implemented ✅

- **Research** — confirmed The Knot offers no public API; chose Supabase
  (free tier) as the backend with user's sign-off.
- **`admin.html`** — protected admin dashboard: email/password sign-in,
  summary cards (invited / attending / declined / awaiting reply + meal
  counts), households with guests in a responsive table (cards on mobile),
  add/edit/delete for both households and guests via accessible dialogs.
- **Demo mode** — until Supabase is connected, the dashboard runs on sample
  data in localStorage so it can be previewed with zero setup. The data layer
  (`js/admin-store.js`) swaps between demo and live behind one interface.
- **`supabase/setup.sql`** — heavily commented schema: `households` (with
  unique invite codes ready for Phase 2 QR links) + `guests`, Row Level
  Security (admin-only table access), and two security-definer functions
  (`rsvp_lookup`, `rsvp_submit`) that will power the guest RSVP form.
- **`SETUP-SUPABASE.md`** — beginner walkthrough: create project, run SQL,
  create the single admin user, disable signups, paste the two public config
  values, plus the free-tier pause caveat and what must never go in git.

### Placeholders / next phases 🚧

- Phase 2: per-household QR codes + prefilled guest RSVP form (schema ready).
- Phase 3: RSVP reminders from the dashboard (email column + reminder_sent_at ready).
- `js/supabase-config.js` contains placeholders until the user runs setup.

## v1.0.0 — Initial prototype (2026-06-09)

### Implemented ✅

- **Landing/Hero** — names, date, welcome copy, RSVP CTA; arch-window motif hand-traced
  as responsive SVG from the save-the-date draft (forest green, burgundy band, pink dots).
- **Stained-glass dividers** — invitation border (cream/pink/burgundy florals) traced as a
  reusable SVG between every section.
- **RSVP** — attendance toggle, name, email, party size (1–10), per-guest name + meal
  (3 options), optional note; validation with inline accessible errors; saves to
  localStorage; add/edit/delete saved RSVPs; confirmation panel with **print** (dedicated
  print stylesheet) and **download .txt summary**.
- **Registry** — 3-card grid rendered from `js/content.js` + "copy all links" button
  with clipboard API and status toast.
- **Travel** — Chicago intro with neighborhoods; three itinerary cards (Andy's Ideal
  Sunday, Robin's Night Out, Chicago Tourist Classics) rendered from `js/content.js`;
  expandable hotel placeholder cards with map links and "coming soon" badges.
- **Our Day** — Salvage One address, timeline, dress code, parking/transit tips,
  embedded Google Map (no API key needed).
- **FAQ** — accessible accordion (aria-expanded/aria-controls, keyboard friendly),
  6 questions rendered from `js/content.js`.
- **Footer** — contact email, Instagram/email icons, credit line.
- **Accessibility** — skip link, semantic landmarks, labeled controls, visible focus
  states, aria-live regions for errors/toasts/confirmation.
- **SEO** — title/description/Open Graph/Twitter meta, SVG favicon, placeholder og-image.
- **Tests** — `tests/validate.test.js` covering name/email/party-size/meal/full-RSVP
  validation, runnable with `npm test` (Node's built-in test runner, zero dependencies).
- **Docs** — README (content editing map) + DEPLOY-GUIDE (beginner GitHub Pages/Netlify).

### Placeholders / waiting on real content 🚧

| Item | Where | Marker |
|---|---|---|
| Registry URLs (currently example.com) | `js/content.js` | `PLACEHOLDERS` |
| Hotel blocks (2 "coming soon" cards) | `js/content.js` | `PLACEHOLDERS` |
| Ceremony/reception timeline times | `index.html` | `REPLACE` |
| Social preview image (SVG stand-in, want a photo PNG) | `assets/og-image.svg` | `PLACEHOLDER` |
| Photos (none yet — drop folder ready with srcset/lazy instructions) | `assets/images/` | `README.txt` |
| Contact email (using horton.andy96@gmail.com — confirm) | `index.html` footer | `REPLACE` |
| RSVP backend (localStorage only — guests' answers don't reach you) | `js/rsvp.js` | top comment |

### Assumptions noted 📝

- Fonts: Marcellus + Cormorant Garamond as closest open-source matches to the draft stationery.
- Palette hex values eyeballed from the mood-board swatches.
- RSVP deadline assumed as April 21, 2027 (one month out) — edit in `index.html` & `js/content.js`.
- Dress code, parking tips, and FAQ answers are drafted copy in Robin & Andy's voice — review and tweak.

## v1.4.1 — Keep-alive + polish round (2026-06-11)

- Scheduled GitHub Action pings the database twice weekly so the free
  Supabase project never pauses (.github/workflows/keep-alive.yml).
- Admin: "General RSVP QR" download — one QR for all invitations, pointing
  at the name-search RSVP page (fallback if per-household QRs aren't printed).
- Admin dashboard column renamed "Meal" → "Dietary restrictions" (it always
  held dietary notes; the report already said Dietary).
- Hero RSVP button now sits ~0.25in above the arch's inner frame line
  (deterministic: pinned to a content area that ends 5% of width above it).
- Registry descriptions now burgundy.
- Chicago Tourist Classics rewritten as a timed itinerary like Andy's.
