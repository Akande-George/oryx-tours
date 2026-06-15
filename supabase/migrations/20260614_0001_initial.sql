create extension if not exists pgcrypto;

create table if not exists public.operators (
  "id" text primary key,
  "name" text not null,
  "rating" numeric(3,2) not null default 0,
  "yearsActive" integer not null default 0,
  "responseTime" text not null default '',
  "languages" text[] not null default '{}'::text[],
  "topBadge" text not null default '',
  "ownerProfileId" uuid unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.profiles (
  "id" uuid primary key references auth.users (id) on delete cascade,
  "name" text not null,
  "email" text not null unique,
  "role" text not null check ("role" in ('customer', 'admin', 'partner')),
  "status" text not null default 'active' check ("status" in ('active', 'pending', 'rejected')),
  "operatorId" text unique,
  "companyName" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.operators
  drop constraint if exists operators_owner_profile_id_fkey;

alter table public.operators
  add constraint operators_owner_profile_id_fkey
  foreign key ("ownerProfileId") references public.profiles ("id") on delete set null;

alter table public.profiles
  drop constraint if exists profiles_operator_id_fkey;

alter table public.profiles
  add constraint profiles_operator_id_fkey
  foreign key ("operatorId") references public.operators ("id") on delete set null;

create table if not exists public.destinations (
  "id" text primary key,
  "name" text not null,
  "country" text not null,
  "toursCount" integer not null default 0,
  "gradient" text not null default '',
  "blurb" text not null,
  "images" text[] not null default '{}'::text[],
  "priceFrom" numeric(12,2) not null default 0,
  "rating" numeric(3,2) not null default 0,
  "tags" text[] not null default '{}'::text[],
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.tours (
  "id" text primary key,
  "slug" text not null unique,
  "title" text not null,
  "location" text not null,
  "region" text not null,
  "durationDays" integer not null,
  "groupSize" text not null,
  "difficulty" text not null check ("difficulty" in ('Easy', 'Moderate', 'Challenging')),
  "priceFrom" numeric(12,2) not null default 0,
  "rating" numeric(3,2) not null default 0,
  "reviewsCount" integer not null default 0,
  "category" text not null check ("category" in ('Luxury', 'Adventure', 'Culture', 'Wellness', 'Sports', 'Medical')),
  "description" text not null,
  "videoUrl" text,
  "highlights" text[] not null default '{}'::text[],
  "includes" text[] not null default '{}'::text[],
  "gradient" text not null default '',
  "gallery" text[] not null default '{}'::text[],
  "images" text[] not null default '{}'::text[],
  "tags" text[] not null default '{}'::text[],
  "operatorId" text not null references public.operators ("id") on delete cascade,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.vehicles (
  "id" text primary key,
  "name" text not null,
  "fleetCategory" text not null check ("fleetCategory" in ('Economy', 'Premium', 'VIP')),
  "capacity" integer not null,
  "luggage" text not null,
  "priceFrom" numeric(12,2) not null default 0,
  "halfDayPrice" numeric(12,2) not null default 0,
  "fullDayPrice" numeric(12,2) not null default 0,
  "extraHourPrice" numeric(12,2) not null default 0,
  "transferPrice" numeric(12,2) not null default 0,
  "features" text[] not null default '{}'::text[],
  "gradient" text not null default '',
  "images" text[] not null default '{}'::text[],
  "operatorId" text not null references public.operators ("id") on delete cascade,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.bookings (
  "id" text primary key,
  "tourId" text not null references public.tours ("id") on delete cascade,
  "tourTitle" text not null,
  "date" text not null,
  "guests" integer not null,
  "status" text not null check ("status" in ('Upcoming', 'Completed', 'Cancelled')),
  "price" numeric(12,2) not null default 0,
  "reference" text not null,
  "gradient" text not null default '',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.reviews (
  "id" text primary key,
  "name" text not null,
  "rating" numeric(3,2) not null,
  "date" text not null,
  "content" text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text;
  next_status text;
  next_operator_id text;
  next_name text;
  next_company_name text;
begin
  next_role := coalesce(new.raw_user_meta_data ->> 'role', 'customer');
  next_status := case when next_role = 'partner' then 'pending' else 'active' end;
  next_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), '');
  next_company_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'companyName', '')), '');
  next_operator_id := nullif(trim(coalesce(new.raw_user_meta_data ->> 'operatorId', '')), '');

  if next_name is null then
    next_name := coalesce(split_part(new.email, '@', 1), 'Oryx Traveler');
  end if;

  if next_role = 'partner' and next_operator_id is null then
    next_operator_id := 'op-' || left(replace(gen_random_uuid()::text, '-', ''), 8);
  end if;

  if next_role = 'partner' then
    insert into public.profiles (
      "id",
      "name",
      "email",
      "role",
      "status",
      "operatorId",
      "companyName"
    ) values (
      new.id,
      next_name,
      new.email,
      next_role,
      next_status,
      null,
      next_company_name
    )
    on conflict ("id") do update set
      "name" = excluded."name",
      "email" = excluded."email",
      "role" = excluded."role",
      "companyName" = excluded."companyName",
      "updatedAt" = now();

    insert into public.operators (
      "id",
      "name",
      "rating",
      "yearsActive",
      "responseTime",
      "languages",
      "topBadge",
      "ownerProfileId"
    ) values (
      next_operator_id,
      coalesce(next_company_name, next_name),
      0,
      0,
      'Under 24 hours',
      '{}'::text[],
      'New Partner',
      new.id
    )
    on conflict ("id") do nothing;

    update public.profiles
      set "operatorId" = next_operator_id,
          "updatedAt" = now()
    where "id" = new.id;
    return new;
  end if;

  insert into public.profiles (
    "id",
    "name",
    "email",
    "role",
    "status",
    "operatorId",
    "companyName"
  ) values (
    new.id,
    next_name,
    new.email,
    next_role,
    next_status,
    next_operator_id,
    next_company_name
  )
  on conflict ("id") do update set
    "name" = excluded."name",
    "email" = excluded."email",
    "role" = excluded."role",
    "operatorId" = excluded."operatorId",
    "companyName" = excluded."companyName",
    "updatedAt" = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.handle_auth_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
    set "email" = new.email,
        "updatedAt" = now()
  where "id" = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute function public.handle_auth_user_update();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where "id" = auth.uid()
      and "role" = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.operators enable row level security;
alter table public.destinations enable row level security;
alter table public.tours enable row level security;
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  using (auth.uid() = "id" or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles
  for update
  using (auth.uid() = "id" or public.is_admin())
  with check (auth.uid() = "id" or public.is_admin());

drop policy if exists "operators_select_public" on public.operators;
create policy "operators_select_public"
  on public.operators
  for select
  using (true);

drop policy if exists "destinations_select_public" on public.destinations;
create policy "destinations_select_public"
  on public.destinations
  for select
  using (true);

drop policy if exists "tours_select_public" on public.tours;
create policy "tours_select_public"
  on public.tours
  for select
  using (true);

drop policy if exists "vehicles_select_public" on public.vehicles;
create policy "vehicles_select_public"
  on public.vehicles
  for select
  using (true);

drop policy if exists "bookings_select_public" on public.bookings;
create policy "bookings_select_public"
  on public.bookings
  for select
  using (true);

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews
  for select
  using (true);
