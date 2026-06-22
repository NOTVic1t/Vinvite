-- ============================================================================
-- VINVITE — MIGRATION 004: PACKAGE SETTINGS
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================================

create table if not exists package_settings (
  id uuid primary key default uuid_generate_v4(),
  package text unique not null check (package in ('basic', 'premium', 'exclusive')),
  max_guests int not null default 100,
  music_enabled boolean not null default false,
  -- allowed_themes: null means ALL themes allowed, otherwise JSON array of slugs
  allowed_themes jsonb default null,
  updated_at timestamptz not null default now()
);

-- Seed defaults
insert into package_settings (package, max_guests, music_enabled, allowed_themes) values
  ('basic',     100,  false, '["01-monstera-minimal","05-kasih-pastel","06-zaitun-islami"]'),
  ('premium',   500,  true,  null),
  ('exclusive', 9999, true,  null)
on conflict (package) do nothing;

-- RLS: only admin can read/write; resellers read to enforce on their clients
alter table package_settings enable row level security;

create policy "pkg_admin_all" on package_settings for all using (public.is_admin());
create policy "pkg_reseller_select" on package_settings for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'reseller')
);
