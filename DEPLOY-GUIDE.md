# How to put your wedding website on the internet 🌐

This guide assumes you have **never coded or deployed a website before**. That's fine —
this site was built so that hosting it is mostly clicking buttons. Total time: ~10 minutes.

We'll use **GitHub Pages**, which is free, has no ads, and works forever. Your website code
already lives on GitHub (that's where this file is!), so you're 80% done.

---

## Option 1: GitHub Pages (recommended — free, ~5 clicks)

GitHub Pages takes the files in this repository and serves them as a real website.

1. **Open your repository on github.com** (the page where you can see `index.html`,
   the `css` folder, etc.).
2. Make sure the files are on the **`main` branch**. If your changes are on another branch,
   open the **Pull requests** tab → **New pull request** → merge your branch into `main`
   (GitHub will walk you through it with green buttons).
3. Click **Settings** (the gear tab at the top of the repository).
4. In the left sidebar, click **Pages**.
5. Under **Build and deployment**:
   - **Source**: choose **Deploy from a branch**
   - **Branch**: choose **`main`**, folder **`/ (root)`**
   - Click **Save**
6. Wait 1–2 minutes, then refresh the page. A green box appears with your address:

   ```
   https://YOUR-USERNAME.github.io/Wedding-Site/
   ```

7. Open that link — that's your live wedding website. Send it to anyone! 🎉

### Updating the site later

Any time files on `main` change (editing right on github.com works: open a file →
pencil icon → edit → **Commit changes**), the live site updates itself within a minute
or two. There is no "redeploy" button to press.

---

## Option 2: Netlify (also free, drag-and-drop, prettier URLs)

If you'd rather not touch GitHub settings:

1. Go to [netlify.com](https://www.netlify.com) and sign up (you can sign in *with* GitHub).
2. Click **Add new site → Import an existing project → GitHub** and pick `Wedding-Site`.
3. Leave every build setting blank/default (there is nothing to build) and click **Deploy**.
4. You'll get a URL like `https://something-random.netlify.app`. In **Site settings →
   Change site name**, rename it to something like `robin-and-andy.netlify.app`.

Netlify also auto-updates whenever the GitHub repository changes.

---

## Want a custom address like robinandandy.com?

1. Buy the domain (~$10–15/year) at a registrar like Namecheap, Porkbun, or Google-successor
   Squarespace Domains.
2. **GitHub Pages:** repository **Settings → Pages → Custom domain**, type your domain, save,
   then follow the DNS instructions GitHub shows (you'll copy 4 IP addresses into your
   registrar's DNS page — the registrar's support chat can do this with you in minutes).
3. **Netlify:** **Domain settings → Add custom domain** and follow the prompts (even easier).
4. Tick **Enforce HTTPS** once it's offered (usually after ~1 hour).

---

## Checklist before you send the link to guests

- [ ] Replace the `example.com` registry links in `js/content.js`
- [ ] Fill in real hotel blocks in `js/content.js`
- [ ] Confirm the ceremony timeline in `index.html`
- [ ] Swap `assets/og-image.svg` for a real photo PNG so the link preview looks great in texts
- [ ] **Important:** hook the RSVP form to something that actually reaches you —
      right now answers only save on each guest's own device. Easiest no-code fix:
      create a free Google Form and ask us to point the RSVP section at it.

## If something looks broken

- Changes not showing up? Wait 2 minutes, then hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).
- Page is blank? Make sure `index.html` is in the **root** of the repository, not in a subfolder.
- Map not loading? Some ad-blockers hide Google Maps embeds — try another browser.
- Still stuck? Open an issue on the repository or just ask Claude in a new session:
  *"My GitHub Pages site isn't working, here's what I see…"*
