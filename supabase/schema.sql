-- UrbanHub Supabase schema
-- Run this in Supabase SQL Editor.

begin;

-- Enable UUID generation
create extension if not exists pgcrypto;

-- PRODUCTS
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  img text not null,
  desc text,
  created_at timestamptz not null default now()
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  userId text,
  customer text,
  product text,
  amount text,
  status text,
  type text,
  productId text,
  bookingDate text,
  bookingTime text,
  created_at timestamptz not null default now()
);

-- ACTIVITY
create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  title text,
  "desc" text,
  time text,
  color text,
  created_at timestamptz not null default now()
);

-- USERS (optional; auth removed, but admin dashboard reads it for counts)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  uid text,
  name text,
  email text,
  role text,
  created_at timestamptz not null default now()
);

-- SETTINGS
create table if not exists public.settings (
  id text primary key,
  supportEmail text,
  phone text,
  address text,
  maintenanceMode boolean not null default false,
  updatedAt timestamptz
);

insert into public.settings (id)
values ('platform')
on conflict (id) do nothing;

-- Permissions for using the publishable/anon key in a demo environment.
-- (For production, tighten this and use RLS + proper auth.)
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.orders to anon, authenticated;
grant select, insert, update, delete on table public.activity to anon, authenticated;
grant select, insert, update, delete on table public.users to anon, authenticated;
grant select, insert, update, delete on table public.settings to anon, authenticated;


-- RLS
-- For this demo (using the publishable/anon key), keep RLS disabled so requests work immediately.
alter table public.products disable row level security;
alter table public.orders disable row level security;
alter table public.activity disable row level security;
alter table public.users disable row level security;
alter table public.settings disable row level security;

-- If you want RLS instead (recommended for production), enable it and add policies.
-- Supabase SQL editor may not support CREATE POLICY IF NOT EXISTS, so DROP + CREATE is safest.
-- Example:
-- alter table public.products enable row level security;
-- drop policy if exists "public read products" on public.products;
-- create policy "public read products" on public.products for select using (true);

commit;
n