-- Create tables for the application

-- PDFs table
create table pdfs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  url text not null,
  size bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Code snippets table
create table code_snippets (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  language text not null,
  code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create storage bucket for PDFs
insert into storage.buckets (id, name) values ('documents', 'documents');

-- Set up storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'documents' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'documents' AND auth.role() = 'authenticated' );

-- Create trigger for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_pdfs_updated_at
    before update on pdfs
    for each row
    execute procedure update_updated_at_column();

create trigger update_code_snippets_updated_at
    before update on code_snippets
    for each row
    execute procedure update_updated_at_column();