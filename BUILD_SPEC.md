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

## 7. Animation standard (added after initial build)

Every theme — the 3 built and all future ones — uses the shared `/engine/scroll-fx.js`:

- `data-reveal` on content blocks → fade/slide-up on scroll into view
- `data-parallax data-parallax-speed="0.1"` on photos/background layers → subtle depth on scroll
- `window.initFloatingParticles(...)` → theme-appropriate ambient motion (e.g. falling leaves,
  gold sparkle, rising embers — pick a symbol and direction that fits the theme's mood, not a
  generic default)
- `window.initScrollProgress("#scroll-progress")` → thin progress bar, themed color
- CSS `scroll-snap-type: y proximity` + `scroll-snap-align: start` per section

All of this respects `prefers-reduced-motion` automatically inside `scroll-fx.js` — no per-theme
handling needed. Each theme also includes `engine/demo-banner.js`, which auto-shows a "this is a
preview" bar with a WhatsApp CTA whenever the page is opened in self-serve demo mode (see §8).

## 8. Self-serve "Coba Gratis" demo mode (added after initial build)

`coba-gratis.html` lets a visitor preview a theme with their own names/date with no login and no
WhatsApp contact required yet. It redirects to
`themes/{slug}/index.html?demo=1&groom=...&bride=...&date=...`. `engine/data-loader.js` detects
`?demo=1` and builds invitation data from the URL params (merged with sample data for anything
not provided) instead of querying Supabase. `engine/demo-banner.js` then shows the order-now bar.
This is separate from the reseller/admin-built flow — demo previews are never saved anywhere.

## 9. WhatsApp ordering (added after initial build)

There's no self-serve checkout. `assets/js/landing.js` builds `wa.me` links with a prefilled
message in the form "Halo Vinvite, saya [isi nama Anda] mau buat undangan dengan tema X" —
theme-aware when the click originated from a specific theme (gallery tile, demo banner), generic
otherwise. The number comes from `engine/config.js` → `VINVITE_CONFIG.WHATSAPP_NUMBER`, shared
with the demo banner so there's one place to configure it.

## 10. Embedded maps + social proof (added after initial build)

Every theme — built and future — includes:

- `engine/maps-embed.js` → `window.injectMapsEmbed("#akad-map", address)` renders a no-API-key
  Google Maps iframe preview under each event card (in addition to the existing "Buka di Google
  Maps" link button). Hides itself gracefully if no address is set.
- `engine/social-proof.js` → `window.initSocialProof("#social-proof", invitationId)` shows
  "X orang akan hadir" near the RSVP section, summed from confirmed RSVPs. Shows an illustrative
  placeholder in demo/preview mode (no real invitation row), hides itself if the real count is 0.

Both need a `<div id="akad-map" class="map-embed" hidden></div>` / `id="resepsi-map"` pair near
each event card, and a `<p id="social-proof" class="social-proof" hidden></p>` near the RSVP
form, styled per-theme (see the 3 built themes for the pattern).

## 11. Admin: Excel/CSV import & export (added after initial build)

`admin/js/admin-excel.js` (uses the SheetJS CDN library) gives every admin page:

- `window.parseExcelFile(file)` → array of row objects from an uploaded .xlsx/.csv
- `window.mapRowsToGuests(rows)` → loosely matches column headers (Nama/WhatsApp/Grup/Sesi,
  case-insensitive) into the `guests` table shape
- `window.exportToExcel(data, filename, sheetName)` → downloads any array of objects as .xlsx
- `window.downloadGuestTemplate()` → downloads a starter template for guest import

`guests.html` uses this for bulk guest import (with a preview-before-confirm step) and guest
list export; `rsvp.html` uses it to export RSVP responses. Pattern to reuse for any future
export-needing admin page: include the SheetJS CDN script + `admin-excel.js`, then call
`exportToExcel`.
