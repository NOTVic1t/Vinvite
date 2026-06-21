-- ============================================================================
-- VINVITE — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PROFILES (extends auth.users; 'admin' role manages the whole platform)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'reseller' check (role in ('admin', 'reseller')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- INVITATIONS (one row per couple's invitation)
-- ----------------------------------------------------------------------------
create table if not exists invitations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade, -- the reseller/admin managing this on the client's behalf
  slug text unique not null,
  theme_slug text not null default '01-monstera-minimal',

  client_name text,   -- the couple's own name/contact, since they have no login
  client_phone text,
  internal_notes text, -- reseller's private notes (e.g. payment status from WA order)

  groom_name text not null,
  groom_nickname text,
  groom_parents text,
  bride_name text not null,
  bride_nickname text,
  bride_parents text,

  cover_image_url text,
  music_url text,

  akad_date date,
  akad_time text,
  akad_venue_name text,
  akad_venue_address text,
  akad_maps_url text,

  resepsi_date date,
  resepsi_time text,
  resepsi_venue_name text,
  resepsi_venue_address text,
  resepsi_maps_url text,

  love_story jsonb not null default '[]',     -- [{date,title,text}]
  gallery jsonb not null default '[]',        -- [imageUrl, ...]
  gift_accounts jsonb not null default '[]',  -- [{type,bank_name,account_number,account_holder}]

  package text not null default 'basic' check (package in ('basic', 'premium', 'exclusive')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invitations_user on invitations(user_id);
create index if not exists idx_invitations_slug on invitations(slug);

-- ----------------------------------------------------------------------------
-- GUESTS (personalized invite list, each gets a unique shareable link)
-- ----------------------------------------------------------------------------
create table if not exists guests (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null,
  phone text,
  group_label text,                 -- e.g. "Keluarga", "Kantor", "Kampus"
  invited_session text not null default 'both' check (invited_session in ('akad', 'resepsi', 'both')),
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_guests_invitation on guests(invitation_id);

-- ----------------------------------------------------------------------------
-- RSVPS
-- ----------------------------------------------------------------------------
create table if not exists rsvps (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  guest_name text not null,
  attendance text not null check (attendance in ('hadir', 'tidak_hadir', 'ragu')),
  guest_count int not null default 1,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvps_invitation on rsvps(invitation_id);

-- ----------------------------------------------------------------------------
-- GUESTBOOK (public wishes wall — "Ucapan & Doa")
-- ----------------------------------------------------------------------------
create table if not exists guestbook (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_guestbook_invitation on guestbook(invitation_id);

-- ----------------------------------------------------------------------------
-- ORDERS (package purchase / payment tracking, reviewed by admin)
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid references invitations(id) on delete set null,
  user_id uuid references profiles(id) on delete set null,
  package text not null check (package in ('basic', 'premium', 'exclusive')),
  amount numeric(12,2) not null,
  payment_proof_url text,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table profiles enable row level security;
alter table invitations enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table guestbook enable row level security;
alter table orders enable row level security;

-- profiles: a user can read/update their own profile; admins read/update all
create policy "profiles_self_select" on profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);
create policy "profiles_admin_select" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "profiles_admin_update" on profiles for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Auto-create a profile (default role 'reseller') whenever a new auth user is made.
-- There is no public sign-up form — the admin creates reseller accounts via
-- Supabase Dashboard -> Authentication -> Add user, and this trigger sets them up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'reseller')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- invitations: public can view PUBLISHED invitations (for guests opening the link);
-- owners and admins can view/manage all of their own
create policy "invitations_public_published" on invitations for select using (status = 'published');
create policy "invitations_owner_all" on invitations for all using (auth.uid() = user_id);
create policy "invitations_admin_all" on invitations for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- guests: only the invitation owner/admin manage the guest list
create policy "guests_owner_all" on guests for all using (
  exists (select 1 from invitations i where i.id = invitation_id and i.user_id = auth.uid())
);
create policy "guests_admin_all" on guests for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- rsvps: anyone can submit an RSVP (public form); only owner/admin can read the list
create policy "rsvps_public_insert" on rsvps for insert with check (true);
create policy "rsvps_owner_select" on rsvps for select using (
  exists (select 1 from invitations i where i.id = invitation_id and i.user_id = auth.uid())
);
create policy "rsvps_admin_select" on rsvps for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- guestbook: anyone can write and read wishes (it's a public wall)
create policy "guestbook_public_insert" on guestbook for insert with check (true);
create policy "guestbook_public_select" on guestbook for select using (true);

-- orders: only the buyer and admins can see an order
create policy "orders_owner_select" on orders for select using (auth.uid() = user_id);
create policy "orders_owner_insert" on orders for insert with check (auth.uid() = user_id);
create policy "orders_admin_all" on orders for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ============================================================================
-- STORAGE BUCKETS (run once; safe to ignore error if buckets already exist)
-- ============================================================================
insert into storage.buckets (id, name, public) values ('invitation-media', 'invitation-media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false)
  on conflict (id) do nothing;
