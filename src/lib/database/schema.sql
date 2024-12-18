-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create enum types
create type user_role as enum ('user', 'admin');

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

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Set up RLS (Row Level Security) policies

-- User Profiles policies
alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

-- PDFs policies
alter table public.pdfs enable row level security;

create policy "Public PDFs are viewable by everyone"
    on public.pdfs for select
    using (is_public = true);

create policy "Users can view their own PDFs"
    on public.pdfs for select
    using (auth.uid() = uploaded_by);

create policy "Admins can view all PDFs"
    on public.pdfs for select
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can insert PDFs"
    on public.pdfs for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can update PDFs"
    on public.pdfs for update
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Code snippets policies
alter table public.code_snippets enable row level security;

create policy "Public snippets are viewable by everyone"
    on public.code_snippets for select
    using (is_public = true);

create policy "Users can view their own snippets"
    on public.code_snippets for select
    using (auth.uid() = author_id);

create policy "Admins can manage all snippets"
    on public.code_snippets for all
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Storage policies
create policy "Anyone can view public documents"
    on storage.objects for select
    using ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

create policy "Anyone can view public avatars"
    on storage.objects for select
    using ( bucket_id = 'avatars' );

create policy "Admins can upload documents"
    on storage.objects for insert
    with check (
        bucket_id = 'documents' 
        AND exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, role, full_name)
    values (new.id, 'user', new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Update timestamps trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on public.user_profiles
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.pdfs
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.code_snippets
    for each row execute procedure public.handle_updated_at();

-- Insert initial categories
insert into public.categories (name, slug, description) values
    ('JavaScript', 'javascript', 'JavaScript programming language resources'),
    ('Python', 'python', 'Python programming language resources'),
    ('React', 'react', 'React framework resources'),
    ('Node.js', 'nodejs', 'Node.js runtime resources'),
    ('Database', 'database', 'Database related resources'),
    ('DevOps', 'devops', 'DevOps and deployment resources');

-- Create admin user function
create or replace function public.create_admin_user(email text, password text)
returns void as $$
declare
    user_id uuid;
begin
    -- Create user in auth.users
    user_id := (
        select id from auth.users
        where auth.users.email = create_admin_user.email
    );
    
    if user_id is null then
        user_id := (
            select id from auth.users
            where email = create_admin_user.email
        );
        
        if user_id is null then
            insert into auth.users (email, encrypted_password, email_confirmed_at, role)
            values (
                email,
                crypt(password, gen_salt('bf')),
                now(),
                'authenticated'
            )
            returning id into user_id;
        end if;
    end if;
    
    -- Update or insert admin role
    insert into public.user_profiles (id, role, full_name)
    values (user_id, 'admin', 'Admin User')
    on conflict (id) do update
    set role = 'admin';
end;
$$ language plpgsql security definer;