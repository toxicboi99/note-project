-- Fixed admin user creation function
create or replace function public.create_admin_user(admin_email text, admin_password text)
returns void as $$
declare
    new_user_id uuid;
begin
    -- Create user in auth.users if doesn't exist
    insert into auth.users (email, encrypted_password, email_confirmed_at, role)
    values (
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        'authenticated'
    )
    on conflict (email) do update
    set email_confirmed_at = now()
    returning id into new_user_id;
    
    -- Create or update admin profile
    insert into public.user_profiles (id, role, full_name)
    values (new_user_id, 'admin', 'Admin User')
    on conflict (id) do update
    set role = 'admin';
end;
$$ language plpgsql security definer;