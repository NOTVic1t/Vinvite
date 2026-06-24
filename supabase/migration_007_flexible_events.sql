-- ============================================================================
-- VINVITE — MIGRATION 007: FLEXIBLE EVENTS + SECTION CONTROL
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================================

-- 1. Replace the 10 akad/resepsi columns with a flexible events array.
--    Each event: { name, date, time_start, time_end, venue_name, venue_address, maps_url }
alter table invitations add column if not exists events jsonb not null default '[]';

-- 2. Migrate existing akad/resepsi data into the new events column
update invitations set events = (
  select jsonb_agg(e) from (
    select jsonb_build_object(
      'name', 'Akad Nikah',
      'date', akad_date,
      'time_start', akad_time,
      'time_end', null,
      'venue_name', akad_venue_name,
      'venue_address', akad_venue_address,
      'maps_url', akad_maps_url
    ) as e where akad_date is not null
    union all
    select jsonb_build_object(
      'name', 'Resepsi',
      'date', resepsi_date,
      'time_start', resepsi_time,
      'time_end', null,
      'venue_name', resepsi_venue_name,
      'venue_address', resepsi_venue_address,
      'maps_url', resepsi_maps_url
    ) as e where resepsi_date is not null
  ) sub
) where akad_date is not null or resepsi_date is not null;

-- 3. Sections that can be toggled off per invitation.
--    Array of section keys that are HIDDEN. Empty = all shown.
--    Keys: "countdown", "story", "gallery", "gift", "maps", "quote"
alter table invitations add column if not exists hidden_sections jsonb not null default '[]';

-- 4. Custom section label overrides per invitation.
--    Object: { story: "Our Story", gallery: "Foto Kami", quote: "...", etc. }
alter table invitations add column if not exists section_labels jsonb not null default '{}';

-- 5. Custom quote text and source
alter table invitations add column if not exists quote_text text;
alter table invitations add column if not exists quote_source text;

-- Note: old akad_*/resepsi_* columns are kept for now so nothing breaks.
-- They can be dropped in a future migration once all invitations use events[].
