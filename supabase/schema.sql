-- Schéma Famille — partage. À exécuter dans le SQL editor de Supabase.

create extension if not exists pgcrypto;

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  type text not null check (type in ('film', 'serie', 'livre', 'jeu', 'video')),
  title text not null,
  body text not null,
  external_id text,
  cover_url text,
  year int,
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on posts (created_at desc);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on comments (post_id, created_at);

-- L'app accède à la base avec la service role key (server-only). On garde
-- RLS activé par défaut Supabase mais on n'expose pas la clé anon : aucune
-- policy n'est nécessaire ici.
alter table posts enable row level security;
alter table comments enable row level security;

-- Bucket public pour les photos jointes. URLs imprévisibles (uuids), site
-- gardé par mot de passe familial → suffisant pour un usage privé.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;
