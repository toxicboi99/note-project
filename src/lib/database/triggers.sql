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