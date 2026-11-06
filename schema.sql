-- Run this once in Supabase SQL Editor.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  product_url text not null,
  product_details text,
  delivery_address text not null,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Allow customer order submissions" on public.orders;

create policy "Allow customer order submissions"
on public.orders
for insert
to anon, authenticated
with check (
  char_length(customer_name) between 1 and 100
  and char_length(phone) between 1 and 20
  and product_url like 'http%'
  and char_length(delivery_address) between 1 and 1000
);
