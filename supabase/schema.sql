
-- Types
create type if not exists user_role as enum ('user', 'admin');
create type if not exists doc_status as enum ('pending', 'approved', 'rejected');

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamptz default now()
);

-- Categories
create table if not exists public.categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category_id bigint references public.categories(id),
  file_path text not null,
  file_type text not null,
  status doc_status not null default 'pending',
  created_at timestamptz default now(),
  tsv tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) stored
);

-- Likes
create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, document_id)
);

-- Favorites
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, document_id)
);

-- Comments
create table if not exists public.comments (
  id bigserial primary key,
  document_id uuid references public.documents(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_documents_status_created on public.documents(status, created_at desc);
create index if not exists idx_documents_category on public.documents(category_id);
create index if not exists idx_documents_tsv on public.documents using gin(tsv);
create index if not exists idx_comments_doc on public.comments(document_id, created_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.favorites enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists ( select 1 from public.profiles p where p.id = uid and p.role = 'admin' );
$$;

-- Profiles policies
create policy if not exists "read own profile or admin read all" on public.profiles for select using ( auth.uid() = id or public.is_admin(auth.uid()) );
create policy if not exists "update own profile" on public.profiles for update using (auth.uid() = id);

-- Documents policies
create policy if not exists "insert own documents" on public.documents for insert with check (auth.uid() = user_id);
create policy if not exists "read approved or own" on public.documents for select using ( status = 'approved' or user_id = auth.uid() or public.is_admin(auth.uid()) );
create policy if not exists "update own when pending or admin any" on public.documents for update using ( (user_id = auth.uid() and status = 'pending') or public.is_admin(auth.uid()) );
create policy if not exists "delete own when pending or admin any" on public.documents for delete using ( (user_id = auth.uid() and status = 'pending') or public.is_admin(auth.uid()) );

-- Comments policies
create policy if not exists "read comments" on public.comments for select using (true);
create policy if not exists "add comment when authed" on public.comments for insert with check (auth.uid() = user_id);
create policy if not exists "delete own comment or admin" on public.comments for delete using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Likes policies
create policy if not exists "read likes" on public.likes for select using (true);
create policy if not exists "insert like own" on public.likes for insert with check (auth.uid() = user_id);
create policy if not exists "remove own like" on public.likes for delete using (auth.uid() = user_id);

-- Favorites policies
create policy if not exists "read favorites" on public.favorites for select using (true);
create policy if not exists "insert favorite own" on public.favorites for insert with check (auth.uid() = user_id);
create policy if not exists "remove own favorite" on public.favorites for delete using (auth.uid() = user_id);
