# How to preview a branch and publish it live

Plain-language guide for the wedding site. No prior coding needed — just follow
the steps. You'll use your **Ubuntu terminal** (the one you used to clone the
site) for the commands, and your normal web browser to look at the result.

**The one rule to remember:** the `main` branch is the LIVE site. The moment you
push to `main`, the real website updates (about 2 minutes later). Any other
branch — like `site-refinements` — is a private draft that nobody else can see.
So you can experiment freely on a branch and only go live when you're ready.

---

## Step 0 — Open the project in Ubuntu

Open Ubuntu and run this once each session to move into the site folder:

```
cd /mnt/c/Users/horto/Claude/Projects/Wedding
```

(That `/mnt/c/...` is just how Ubuntu reaches your Windows folder.)

## Step 1 — See what branches exist and where you are

```
git branch
```

This lists your branches. The one with a `*` next to it is the one you're
currently on. After Claude Code finishes, you should see `site-refinements`
in the list.

## Step 2 — Switch to the draft branch

```
git checkout site-refinements
```

This loads the draft version of the files into the folder. Nothing is public —
you're just looking at the proposed changes on your own computer.

## Step 3 — Preview it in your browser

You don't need any server. In Windows, open File Explorer, go to
`C:\Users\horto\Claude\Projects\Wedding`, and **double-click `index.html`** —
it opens in your browser showing the draft. Click around, check the registry
links are readable now, try the map button, etc.

(You need to be online — the fonts and Google Map load from the internet.)

To preview the RSVP page too, double-click `rsvp.html` the same way.

## Step 4 — Decide

**If you like it →** go to Step 5 to publish.

**If you DON'T like it →** just switch back to the live version and the draft is
set aside, untouched:

```
git checkout main
```

Nothing was ever public, so there's nothing to undo. You can return to the
draft anytime with `git checkout site-refinements`.

---

## Step 5 — Publish it live

When you're happy with the draft, these three commands merge it into `main` and
push it, which triggers the automatic deploy:

```
git checkout main
git merge site-refinements
git push
```

That's it. Wait about 2 minutes, then visit **https://hortonhearsido.com** and
refresh to see the changes live. (If your browser shows the old version, do a
hard refresh: Ctrl+Shift+R.)

### If `git push` asks you to log in

Use your GitHub username (`hortonandy96-glitch`) and your **personal access
token** as the password — the same token you used when cloning. (GitHub no
longer accepts your account password here.)

---

## Handy extras

**Tidy up after publishing** (optional) — once the draft is live on `main`, you
can delete the draft branch:

```
git branch -d site-refinements
```

**See exactly what changed** before publishing:

```
git diff main site-refinements
```

Press `q` to exit that view.

**Made a change you regret, before pushing?** As long as you haven't pushed to
`main`, nothing is public. Ask Claude (or Claude Code) and it can help you roll
back — don't worry about breaking anything that's live.

---

### Quick reference

| I want to…                        | Command                              |
|-----------------------------------|--------------------------------------|
| Go into the project               | `cd /mnt/c/Users/horto/Claude/Projects/Wedding` |
| See branches / where I am         | `git branch`                         |
| Look at the draft                 | `git checkout site-refinements`      |
| Go back to the live version       | `git checkout main`                  |
| Publish the draft (go live)       | `git checkout main` → `git merge site-refinements` → `git push` |
| See what changed                  | `git diff main site-refinements`     |
