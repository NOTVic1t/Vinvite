# Roadmap

## Status

- [x] Repo structure
- [x] Supabase schema (`supabase/schema.sql`) + RLS policies
- [x] Shared engine (`/engine/`): data loading, countdown, RSVP, guestbook, gallery, music, cover gate
- [x] Marketing/landing site (`/index.html`)
- [x] Admin panel: auth, dashboard, invitation builder, guest manager, RSVP/guestbook viewer, theme picker, settings
- [x] 3 of 15 themes fully built (`01-monstera-minimal`, `02-kertas-emas`, `03-senja-sinematik`)
- [ ] Themes 4–15 (briefs already written in each `theme.json` — see `docs/THEMES.md`)
- [ ] Guest unique-link generator + WhatsApp share text in admin
- [ ] Order/payment verification flow in admin (`orders` table already exists)

## Next session checklist

1. Pick the next 3–4 themes from `docs/THEMES.md`.
2. For each: read its `theme.json` brief, design the token system, build `index.html` +
   `style.css` + `script.js` following the data contract used by the 3 existing built themes
   (copy their `id`/`data-*` attribute names so the engine and admin preview keep working).
3. Update `themes/themes.json` and `docs/THEMES.md` status to `built`.
4. Test by opening `themes/<slug>/index.html` directly (preview mode, no Supabase needed).
