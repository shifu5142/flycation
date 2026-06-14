-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.users (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  password text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Allow public registration insert"
  on public.users
  for insert
  to anon, authenticated
  with check (true);
