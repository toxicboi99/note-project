-- Users table (extends Supabase auth.users)
create table public.user_profiles (
    id uuid references auth.users on delete cascade,
    role user_role default 'user',
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- PDFs table
create table public.pdfs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    file_path text not null,
    file_size bigint,
    mime_type text,
    uploaded_by uuid references auth.users not null,
    downloads integer default 0,
    is_public boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Code snippets table
create table public.code_snippets (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    language text not null,
    code text not null,
    author_id uuid references auth.users not null,
    tags text[],
    likes integer default 0,
    is_public boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PDF categories junction table
create table public.pdf_categories (
    pdf_id uuid references public.pdfs on delete cascade,
    category_id uuid references public.categories on delete cascade,
    primary key (pdf_id, category_id)
);

-- Snippet categories junction table
create table public.snippet_categories (
    snippet_id uuid references public.code_snippets on delete cascade,
    category_id uuid references public.categories on delete cascade,
    primary key (snippet_id, category_id)
);