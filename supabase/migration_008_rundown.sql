-- =============================================================================
-- VINVITE — MIGRATION 008: SUSUNAN ACARA (RUNDOWN)
-- Adds an optional, admin-editable jam-per-jam rundown, toggleable via
-- hidden_sections (key: "rundown") same as every other section.
-- =============================================================================

alter table invitations
  add column if not exists rundown jsonb not null default '[]';
  -- Each item: { time: "08.00 WIB", title: "Akad Nikah", desc: "..." }
