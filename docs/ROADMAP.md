# Roadmap

## Status

- [x] Repo structure
- [x] Supabase schema (`supabase/schema.sql`) + RLS policies
- [x] Shared engine (`/engine/`): data loading, countdown, RSVP, guestbook, gallery, music, cover gate
- [x] Marketing/landing site (`/index.html`) — WhatsApp-first ordering, no self-serve signup
- [x] Admin panel pivoted to an Owner → Reseller → Client model (see `BUILD_SPEC.md` §1.1):
      multi-client dashboard, per-client editor/theme/guest/RSVP/guestbook pages scoped by
      `?id=`, reseller role management, no public registration
- [x] `supabase/migration_002_reseller_model.sql` — upgrade path for DBs set up before the pivot
- [x] 3 of 15 themes fully built (`01-monstera-minimal`, `02-kertas-emas`, `03-senja-sinematik`)
- [ ] Themes 4–15 (briefs already written in each `theme.json` — see `docs/THEMES.md`)
- [ ] Orders/payment verification flow (`orders.html` exists but isn't wired into the
      WhatsApp-order flow yet — currently a manual record-keeping page for the Owner)

## Next session checklist

1. Pick the next 3–4 themes from `docs/THEMES.md`.
2. For each: read its `theme.json` brief, design the token system, build `index.html` +
   `style.css` + `script.js` following the data contract used by the 3 existing built themes
   (copy their `id`/`data-*` attribute names so the engine and admin preview keep working).
3. Update `themes/themes.json` and `docs/THEMES.md` status to `built`.
4. Test by opening `themes/<slug>/index.html` directly (preview mode, no Supabase needed).

## Operational reminders (post-pivot)

- New reseller accounts: Supabase Dashboard → Authentication → Add user (no in-app sign-up).
- Set `assets/js/landing.js` → `OWNER_WHATSAPP_NUMBER` before going live.
- If upgrading an existing deployed project, run `supabase/migration_002_reseller_model.sql`.
