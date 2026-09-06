# Handoff to Claude Code — ship the Vendor HQ admin tab

**From:** Andy (Cowork session), 2026-08-02
**Goal:** Get the already-built **Vendor HQ** admin tab reconciled with `origin/main` and deployed to the live site (https://hortonhearsido.com). Andy is a non-coder — do the git work and explain the result in plain language.

## What Vendor HQ is
A read-at-a-glance admin dashboard of every wedding vendor relationship (contract, deposit, balance, whose court the ball is in, this-week's action, red flags), plus hotel room-block and DJ-lead tables. Color-coded green/yellow/red. Data lives in one plain-data object (`window.VENDOR_HQ`) that a weekly Gmail-scan task refreshes.

## Current state (already implemented, just not deployed)
- **`js/vendor-hq.js`** — the tab: `window.VENDOR_HQ` data object + a `render()` wired into `app.tabHooks.vendorhq`.
- **`css/admin.css`** — the `.vhq-*` styles exist (cards, tags, table rows, front-runner star, etc.).
- **`admin.html`** — already wired: tab button (`data-tab="vendorhq"`), `#vendorhq-heading`, `#vendorhq-sheet` container, and `<script src="js/vendor-hq.js">`.

So no new feature work is needed — this is a **git reconcile + deploy** task.

## The git situation (the actual problem to solve)
- Local `main` has **1 commit not on origin**: `b347538` *"Add Vendor HQ admin tab: vendor dashboard with hotels + DJ leads"*.
- Local `main` is **7 commits behind `origin/main`** (registry changes, Design Studio plan, keep-alive workflow — all unrelated to Vendor HQ).
- There are also **uncommitted local edits to `js/vendor-hq.js`** — the Aug 2 weekly data refresh (3 photographers confirmed, Palmer House hotel offer, Engine proposals, Kimpton Gray declined). ~62 insertions / 35 deletions. This should ship too.

## What to do
1. **Commit the uncommitted data refresh** to `js/vendor-hq.js` on its own (message e.g. `Vendor HQ: Aug 2 weekly refresh`). Commit **only** Vendor HQ changes — leave the other untracked files in the repo (`HOW-TO-PREVIEW-AND-PUBLISH.md`, `REFINEMENT-PROMPT.md`, the planner PDF, stained-glass assets) alone unless Andy says otherwise.
2. **Reconcile the divergence:** rebase local `main` onto `origin/main` (`git pull --rebase origin main`) to keep history linear. The Vendor HQ work is isolated (new JS file, additive CSS, additive `admin.html` tab), so conflicts are unlikely — if any arise, they'll be in `admin.html` or `css/admin.css`; resolve by keeping both the origin changes and the Vendor HQ additions.
3. **Verify before pushing:**
   - `.vhq-*` styles present in `css/admin.css`.
   - `admin.html` still has the tab button, `#vendorhq-sheet`, and the `<script>` tag.
   - Open `admin.html`, log in, click **Vendor HQ** — summary cards, vendor table, action list, at-risk, hotels, and DJ tables all render with no console errors.
   - Run `npm test` (should pass — validation logic only).
4. **Deploy:** push to `main`. The `deploy-pages.yml` workflow mirrors `main` → `gh-pages`; wait ~2 min. No manual step.

## Acceptance criteria
- `origin/main` contains the Vendor HQ commit(s) **and** all 7 prior origin commits (nothing lost from either side).
- Live `/admin.html` shows the Vendor HQ tab with the Aug 2 data.
- `npm test` passes; no console errors on the tab.

## Notes / conventions (from CLAUDE.md)
- Vanilla HTML/CSS/JS, no build step. Committing to `main` = deploying.
- `js/vendor-hq.js` is the single source of truth for this tab; the weekly assistant task pastes refreshes into that same `window.VENDOR_HQ` object.
- Never commit secrets (service_role key, admin password, Resend key) — none are involved here.
