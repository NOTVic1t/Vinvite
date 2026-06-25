-- ============================================================================
-- VINVITE — MIGRATION 009: DRESS CODE + HASHTAG + RUNDOWN ICONS
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================================

-- Dress code info
alter table invitations add column if not exists dress_code_label text;
alter table invitations add column if not exists dress_code_colors jsonb not null default '[]';
-- Each color: { hex: "#FFFFFF", name: "Putih" }

-- Wedding hashtag / Instagram
alter table invitations add column if not exists hashtag text;
alter table invitations add column if not exists instagram text;

-- Rundown items now support an icon key
-- Each item: { time, title, desc, icon }
-- icon keys: "ceremony", "dinner", "photo", "music", "rings", "flowers", "party", "custom"
-- No schema change needed — rundown is already jsonb, just add icon field to items
