# Vinvite — Master Build Specification

This is the refined product spec this repository is built from. It exists so any future session
(human or AI) can pick up work without re-deriving intent.

## 1. What this is

**Vinvite** is a multi-tenant digital wedding invitation SaaS for the Indonesian market — a
ground-up build in the same product category as Indoinvite, Undanganku, and Datengdong:

- A **public marketing site** where couples discover the product and order via WhatsApp.
- A **theme library** of fully bespoke, independently designed invitation micro-sites
  (minimum 15), each covering the standard Indonesian wedding-invite feature set.
- An **Owner/Reseller admin panel** where staff create and manage invitations on behalf of
  clients — without the client ever needing to touch code or have a login.
- A **Supabase backend** (Postgres + Auth + Storage) so the whole frontend can be static and
  deployed directly to GitHub Pages with zero build step.

## 1.1 Business model: Owner → Reseller → Client (added after initial build)

The platform pivoted away from self-serve signup. There is no public registration form.

- **Owner (admin role):** sees and manages every invitation across every reseller; can
  promote/demote reseller accounts.
- **Reseller (reseller role):** has a login, manages only the clients they personally create.
- **Client (the couple):** has no account. They order via WhatsApp; the reseller/admin fills
  in everything for them. `client_name` / `client_phone` / `internal_notes` fields on the
  `invitations` table hold their contact info for reference only.
- Reseller accounts are created manually in Supabase Dashboard (Authentication → Add user); a
  database trigger (`handle_new_user`) auto-creates their `profiles` row with role `reseller`.
- The admin panel's data model shifted from "one invitation per account" to "many invitations
  per reseller account" — `dashboard.html` is now a client list, and the editor/theme/guest/
  RSVP/guestbook pages are all scoped by an `?id=` query param identifying which invitation.

## 2. Required feature set (per invitation, all themes)

Every theme must support the same data contract so any invitation can use any theme:

- Cover/opening screen with guest name ("Kepada Yth. Bapak/Ibu ...") and a tap-to-open gate
- Couple names, nicknames, parents' names
- Countdown timer to the event
- Akad/Pemberkatan + Resepsi event details (date, time, venue, Google Maps link) — one or both
- Love story timeline (repeatable entries: date, title, text)
- Photo gallery with lightbox
- Background music toggle
- Digital gift / "amplop digital" panel (bank + e-wallet transfer details, copy-to-clipboard)
- RSVP form (attendance status, guest count, message) written to Supabase
- Guest book / wishes wall (public write, public read, newest first)
- Footer credit: **"Made with Vinvite — By Victor Rizki Valentiano"**

## 3. Architecture decisions

- **No build tooling.** Plain HTML/CSS/JS only, so the repo can be pushed to GitHub Pages and
  work immediately with no compile step.
- **Shared engine, bespoke skin.** Logic that is identical across every invitation (countdown
  math, Supabase reads/writes, RSVP/guestbook submission, gallery lightbox behavior, music
  toggle, data loading by slug) lives once in `/engine/`. Every theme's HTML/CSS layout,
  typography, color system, motion, and signature visual moment is independently designed —
  no shared template skeleton, no swapped CSS variables on one master layout. Themes call the
  shared engine functions from their own `script.js`.
- **Multi-tenant by slug.** `index.html?slug=ayu-bagus` (or, post-deploy, a clean URL route)
  loads that invitation's row from Supabase and renders it into whichever theme it's assigned.
- **Admin is a separate static app** under `/admin/`, gated by Supabase Auth, talking to the
  same Postgres tables under Row Level Security.

## 4. Theme roster (15, status tracked in `docs/THEMES.md`)

Each theme has its own art direction brief (palette, type pairing, layout concept, one signature
motion/visual moment) — see each theme's `theme.json` for its tokens. Categories span the range
a real Indonesian client base expects: minimalist, traditional/cultural (Javanese, Sundanese,
Balinese, Islamic), luxury, romantic/floral, cinematic/dark, boho, vintage, and modern-bold.

## 5. Build batches

Hand-building 15 independent designs is paced across sessions:

- **Batch 1 (this session):** core engine, marketing site, admin panel, Supabase schema, and
  3 fully built themes (`01-monstera-minimal`, `02-kertas-emas`, `03-senja-sinematik`).
- **Batch 2+:** remaining 12 themes, ~3–4 per session. Each unbuilt theme folder already
  contains its `theme.json` art-direction brief so the next session builds straight from spec.

## 6. Credit requirement

"By Victor Rizki Valentiano" appears in: every invitation theme footer, the marketing site
footer, the admin panel footer, and this repo's README.
