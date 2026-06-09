# Robin & Andy — Wedding Website 💒

A single-page wedding site for **Robin Beattie & Andy Horton — May 21, 2027 — Salvage One, Chicago, IL**.

Built with plain HTML, CSS, and JavaScript. **No build step, no installs, no frameworks** — you can
open it, edit it, and host it for free without knowing how to code.

## See it on your computer

**Easiest:** double-click `index.html`. It opens in your browser and everything works.

**Slightly fancier** (if you have [Node.js](https://nodejs.org) installed):

```bash
npm start        # serves the site at http://localhost:3000
npm test         # runs the RSVP validation tests
```

There is no build step — what's in this folder is exactly what gets published.

## How to edit the content (no coding needed)

| What you want to change | Where |
|---|---|
| Itineraries, hotels, registry links, FAQ, meal options | `js/content.js` — one friendly file, instructions at the top |
| Names, date, venue, timeline, dress code, parking, contact email | `index.html` — search for the text you see on the page and retype it |
| Colors and fonts | top of `css/styles.css` (the `:root` block has the five mood-board swatches) |
| Photos | drop files in `assets/images/` — see `assets/images/README.txt` |

Things still waiting on real info are marked with **`REPLACE`** or **`PLACEHOLDER`** comments —
search the project for those two words to find every open item.

## How the RSVP works

RSVPs are saved **in the guest's own browser** (localStorage). That means:

- ✅ great for previewing and sharing the design
- ⚠️ you will NOT receive guests' RSVPs — they stay on the guest's device

Before sending the link to guests, either hook the form to a real backend
(see the comment at the top of `js/rsvp.js` — `saveRsvp()` and `loadRsvps()` are the only
two functions to swap), or use a free form service (Google Forms, Formspree) and point the
RSVP button at it.

## Folder map

```
index.html              the whole page (all sections live here)
css/styles.css          all styling; palette variables at the top
css/print.css           print-friendly RSVP confirmation
js/content.js           ⭐ EDIT ME — itineraries, hotels, registry, FAQ
js/validate.js          RSVP validation rules (tested)
js/rsvp.js              RSVP form behavior + localStorage
js/main.js              nav, accordion, rendering, copy-links button
tests/validate.test.js  run with `npm test`
assets/                 favicon, social-preview image, photo drop folder
DEPLOY-GUIDE.md         step-by-step "put this on the internet" guide
CHANGELOG.md            what's done vs. what's a placeholder
```

## Putting it on the internet

See **[DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)** — written for someone who has never deployed
anything before. The short version: GitHub Pages hosts this exact folder for free.

## Design notes & assumptions

- Palette traced from the mood board swatches: cream `#faf3da`, pink `#f2c2cf`,
  burgundy `#5a2434`, green `#5b8c5a`, forest `#11301f`.
- Fonts are the closest free matches to the draft stationery: **Marcellus** for the wide
  roman capitals, **Cormorant Garamond** for the italic serif. Swap in licensed fonts in
  `css/styles.css` if you have the exact ones.
- The hero arch and stained-glass section dividers are hand-traced SVG versions of the
  save-the-date and invitation motifs.
- Ceremony timeline, dress code, and hotel info are sensible placeholders — confirm with
  the venue and edit.
