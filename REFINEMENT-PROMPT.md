# Prompt for Claude Code — Wedding site "under the hood" refinements

Copy everything below the line into Claude Code, run from the repo root
(`Wedding-Site`). It does six self-contained refinements. **The visible
structure, style, and layout must stay pixel-identical** — these are
behind-the-scenes improvements only.

---

You are working on a wedding website: **vanilla HTML/CSS/JS, no framework, no
build step.** What's in the repo is exactly what ships. It deploys
automatically to GitHub Pages whenever `main` changes, so **do not commit to
`main`.** Read `CLAUDE.md` first for full context.

**Ground rules for this whole job:**
- Create and work on a new branch: `git checkout -b site-refinements`.
- Do NOT merge or push to `main`. Leave that to the owner.
- The owner is a non-coder — explain each change in plain language in your
  final summary, and keep the visible design exactly as it is now.
- Never touch or add secrets (service_role key, admin password, API keys).
- Commit after each task with a clear message (e.g. `task 1: social preview image`).
- After all six tasks: run `npm test` (must still pass), open `index.html` and
  `rsvp.html` in a browser to confirm nothing looks different, and write a
  short plain-language summary of what changed, file by file.

Do the tasks in this order.

## Task 1 — Fix the social/link-preview image

**Problem:** `index.html` sets `og:image` to an `.svg` file. Most platforms
(iMessage, Facebook, WhatsApp, LinkedIn) cannot render SVG previews, so shared
links show a blank box.

**Do:**
1. Design a 1200×630 PNG social preview at `assets/og-image.png` using the
   site's palette (`--cream #faf3da`, `--pink #f2c2cf`, `--burgundy #5a2434`,
   `--forest #11301f`) and fonts (Sorts Mill Goudy). It should read:
   "Robin & Andy", "May 21, 2027", "Salvage One · Chicago, IL". Keep the
   stained-glass feel (you can reuse the arch/flower motifs already in the
   repo's inline SVG). Keep an editable SVG source at `assets/og-image-source.svg`
   and render the PNG from it (use whatever's available: `rsvg-convert`,
   ImageMagick, or a headless browser). Confirm the output is exactly 1200×630.
2. In `index.html` `<head>`, update the preview tags to use an **absolute**
   URL (relative paths often fail in link unfurlers):
   - `og:image` → `https://hortonhearsido.com/assets/og-image.png`
   - add `og:image:width` `1200`, `og:image:height` `630`
   - add `og:url` → `https://hortonhearsido.com/`
   - add `twitter:image` → same absolute PNG URL
   - keep `twitter:card` as `summary_large_image`
3. Leave `rsvp.html` alone (it's intentionally `noindex`).

**Done when:** the PNG exists at 1200×630 and the head tags reference it by
absolute URL.

## Task 2 — Add invisible Event data (JSON-LD) for search & sharing

**Do:** In `index.html` `<head>`, add a `<script type="application/ld+json">`
block describing the wedding using schema.org. Use `@type": "Event"`, name
"Robin & Andy's Wedding", `startDate` `2027-05-21T16:30:00-05:00` (4:30 PM
Central), `location` as Salvage One, 1840 W Hubbard St, Chicago, IL 60622,
`image` pointing at the new `og:image` PNG, and `url`
`https://hortonhearsido.com/`. Set `eventAttendanceMode` to offline and
`eventStatus` to scheduled.

**Done when:** the JSON-LD is valid (paste-check against Google's Rich Results
test mentally — proper JSON, correct schema.org fields) and nothing renders
visibly on the page.

## Task 3 — Respect "reduce motion" accessibility settings

**Problem:** the site uses `scroll-behavior: smooth` and hover transforms on
buttons/cards. Users who enable "reduce motion" on their device should get
those animations suppressed.

**Do:** In `css/styles.css`, add a `@media (prefers-reduced-motion: reduce)`
block that sets `html { scroll-behavior: auto; }` and removes
transitions/transforms on `.btn`, `.registry-card`, and any other animated
element. Don't change default (motion-on) behavior at all.

**Done when:** with OS "reduce motion" on, there's no scroll animation or
hover movement; with it off, everything behaves as before.

## Task 4 — Load the Google Map only on click (performance + privacy)

**Problem:** the embedded Google Maps `<iframe>` in the "Our Day" section loads
Google's heavy, cookie-setting iframe on every visit, even for people who never
look at it.

**Do:** In `index.html`, replace the always-on `<iframe>` inside `.map-card`
with a lightweight placeholder of the **same dimensions** (reuse the existing
`min-height: 320px`) — e.g. a button labeled "Show map" over a simple
cream/green placeholder box. Add a small handler in `js/main.js` that, on
click, injects the existing Google Maps iframe (same `src`, `title`, `loading`,
`referrerpolicy` it has today). Keep the existing "Open in Google Maps" link
working as-is. Make the placeholder keyboard-accessible (real `<button>` with
an `aria-label`).

**Done when:** no request to google.com fires on page load; clicking the
placeholder loads the live map; the section's size and look are unchanged.

## Task 5 — Fix contrast, including the hard-to-read registry links

**Problem A (the obvious one):** On the green Registry section, the registry
card store names render in pale cream on the near-white card background
(`#fffdf2`) and are very hard to read. Cause: the card is an `<a>` inside
`.section-green`, where `.section-green a { color: var(--cream) }`, so the
`<h4>` store name **inherits cream**. (The `<p>` and "Visit registry →" are
already burgundy.)

**Do A:** In `css/styles.css`, explicitly set the registry card text to a dark,
readable color (use `--burgundy` or `--ink`). Make the selector specific enough
to win over `.section-green a` — e.g.
`.section-green .registry-card h4 { color: var(--burgundy); }` and confirm
`.registry-card .registry-go` and `.registry-card p` stay dark too. Verify the
store names are clearly legible on the card.

**Problem B (audit):** A couple of other pairings sit near the WCAG threshold —
cream text on the medium-green sections (`--green #5b8c5a`) and pink text
(`--pink`) on dark green. 

**Do B:** Check these with contrast ratios (target ≥ 4.5:1 for normal text,
≥ 3:1 for large text). If any fail, nudge the hex values *slightly* (e.g.
darken the green background or lighten the cream a touch) — changes should be
imperceptible to the eye but measurably over the line. Don't restyle anything;
only tune values that are actually failing.

**Done when:** registry store names are easily readable, and any
below-threshold text pairings now pass WCAG AA, with no visible design change.

## Task 6 — Add a safety net to the content rendering

**Problem:** `js/main.js` reads `window.SITE_CONTENT` (from the owner-editable
`content.js`). If the owner introduces a typo there, the script throws and the
page can go blank with no explanation.

**Do:** In `js/main.js`, guard the rendering so a missing or malformed
`SITE_CONTENT` (or any one missing array like `itineraries`, `hotels`,
`registries`, `faqs`) fails gracefully: log a clear `console.warn` naming the
problem, skip just the affected section, and let the rest of the page render.
Don't change behavior when content is valid.

**Done when:** deleting or breaking one key in `content.js` no longer blanks
the page — the other sections still render and the console explains what's
missing.

---

After all six: run `npm test`, eyeball `index.html` and `rsvp.html` in a
browser, commit each task on the `site-refinements` branch, and give the owner
a plain-language summary plus the command to preview the branch. Do not deploy.
