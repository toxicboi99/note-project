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