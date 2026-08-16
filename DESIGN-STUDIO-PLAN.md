# Design Studio — Plan (scoped, not yet built)

*Status: **PLANNING approved, build not started.** Scoped 2026-06-13 with Andy.
Decisions locked: build Tiers 0 + 1; publishing model is "propose-to-Claude"
(no self-publish to the live site). Tier 2 is a later option.*

## The goal, in one paragraph

Robin is producing final stained-glass artwork in Adobe Illustrator (using a
stained-glass toolkit) to replace the placeholder shapes the site launched
with. Andy needs (1) a clean pipeline to get that artwork into the site,
(2) a hands-on way to experiment with colors/fonts/artwork and (3) a precise
way to hand the result to Claude as instructions. A full Squarespace-style
drag-and-drop editor was considered and rejected as overkill — layout isn't
what changes; artwork and palette are.

## What we are NOT building (agreed)

- No drag-and-drop page editor, no layout editing, no text editing UI
  (site copy already lives in `js/content.js`).
- No self-publishing of visuals from the admin to the live site. Every visual
  change still ships through: branch → screenshots → Andy approves → merge.

---

## Tier 0 — Artwork slot system + Illustrator export guide

**Idea:** every decorative graphic becomes a named "slot" backed by one SVG
file in `assets/art/`. Swapping artwork = replacing one file. No slot, no
confusion about "which arch do you mean."

### Slot inventory (initial)

| Slot key        | What it is                              | Today lives in            | Canvas (viewBox) |
|-----------------|------------------------------------------|---------------------------|------------------|
| `arch`          | Hero arch window frame                   | inline SVG in index.html  | 680 × 980        |
| `divider`       | Stained-glass flower border (sections)   | inline `<defs>` in index  | 900 × 120        |
| `favicon`       | Browser-tab icon                         | assets/favicon.svg        | 64 × 64          |
| `og-art`        | Social preview artwork                   | assets/og-image-source.svg| 1200 × 630       |
| `rsvp-header`   | (future) accent on the RSVP screen       | — (text only today)       | TBD              |
| `corner`        | (future) card corner flourish            | — (none today)            | TBD              |

### Technical approach (the important subtlety)

The current motifs are **inline SVG using CSS variables** for color — that's
why palette changes recolor the artwork. A plain `<img src="art/arch.svg">`
CANNOT use CSS variables. So the loader must **fetch each slot's SVG file and
inject it inline** at page load (tiny JS, cached, with the current inline art
as fallback). Rule for all incoming artwork: **fills/strokes get mapped to the
palette tokens** (`var(--burgundy)` etc.) during intake, so Robin's pieces
recolor with the theme. Intake = Claude adapts each delivered SVG once:
normalize viewBox, strip Illustrator metadata, map colors to tokens, optimize.

### Export guide for Robin (`assets/art/EXPORT-GUIDE.md`, to be written)

- Work at the slot's canvas size (table above); one artboard per motif.
- Keep shapes as vector paths (no embedded images, no rasterized effects —
  stained-glass gradients/textures OK if vector; if the toolkit rasterizes,
  export that piece as high-res PNG and we'll discuss).
- File → Export As → SVG: Styling "Presentation attributes", Font "Convert to
  outlines", Decimal 2, Minify off, Responsive on.
- Name files by slot: `arch.svg`, `divider.svg`, … and hand them to Andy →
  Claude (chat upload or drop into `assets/art/incoming/`).
- Stick to the palette where possible; anything off-palette gets mapped to the
  nearest token during intake (flag pieces where exact color matters).

### Tier 0 acceptance

- All existing motifs load from `assets/art/*.svg` with zero visible change.
- Palette variables still recolor every motif.
- EXPORT-GUIDE.md exists; Robin can produce a valid `divider.svg` from it and
  swapping the file changes the live divider (after normal review/merge).

---

## Tier 1 — "Design" tab in the admin

A sixth admin tab. **A control panel + live preview + spec exporter — not an
editor.** Nothing it does touches the live site directly.

### Controls (v1 — deliberately few)

- **Palette:** color pickers for the 6 tokens (cream, pink, burgundy, green,
  forest, ink) + the section-green background. Live WCAG contrast readout with
  pass/fail per pairing (we've been burned; make it visible).
- **Type:** display font & body font (curated dropdown of ~6 vetted Google
  Fonts pairings), base text size, heading letter-spacing.
- **Shape:** card corner radius, divider width, hero arch max-width.
- **Artwork slots:** one row per slot — current art thumbnail, "try a file…"
  upload (preview-only, held in browser memory), revert.

### Live preview

The tab embeds the real `index.html` in an iframe. Changes apply instantly by
injecting CSS-variable overrides and swapping slot SVGs **inside the iframe
only** (postMessage; a tiny listener in the site that activates only in
preview mode). Mobile/desktop preview toggle. Refresh = everything resets to
the real site; nothing persists.

### "Send to Claude" (the whole point)

A **Download design spec** button produces a small bundle:

```
design-spec-2026-06-13/
  spec.json      ← only what changed: {"--burgundy": {"from": "#5a2434", "to": "#4d1f2e"}, ...}
  notes.txt      ← free-text box: "thicker lead lines on the divider; arch feels heavy"
  art/           ← any uploaded slot SVGs
```

Andy hands the bundle (or its contents) to Claude in chat/Cowork. Claude
implements on a branch, runs the usual browser verification + screenshots,
Andy approves, merge → auto-deploy. Optionally later: a "save draft to
database" so specs queue up inside the admin instead of downloads.

### Tier 1 acceptance

- Change a color → preview updates instantly; live site unchanged.
- Upload a test SVG into the divider slot → preview shows it everywhere the
  divider appears; live site unchanged.
- Export produces a spec that Claude can implement without asking "which
  green?" — verified by doing one real round-trip end to end.
- Contrast readout flags any AA failure the moment a color is picked.

---

## Tier 2 (later, only if needed) — click-to-annotate

Preview mode where clicking any element pins a note to it; notes save to a
`design_feedback` table Claude reads. Decide after living with Tier 1.

## Build order & rough size

1. **Tier 0** — one working session. Do first; unblocks Robin immediately.
2. **Tier 1** — two to three sessions (tab UI, preview bridge, spec export).
3. First real round-trip with Robin's actual toolkit output = the true test.

## Risks / open questions

- **Toolkit output unknown.** If the stained-glass toolkit produces huge or
  rasterized SVGs, intake gets heavier. → Ask Robin for one sample piece
  ASAP; Tier 0's guide may need adjusting to reality.
- **Color-mapping tension.** Stained glass may need more colors than 6 tokens
  (glass shades, lead lines). Likely answer: add `--glass-*` accent tokens
  during intake of the first real piece.
- **Preview fidelity.** The iframe preview is the real site, so fidelity is
  high; fonts limited to the curated list to keep licensing/perf sane.
- **Scope creep.** The moment "move this section up" comes up, that's content/
  layout — handled in chat with Claude, not added to this tool.
