# Vinvite — Undangan Pernikahan Digital

A multi-tenant wedding invitation SaaS for the Indonesian market — built as a static
HTML/CSS/JS frontend (no build step, deploys straight to GitHub Pages) backed by Supabase.

**Made with Vinvite — By Victor Rizki Valentiano**

---

## What's inside

- `index.html` + `assets/` — the public marketing site
- `admin/` — the customer & platform-admin dashboard (login, invitation editor, guest
  manager, RSVP/guestbook viewer, theme picker, settings, order/user management)
- `engine/` — shared logic every invitation theme uses: data loading, countdown, RSVP,
  guestbook, gallery lightbox, music player, cover gate
- `themes/` — 15 independently designed invitation themes (3 fully built, 12 scaffolded
  with their design brief ready — see `docs/THEMES.md`)
- `supabase/schema.sql` — the full Postgres schema + Row Level Security policies
- `BUILD_SPEC.md` — the product spec this repo was built from
- `docs/` — theme roster status + roadmap for continuing the build

## Quick start

### 1. Push to GitHub

```bash
cd vinvite-platform
git init
git add .
git commit -m "Initial commit — Vinvite platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Turn on GitHub Pages

Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

### 3. Connect Supabase (for RSVP, guestbook, admin login, multi-tenant invitations)

Follow `supabase/README.md`. Until you do this, every theme still works in **preview mode**
with sample data — nothing is broken, RSVP/guestbook submissions just aren't saved.

### 4. Try it locally first (optional)

No server needed — every page is plain HTML. Open `index.html` directly in a browser, or
serve the folder with any static server, e.g. `python3 -m http.server`.

## How an invitation gets shared

1. A customer signs up at `/admin/login.html` and fills in their details at
   `/admin/pages/invitation-editor.html`.
2. They pick a theme at `/admin/pages/themes.html`.
3. They add guests at `/admin/pages/guests.html` — each guest gets a personal link like
   `themes/01-monstera-minimal/index.html?slug=radit-nindy-1234&to=Budi`.
4. The theme page loads that guest's data from Supabase via `engine/data-loader.js` and
   renders it with that guest's name in the "Kepada Yth." line.

## Adding more themes

See `docs/THEMES.md` and `docs/ROADMAP.md` — each unbuilt theme already has a written
art-direction brief in its `theme.json`, ready to build from in the next session.

## Credit

Every invitation theme, the marketing site, and the admin panel footer all carry the credit
line **"Made with Vinvite — By Victor Rizki Valentiano."** Please keep this attribution intact.
