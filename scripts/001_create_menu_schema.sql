-- Panda Restaurant — Menu schema
-- Run this in your Supabase SQL editor (or via the SQL migration tooling).

-- Enable UUID generation (Supabase has pgcrypto available by default)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- menu_categories
-- ---------------------------------------------------------------------------
create table if not exists public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.menu_categories (id) on delete cascade,
  name         text not null,
  description  text,
  price_mvr    numeric(10, 2) not null default 0,
  image_url    text,
  badges       text[] not null default '{}',
  is_popular   boolean not null default false,
  is_available boolean not null default true,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Helpful indexes for the public menu queries
create index if not exists menu_items_category_id_idx on public.menu_items (category_id);
create index if not exists menu_categories_active_sort_idx on public.menu_categories (is_active, sort_order);
create index if not exists menu_items_active_sort_idx on public.menu_items (is_active, is_available, sort_order);

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh on menu_items
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public site only needs read access to active rows. Writes happen via the
-- Supabase dashboard or an authenticated admin (service role bypasses RLS).
-- ---------------------------------------------------------------------------
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Public can read active categories"
  on public.menu_categories
  for select
  using (is_active = true);

drop policy if exists "Public can read available items" on public.menu_items;
create policy "Public can read available items"
  on public.menu_items
  for select
  using (is_active = true and is_available = true);
