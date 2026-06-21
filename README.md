# Vinvite — Undangan Pernikahan Digital

A multi-tenant wedding invitation SaaS for the Indonesian market — built as a static
HTML/CSS/JS frontend (no build step, deploys straight to GitHub Pages) backed by Supabase.

**Made with Vinvite — By Victor Rizki Valentiano**

---

## What's inside

- `index.html` + `assets/` — the public marketing site (WhatsApp-first ordering)
- `admin/` — the Owner/Reseller dashboard (login, multi-client list, invitation editor,
  guest manager, RSVP/guestbook viewer, theme picker, settings, reseller & order management)
- `engine/` — shared logic every invitation theme uses: data loading, countdown, RSVP,
  guestbook, gallery lightbox, music player, cover gate
- `themes/` — 15 independently designed invitation themes (3 fully built, 12 scaffolded
  with their design brief ready — see `docs/THEMES.md`)
- `supabase/schema.sql` — the full Postgres schema + Row Level Security policies
- `supabase/migration_002_reseller_model.sql` — run this if you already set up Supabase
  before the Owner/Reseller/Client pivot
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

## How it works: Owner → Reseller → Client

Vinvite runs as a **closed sales model**, not self-serve signup:

- **You (Owner/Admin):** see and manage every client across every reseller, plus promote/demote
  reseller accounts at `/admin/pages/users.html`.
- **Resellers:** have a login, but only manage the clients they personally create. They have no
  visibility into other resellers' clients.
- **Clients (the couple):** never get a login. They order via WhatsApp, and the reseller/admin
  builds and manages the entire invitation for them in the admin panel. The client's name and
  phone number are stored on the invitation itself just for reference (`client_name`,
  `client_phone`, `internal_notes` fields in the editor).

### Set your WhatsApp number

Open `assets/js/landing.js` and replace the placeholder:

```js
const OWNER_WHATSAPP_NUMBER = "62YOUR_WHATSAPP_NUMBER"; // e.g. "6281234567890"
```

Every "Pesan via WhatsApp" button on the landing page opens a chat to this number with a
prefilled message (and the package name, for the pricing buttons).

### Creating a reseller account

There's no public registration form. To add a reseller: Supabase Dashboard →
**Authentication → Users → Add user** → set an email + temporary password → send the
credentials to them yourself. A database trigger automatically creates their profile with the
`reseller` role. Full details in `supabase/README.md`.

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

### 3. Connect Supabase (for the admin panel, RSVP, and guestbook)

Follow `supabase/README.md`. Until you do this, every theme still works in **preview mode**
with sample data — nothing is broken, RSVP/guestbook submissions just aren't saved.

### 4. Try it locally first (optional)

No server needed — every page is plain HTML. Open `index.html` directly in a browser, or
serve the folder with any static server, e.g. `python3 -m http.server`.

## Building an invitation for a client

1. A client messages you on WhatsApp wanting an invitation.
2. You (or your reseller) log in at `/admin/login.html` and tap **+ Tambah Klien Baru**.
3. Fill in the client's contact info, the couple's details, events, gallery, gift accounts —
   all at `/admin/pages/invitation-editor.html?id=...`.
4. Pick a theme at the **Tema** tab, add guests at the **Tamu** tab — each guest gets a
   personal link like `themes/01-monstera-minimal/index.html?slug=radit-nindy-1234&to=Budi`,
   with a ready-made WhatsApp share button.
5. Set status to **Published** so the link works for guests, then send it over.

## Adding more themes

See `docs/THEMES.md` and `docs/ROADMAP.md` — each unbuilt theme already has a written
art-direction brief in its `theme.json`, ready to build from in the next session.

## Credit

Every invitation theme, the marketing site, and the admin panel footer all carry the credit
line **"Made with Vinvite — By Victor Rizki Valentiano."** Please keep this attribution intact.
