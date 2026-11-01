-- =============================================================================
-- CREACIÓN Y ESTRUCTURACIÓN DE SUBCARPETAS EN SUPABASE STORAGE
-- Bucket: nahocraft-media
-- Subcarpetas: murales, cursos, estudio, cotizaciones, sobre-mi, comprobantes
-- =============================================================================

-- 1. Asegurar que el bucket nahocraft-media exista y sea público
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'nahocraft-media',
  'nahocraft-media',
  true,
  10485760, -- 10MB de límite por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = true;

-- 2. Asegurar políticas RLS para lectura y escritura en el bucket
drop policy if exists "Public read nahocraft-media" on storage.objects;
create policy "Public read nahocraft-media"
  on storage.objects for select
  using (bucket_id = 'nahocraft-media');

drop policy if exists "Public upload nahocraft-media" on storage.objects;
create policy "Public upload nahocraft-media"
  on storage.objects for insert
  with check (bucket_id = 'nahocraft-media');

drop policy if exists "Public update nahocraft-media" on storage.objects;
create policy "Public update nahocraft-media"
  on storage.objects for update
  using (bucket_id = 'nahocraft-media');

drop policy if exists "Public delete nahocraft-media" on storage.objects;
create policy "Public delete nahocraft-media"
  on storage.objects for delete
  using (bucket_id = 'nahocraft-media');

-- 3. Crear las 6 subcarpetas iniciales insertando archivos marcadores (.keep)
-- Esto hace que aparezcan visibles de inmediato en el panel visual de Supabase Storage
insert into storage.objects (bucket_id, name, owner, metadata)
select 
  'nahocraft-media', 
  folder || '/.keep', 
  null, 
  '{"mimetype": "text/plain"}'::jsonb
from unnest(array[
  'murales',
  'cursos',
  'estudio',
  'cotizaciones',
  'sobre-mi',
  'comprobantes'
]) as folder
where not exists (
  select 1 from storage.objects 
  where bucket_id = 'nahocraft-media' and name = folder || '/.keep'
);

