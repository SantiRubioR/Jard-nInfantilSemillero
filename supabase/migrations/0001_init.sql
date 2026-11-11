-- ============================================================
-- Jardín Infantil Semillero · Esquema inicial
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`)
-- ============================================================

create extension if not exists pgcrypto;

-- Enums
do $$
begin
  create type public.blog_category as enum ('evento', 'circular');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.document_type as enum ('manual_convivencia', 'resolucion_estudios');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.profile_role as enum ('admin', 'editor');
exception when duplicate_object then null;
end $$;

-- Utilidad para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Perfiles administrativos (las credenciales viven en auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.profile_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- Publicaciones del blog: eventos y circulares
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category public.blog_category not null,
  excerpt text,
  content text,
  cover_image_url text,
  pdf_url text,
  published_at date not null default current_date,
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (is_published, published_at desc);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

-- Niveles académicos: solo referencia al PDF del temario
create table if not exists public.academic_levels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  pdf_url text,
  updated_at timestamptz not null default now()
);

-- Documentos institucionales: manual de convivencia y resolución
create table if not exists public.institutional_documents (
  id uuid primary key default gen_random_uuid(),
  type public.document_type not null unique,
  title text not null,
  pdf_url text,
  updated_at timestamptz not null default now()
);

-- Galería de instalaciones
create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists facilities_order_idx
  on public.facilities (is_active, sort_order);

-- Contadores de la página de inicio
create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('docentes', 'estudiantes', 'graduados', 'anios_experiencia')),
  label text not null,
  value integer not null default 0 check (value >= 0),
  updated_at timestamptz not null default now()
);

-- Triggers de updated_at
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists academic_levels_set_updated_at on public.academic_levels;
create trigger academic_levels_set_updated_at
before update on public.academic_levels
for each row execute function public.set_updated_at();

drop trigger if exists institutional_documents_set_updated_at on public.institutional_documents;
create trigger institutional_documents_set_updated_at
before update on public.institutional_documents
for each row execute function public.set_updated_at();

drop trigger if exists statistics_set_updated_at on public.statistics;
create trigger statistics_set_updated_at
before update on public.statistics
for each row execute function public.set_updated_at();

-- Perfil automático al crear un usuario en Supabase Auth.
-- El primer usuario creado queda como administrador; los siguientes, como editor.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.profile_role;
begin
  select case when count(*) = 0 then 'admin'::public.profile_role
              else 'editor'::public.profile_role end
    into assigned_role
    from public.profiles;

  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), assigned_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Función de autorización usada por las políticas RLS
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
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.academic_levels enable row level security;
alter table public.institutional_documents enable row level security;
alter table public.facilities enable row level security;
alter table public.statistics enable row level security;

-- Perfiles: cada usuario ve su propio perfil; el admin gestiona todos
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Blog: lectura pública de publicaciones publicadas
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read"
on public.blog_posts for select
to anon, authenticated
using (is_published = true);

drop policy if exists "blog_admin_write" on public.blog_posts;
create policy "blog_admin_write"
on public.blog_posts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Niveles académicos: lectura pública, escritura admin
drop policy if exists "levels_public_read" on public.academic_levels;
create policy "levels_public_read"
on public.academic_levels for select
to anon, authenticated
using (true);

drop policy if exists "levels_admin_write" on public.academic_levels;
create policy "levels_admin_write"
on public.academic_levels for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Documentos institucionales
drop policy if exists "documents_public_read" on public.institutional_documents;
create policy "documents_public_read"
on public.institutional_documents for select
to anon, authenticated
using (true);

drop policy if exists "documents_admin_write" on public.institutional_documents;
create policy "documents_admin_write"
on public.institutional_documents for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Instalaciones: solo activas para el público
drop policy if exists "facilities_public_read" on public.facilities;
create policy "facilities_public_read"
on public.facilities for select
to anon, authenticated
using (is_active = true);

drop policy if exists "facilities_admin_write" on public.facilities;
create policy "facilities_admin_write"
on public.facilities for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Estadísticas: lectura pública, escritura admin
drop policy if exists "statistics_public_read" on public.statistics;
create policy "statistics_public_read"
on public.statistics for select
to anon, authenticated
using (true);

drop policy if exists "statistics_admin_write" on public.statistics;
create policy "statistics_admin_write"
on public.statistics for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Permisos base (RLS sigue siendo la frontera de seguridad)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- ============================================================
-- Storage: buckets públicos de lectura, escritura solo admin
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true), ('documents', 'documents', true)
on conflict (id) do nothing;

drop policy if exists "public_images_read" on storage.objects;
create policy "public_images_read"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('images', 'documents'));

drop policy if exists "admin_images_insert" on storage.objects;
create policy "admin_images_insert"
on storage.objects for insert
to authenticated
with check (bucket_id in ('images', 'documents') and public.is_admin());

drop policy if exists "admin_images_update" on storage.objects;
create policy "admin_images_update"
on storage.objects for update
to authenticated
using (bucket_id in ('images', 'documents') and public.is_admin())
with check (bucket_id in ('images', 'documents') and public.is_admin());

drop policy if exists "admin_images_delete" on storage.objects;
create policy "admin_images_delete"
on storage.objects for delete
to authenticated
using (bucket_id in ('images', 'documents') and public.is_admin());
