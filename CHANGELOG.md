# Changelog

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
