
select storage.create_bucket('documents', public => true, file_size_limit => 26214400);

create policy if not exists "public read" on storage.objects for select using (bucket_id = 'documents');
create policy if not exists "owner can upload" on storage.objects for insert with check (
  bucket_id = 'documents' and auth.role() = 'authenticated' and (storage.foldername(name))[1] = 'documents'
);
create policy if not exists "owner can delete" on storage.objects for delete using (
  bucket_id = 'documents' and auth.role() = 'authenticated' and (storage.foldername(name))[2] = auth.uid()::text
);
