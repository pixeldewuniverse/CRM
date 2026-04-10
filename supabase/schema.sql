-- Run in Supabase SQL editor
create extension if not exists "pgcrypto";

create type app_role as enum ('admin', 'staff');
create type deal_status as enum ('lead', 'prospect', 'deal', 'lost');
create type activity_type as enum ('call', 'follow_up', 'meeting');
create type message_type as enum ('wa', 'email');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role app_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id bigserial primary key,
  name text not null,
  phone text not null,
  email text,
  tag text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id bigserial primary key,
  customer_id bigint not null references public.customers(id) on delete cascade,
  title text not null,
  status deal_status not null default 'lead',
  value numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id bigserial primary key,
  customer_id bigint not null references public.customers(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  type activity_type not null,
  note text not null,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigserial primary key,
  customer_id bigint not null references public.customers(id) on delete cascade,
  content text not null,
  type message_type not null,
  sent_at timestamptz not null default now()
);

create index if not exists customers_name_idx on public.customers(name);
create index if not exists customers_tag_idx on public.customers(tag);
create index if not exists deals_status_idx on public.deals(status);
create index if not exists activities_due_date_idx on public.activities(due_date);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;
alter table public.messages enable row level security;

create policy "authenticated read/write profiles" on public.profiles for all to authenticated using (true) with check (true);
create policy "authenticated read/write customers" on public.customers for all to authenticated using (true) with check (true);
create policy "authenticated read/write deals" on public.deals for all to authenticated using (true) with check (true);
create policy "authenticated read/write activities" on public.activities for all to authenticated using (true) with check (true);
create policy "authenticated read/write messages" on public.messages for all to authenticated using (true) with check (true);
