-- Exécuter dans l’éditeur SQL du projet Supabase (Dashboard > SQL Editor)

-- Table profils (étend le auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_era text,
  travel_goals text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS : chaque utilisateur ne voit que son profil
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Création automatique d’un profil à l’inscription (optionnel)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, updated_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
