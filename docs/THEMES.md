# Theme Roster

15 themes total. Each folder under `/themes/` is self-contained: `index.html`, `style.css`,
`script.js`, and `theme.json` (art-direction brief). Unbuilt themes currently show a
"coming soon" placeholder at `index.html` instead of the real invitation, but already have a
written design brief in `theme.json` so the next session can build straight from spec.

| # | Slug | Name | Category | Status |
|---|------|------|----------|--------|
| 1 | `01-monstera-minimal` | Monstera Minimal | Minimalist Modern | ✅ Built |
| 2 | `02-kertas-emas` | Kertas Emas | Luxury Royal | ✅ Built |
| 3 | `03-senja-sinematik` | Senja Sinematik | Cinematic Dark | ✅ Built |
| 4 | `04-melati-jawa` | Melati Jawa | Traditional Javanese | ⏳ Planned |
| 5 | `05-kasih-pastel` | Kasih Pastel | Romantic Pastel | ⏳ Planned |
| 6 | `06-zaitun-islami` | Zaitun Islami | Islamic Elegant | ⏳ Planned |
| 7 | `07-rimba-tropis` | Rimba Tropis | Rustic Tropical Garden | ⏳ Planned |
| 8 | `08-anggrek-boho` | Anggrek Boho | Boho Chic | ⏳ Planned |
| 9 | `09-kamar-vintage` | Kamar Vintage | Vintage Classic | ⏳ Planned |
| 10 | `10-geometri-berani` | Geometri Berani | Modern Bold Geometric | ⏳ Planned |
| 11 | `11-cahaya-bali` | Cahaya Bali | Balinese Tropical | ⏳ Planned |
| 12 | `12-padi-sunda` | Padi Sunda | Traditional Sundanese | ⏳ Planned |
| 13 | `13-mawar-klasik` | Mawar Klasik | Classic Romantic Floral | ⏳ Planned |
| 14 | `14-monokrom-galeri` | Monokrom Galeri | Minimal Editorial Photography | ⏳ Planned |
| 15 | `15-aurora-modern` | Aurora Modern | Modern Gradient | ⏳ Planned |

## Adding a theme yourself

1. Duplicate any built theme folder as a starting point for the engine wiring.
2. Re-design `index.html` markup + `style.css` + `script.js` fully — themes are not meant to
   share a visual skeleton, only the `/engine/` logic (countdown, RSVP, guestbook, gallery,
   music, data loading).
3. Keep the same `data-*`/`id` contract documented in `BUILD_SPEC.md` section 2 so any theme
   can render any invitation.
4. Add the theme to `themes/themes.json` and flip its `status` to `built` in this table.
