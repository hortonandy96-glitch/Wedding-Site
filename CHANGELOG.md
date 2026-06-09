# Changelog

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
