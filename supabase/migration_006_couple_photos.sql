-- ============================================================================
-- VINVITE — MIGRATION 006: COUPLE PHOTO COLUMNS
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================================

alter table invitations add column if not exists groom_photo_url text;
alter table invitations add column if not exists bride_photo_url text;
