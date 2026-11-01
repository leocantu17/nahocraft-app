-- =============================================================================
-- NAHOCRAFT CENTRO DE ARTE — ESQUEMA OFICIAL SUPABASE (PostgreSQL + RLS + RPC)
-- Arquitectura: Conexión directa con @supabase/supabase-js (Cero Prisma ORM)
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. TABLAS PRINCIPALES (10 ENTIDADES DINÁMICAS DE NAHOCRAFT)
-- =============================================================================

-- 1.1 Configuración general del sitio (fila única id = 'default')
create table if not exists public.site_config (
  id text primary key default 'default',
  hero_badge text not null,
  hero_title_line1 text not null,
  hero_title_highlight text not null,
  hero_description text not null,
  studio_name text not null,
  studio_address text not null,
  studio_phone text not null,
  studio_whatsapp text not null,
  admin_email text not null,
  instagram_handle text,
  instagram_url text,
  tiktok_handle text,
  tiktok_url text,
  facebook_handle text,
  facebook_url text,
  youtube_handle text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

-- 1.2 Categorías de Murales
create table if not exists public.mural_categories (
  id text primary key,
  label text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 1.3 Portafolio de Murales / Obras
create table if not exists public.portfolio_items (
  id text primary key,
  title text not null,
  category text not null,
  category_label text not null,
  image text not null,
  description text not null,
  tags text[] not null default '{}',
  details jsonb default '{}'::jsonb,
  gallery_images jsonb default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 1.4 Cursos y Talleres Mensuales
create table if not exists public.courses (
  id text primary key,
  title text not null,
  subtitle text not null,
  description text not null,
  event_date text not null,
  event_date_display text not null,
  event_time_display text not null,
  registration_deadline text not null,
  max_spots integer not null default 15 check (max_spots > 0),
  enrolled_count integer not null default 0 check (enrolled_count >= 0),
  price numeric(10, 2) not null default 0,
  modality text not null default 'online' check (modality in ('online', 'presencial', 'hibrido')),
  platform_name text not null,
  meeting_link text not null,
  image text not null,
  month_label text not null,
  level text not null,
  includes text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 1.5 Inscripciones a Cursos (Boletos / Accesos)
create table if not exists public.course_enrollments (
  id text primary key,
  folio text not null unique,
  access_code text not null unique,
  locked_session_id text,
  course_id text not null references public.courses(id) on delete cascade,
  course_title text not null,
  course_date_display text not null,
  course_time_display text not null,
  meeting_link text not null,
  platform_name text not null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  tickets_count integer not null default 1 check (tickets_count = 1),
  total_paid numeric(10, 2) not null default 0,
  payment_method text not null check (payment_method in ('tarjeta', 'transferencia', 'oxxo_spei')),
  purchased_at text not null,
  email_sent_to_buyer boolean not null default true,
  email_sent_to_naho boolean not null default true,
  created_at timestamptz not null default now()
);

-- 1.6 Tickets de Cotización de Murales
create table if not exists public.quote_tickets (
  folio text primary key,
  created_at_display text not null,
  status text not null default 'nuevo' check (status in ('nuevo', 'en_revision', 'propuesta_enviada', 'aprobado')),
  form_data jsonb not null,
  reference_art_title text,
  quoted_amount numeric(12, 2),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- 1.7 Contenido "Sobre Mí" (fila única id = 'default')
create table if not exists public.about_me_content (
  id text primary key default 'default',
  badge text not null,
  title text not null,
  subtitle text not null,
  philosophy_quote text not null,
  bio_paragraph1 text not null,
  bio_paragraph2 text not null,
  bio_paragraph3 text not null,
  portrait_image text not null,
  secondary_image text not null,
  years_experience text not null,
  mural_count_label text not null,
  students_count_label text not null,
  signature_text text not null,
  highlights jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 1.8 Programas de Clases Presenciales en el Taller
create table if not exists public.in_person_classes (
  id text primary key,
  audience text not null,
  age_range text not null,
  title text not null,
  description text not null,
  schedule_summary text not null,
  techniques text[] not null default '{}',
  price_info text not null,
  badge text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 1.9 Galería Fotográfica del Taller Físico
create table if not exists public.studio_photos (
  id text primary key,
  title text not null,
  caption text not null,
  image text not null,
  tag text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 1.10 Horario Semanal del Taller (0 = Domingo ... 6 = Sábado)
create table if not exists public.weekly_schedule (
  day_index smallint primary key check (day_index between 0 and 6),
  day_name text not null,
  is_open boolean not null default false,
  open_hour smallint,
  close_hour smallint,
  display_time text not null,
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 2. FUNCIONES RPC TRANSACCIONALES
-- =============================================================================

-- 2.1 Inscribir alumno de manera atómica e incrementar enrolled_count
create or replace function public.register_course_enrollment(
  p_id text,
  p_folio text,
  p_access_code text,
  p_course_id text,
  p_course_title text,
  p_course_date_display text,
  p_course_time_display text,
  p_meeting_link text,
  p_platform_name text,
  p_buyer_name text,
  p_buyer_email text,
  p_buyer_phone text,
  p_total_paid numeric,
  p_payment_method text,
  p_purchased_at text,
  p_email_sent_to_buyer boolean default true,
  p_email_sent_to_naho boolean default true
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_max_spots integer;
  v_enrolled integer;
begin
  select max_spots, enrolled_count
    into v_max_spots, v_enrolled
    from public.courses
   where id = p_course_id
   for update;

  if not found then
    raise exception 'El curso especificado no existe.';
  end if;

  if v_enrolled >= v_max_spots then
    raise exception 'El curso ya ha alcanzado el cupo máximo disponible.';
  end if;

  insert into public.course_enrollments (
    id,
    folio,
    access_code,
    course_id,
    course_title,
    course_date_display,
    course_time_display,
    meeting_link,
    platform_name,
    buyer_name,
    buyer_email,
    buyer_phone,
    tickets_count,
    total_paid,
    payment_method,
    purchased_at,
    email_sent_to_buyer,
    email_sent_to_naho
  ) values (
    p_id,
    p_folio,
    p_access_code,
    p_course_id,
    p_course_title,
    p_course_date_display,
    p_course_time_display,
    p_meeting_link,
    p_platform_name,
    p_buyer_name,
    p_buyer_email,
    p_buyer_phone,
    1,
    p_total_paid,
    p_payment_method,
    p_purchased_at,
    p_email_sent_to_buyer,
    p_email_sent_to_naho
  );

  update public.courses
     set enrolled_count = least(max_spots, enrolled_count + 1)
   where id = p_course_id;

  return true;
end;
$$;

-- 2.2 Eliminar inscripción y liberar el cupo de forma atómica
create or replace function public.delete_course_enrollment(
  p_enrollment_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_course_id text;
begin
  delete from public.course_enrollments
   where id = p_enrollment_id
  returning course_id into v_course_id;

  if found and v_course_id is not null then
    update public.courses
       set enrolled_count = greatest(0, enrolled_count - 1)
     where id = v_course_id;
    return true;
  end if;

  return false;
end;
$$;

-- =============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table public.site_config enable row level security;
alter table public.mural_categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.quote_tickets enable row level security;
alter table public.about_me_content enable row level security;
alter table public.in_person_classes enable row level security;
alter table public.studio_photos enable row level security;
alter table public.weekly_schedule enable row level security;

-- Políticas de lectura pública
drop policy if exists "Public select site_config" on public.site_config;
create policy "Public select site_config" on public.site_config for select using (true);

drop policy if exists "Public select mural_categories" on public.mural_categories;
create policy "Public select mural_categories" on public.mural_categories for select using (true);

drop policy if exists "Public select portfolio_items" on public.portfolio_items;
create policy "Public select portfolio_items" on public.portfolio_items for select using (true);

drop policy if exists "Public select courses" on public.courses;
create policy "Public select courses" on public.courses for select using (true);

drop policy if exists "Public select course_enrollments" on public.course_enrollments;
create policy "Public select course_enrollments" on public.course_enrollments for select using (true);

drop policy if exists "Public select quote_tickets" on public.quote_tickets;
create policy "Public select quote_tickets" on public.quote_tickets for select using (true);

drop policy if exists "Public select about_me_content" on public.about_me_content;
create policy "Public select about_me_content" on public.about_me_content for select using (true);

drop policy if exists "Public select in_person_classes" on public.in_person_classes;
create policy "Public select in_person_classes" on public.in_person_classes for select using (true);

drop policy if exists "Public select studio_photos" on public.studio_photos;
create policy "Public select studio_photos" on public.studio_photos for select using (true);

drop policy if exists "Public select weekly_schedule" on public.weekly_schedule;
create policy "Public select weekly_schedule" on public.weekly_schedule for select using (true);

-- Políticas de escritura (compatibles tanto con login local como con Supabase Auth)
drop policy if exists "Public write site_config" on public.site_config;
create policy "Public write site_config" on public.site_config for all using (true) with check (true);

drop policy if exists "Public write mural_categories" on public.mural_categories;
create policy "Public write mural_categories" on public.mural_categories for all using (true) with check (true);

drop policy if exists "Public write portfolio_items" on public.portfolio_items;
create policy "Public write portfolio_items" on public.portfolio_items for all using (true) with check (true);

drop policy if exists "Public write courses" on public.courses;
create policy "Public write courses" on public.courses for all using (true) with check (true);

drop policy if exists "Public write course_enrollments" on public.course_enrollments;
create policy "Public write course_enrollments" on public.course_enrollments for all using (true) with check (true);

drop policy if exists "Public write quote_tickets" on public.quote_tickets;
create policy "Public write quote_tickets" on public.quote_tickets for all using (true) with check (true);

drop policy if exists "Public write about_me_content" on public.about_me_content;
create policy "Public write about_me_content" on public.about_me_content for all using (true) with check (true);

drop policy if exists "Public write in_person_classes" on public.in_person_classes;
create policy "Public write in_person_classes" on public.in_person_classes for all using (true) with check (true);

drop policy if exists "Public write studio_photos" on public.studio_photos;
create policy "Public write studio_photos" on public.studio_photos for all using (true) with check (true);

drop policy if exists "Public write weekly_schedule" on public.weekly_schedule;
create policy "Public write weekly_schedule" on public.weekly_schedule for all using (true) with check (true);

-- =============================================================================
-- 4. SUPABASE STORAGE BUCKET (nahocraft-media)
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('nahocraft-media', 'nahocraft-media', true)
on conflict (id) do nothing;

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

-- =============================================================================
-- 5. DATOS SEMILLA INICIALES (SEED DATA DE NAHOCRAFT)
-- =============================================================================

insert into public.site_config (
  id, hero_badge, hero_title_line1, hero_title_highlight, hero_description,
  studio_name, studio_address, studio_phone, studio_whatsapp, admin_email,
  instagram_handle, instagram_url, tiktok_handle, tiktok_url,
  facebook_handle, facebook_url, youtube_handle, youtube_url
) values (
  'default',
  'Centro de Arte & Muralismo • Tampico, Madero y Altamira',
  'Cursos de arte en vivo y',
  'murales que transforman espacios.',
  'Inscríbete a nuestros cursos mensuales con cupo limitado desde cualquier lugar, o cotiza un mural personalizado pintado a mano para tu negocio, hogar o proyecto en Tampico, Ciudad Madero y Altamira.',
  'Nahocraft Centro de Arte',
  'Avenida Ayuntamiento 3 - 109, Minerva, 89120 Tampico, Tamps., México',
  '+52 833 365 5622',
  '528333655622',
  'Centrodearte@nahocraft.com',
  '@nahocraft',
  'https://www.instagram.com/nahocraft?igshid=NzZlODBkYWE4Ng%3D%3D&utm_source=qr',
  '@nahocraft1',
  'https://www.tiktok.com/@nahocraft1',
  'Nahocraft Tampico',
  'https://www.facebook.com/nahocraft?mibextid=LQQJ4d',
  '@nahocraft',
  'https://www.youtube.com/@nahocraft'
) on conflict (id) do nothing;

insert into public.mural_categories (id, label, description, sort_order) values
  ('comercial', 'Negocios & Comercial', 'Murales con identidad de marca y puntos fotográficos para locales, restaurantes y oficinas.', 1),
  ('residencial', 'Casa & Residencial', 'Intervenciones artísticas cálidas para salas, terrazas, recámaras y espacios familiares.', 2),
  ('decoracion', 'Decoración & Botánico', 'Murales orgánicos, florales y de atmósfera interior que dan amplitud y vida.', 3),
  ('urbano', 'Urbano & Fachadas', 'Obras de gran formato en exterior con recubrimiento de alta resistencia climática.', 4)
on conflict (id) do nothing;

insert into public.portfolio_items (
  id, title, category, category_label, image, description, tags, details, gallery_images, sort_order
) values
  (
    'mural-dulceria',
    'Mural Comercial Dulcería Típica',
    'comercial',
    'Negocios & Comercial',
    '/murales/mural dulceria.png',
    'Intervención mural vibrante y llena de color para establecimiento comercial en Tampico. Diseñada para generar identidad de marca y un punto fotográfico irresistible para los clientes.',
    array['Comercial', 'Negocio', 'Ilustración', 'Tampico'],
    '{"dimensions": "4.5m x 2.8m", "technique": "Acrílico profesional sobre muro con sellador UV mate", "location": "Tampico, Tamps.", "curatedTag": "Ideal para Negocios"}'::jsonb,
    '[{"id": "dulceria-1", "url": "/murales/mural dulceria.png", "label": "Resultado Final"}, {"id": "dulceria-2", "url": "/murales/mural minerva.png", "label": "Detalle & Contraste"}]'::jsonb,
    1
  ),
  (
    'mural-hojas',
    'Mural Botánico Orgánico & Follaje',
    'decoracion',
    'Decoración & Botánico',
    '/murales/mural hojas.png',
    'Composición mural botánica envolvente inspirada en la vegetación tropical, aportando frescura, profundidad y un ambiente de serenidad para interiores de casa o estudio.',
    array['Decoración', 'Casa', 'Botánico', 'Interiores'],
    '{"dimensions": "5.0m x 3.2m", "technique": "Técnica mixta, acrílico artístico y veladuras", "location": "Ciudad Madero, Tamps.", "curatedTag": "Casa & Decoración"}'::jsonb,
    '[]'::jsonb,
    2
  ),
  (
    'mural-minerva',
    'Mural Identitario Minerva Tampico',
    'urbano',
    'Urbano & Fachadas',
    '/murales/mural minerva.png',
    'Pieza artística de carácter urbano y cultural ubicada en la zona Minerva de Tampico, conjugando contrastes tonales dinámicos y narrativa gráfica en gran formato.',
    array['Fachada', 'Urbano', 'Tampico', 'Gran Formato'],
    '{"dimensions": "3.8m x 2.4m", "technique": "Acrílico de alta resistencia climática para exterior", "location": "Zona Minerva, Tampico", "curatedTag": "Exterior & Urbano"}'::jsonb,
    '[]'::jsonb,
    3
  ),
  (
    'mural-residencial-estancia',
    'Mural Residencial Armonía Tropical',
    'residencial',
    'Casa & Residencial',
    '/murales/mural hojas.png',
    'Diseño personalizado para estancia principal en residencia familiar, integrando la paleta cromática del mobiliario con trazos botánicos hechos 100% a mano.',
    array['Casa', 'Sala', 'Personalizado', 'Altamira'],
    '{"dimensions": "3.2m x 2.5m", "technique": "Acrílico satinado lavable para interiores", "location": "Altamira, Tamps.", "curatedTag": "Residencial"}'::jsonb,
    '[]'::jsonb,
    4
  )
on conflict (id) do nothing;

insert into public.courses (
  id, title, subtitle, description, event_date, event_date_display, event_time_display,
  registration_deadline, max_spots, enrolled_count, price, modality, platform_name,
  meeting_link, image, month_label, level, includes, featured, active
) values
  (
    'curso-oct-29',
    'Masterclass: Ilustración Acrílica, Color & Composición Viva',
    'Curso Especial de Octubre • Sesión en Vivo Paso a Paso con Nahomy',
    'Aprende desde cero cómo construir una paleta vibrante, dominar degradados en acrílico y dar vida a tus propias composiciones artísticas. Al adquirir tu entrada recibirás en tu correo la confirmación oficial y tu enlace privado de acceso a Google Meet.',
    '2026-10-29',
    '29 de Octubre, 2026',
    '17:00 - 19:30 hrs',
    '2026-10-29T16:30:00',
    15,
    11,
    480,
    'online',
    'Google Meet (En Vivo)',
    'https://meet.google.com/nah-arte-oct29',
    '/murales/mural dulceria.png',
    'Octubre 2026',
    'Todos los niveles (Sin experiencia previa necesaria)',
    array[
      'Acceso en vivo a la sesión interactiva por Google Meet',
      'Guía descargable de materiales y mezcla de color en PDF',
      'Revisión en directo de tu ejercicio con retroalimentación de Nahomy',
      'Grabación disponible por 15 días y constancia digital del taller'
    ],
    true,
    true
  ),
  (
    'curso-nov-14',
    'Taller de Pintura Botánica & Texturas Orgánicas en Lienzo',
    'Edición Mensual Noviembre • Cupo Limitado',
    'Descubre las técnicas de veladuras, luces tropicales y follaje botánico que caracterizan los murales de Nahocraft, adaptadas a lienzo en formato mediano para decorar tu espacio.',
    '2026-11-14',
    '14 de Noviembre, 2026',
    '16:00 - 18:30 hrs',
    '2026-11-14T14:00:00',
    12,
    5,
    520,
    'online',
    'Google Meet (En Vivo)',
    'https://meet.google.com/nah-botanico-nov14',
    '/murales/mural hojas.png',
    'Noviembre 2026',
    'Principiantes e Intermedios',
    array[
      'Link directo a la clase en vivo enviado automáticamente a tu correo',
      'Plantilla de trazos botánicos lista para transferir o bocetar',
      'Lista económica de pinceles y acrílicos recomendados',
      'Sesión de preguntas y respuestas en vivo'
    ],
    false,
    true
  ),
  (
    'curso-nov-28',
    'Introducción al Diseño de Murales: Del Boceto al Muro Real',
    'Taller Intensivo Fin de Mes • Metodología Profesional',
    'Conoce el proceso completo detrás de un mural exitoso: cómo escalar tu dibujo al muro con cuadrícula o referencia orgánica, preparación de superficies y sellado duradero.',
    '2026-11-28',
    '28 de Noviembre, 2026',
    '11:00 - 14:00 hrs',
    '2026-11-28T09:30:00',
    10,
    8,
    650,
    'online',
    'Google Meet (En Vivo)',
    'https://meet.google.com/nah-muralismo-nov28',
    '/murales/mural minerva.png',
    'Noviembre 2026',
    'Entusiastas, Estudiantes y Creativos',
    array[
      'Acceso exclusivo por Google Meet con cupo reducido (máx. 10 personas)',
      'Guía de cotización, materiales para interior/exterior y preparación de pared',
      'Asesoría en vivo para tu primer proyecto de mural'
    ],
    false,
    true
  )
on conflict (id) do nothing;

insert into public.course_enrollments (
  id, folio, access_code, course_id, course_title, course_date_display, course_time_display,
  meeting_link, platform_name, buyer_name, buyer_email, buyer_phone, tickets_count,
  total_paid, payment_method, purchased_at, email_sent_to_buyer, email_sent_to_naho
) values
  ('enr-101', '#CURSO-OCT29-011', 'NAHO-OCT29-841', 'curso-oct-29', 'Masterclass: Ilustración Acrílica, Color & Composición Viva', '29 de Octubre, 2026', '17:00 - 19:30 hrs', 'https://meet.google.com/nah-arte-oct29', 'Google Meet (En Vivo)', 'Valeria Salazar', 'valeria.salazar@outlook.com', '833 388 1204', 1, 480, 'tarjeta', '26 Oct 2026, 10:15', true, true),
  ('enr-102', '#CURSO-OCT29-010', 'NAHO-OCT29-519', 'curso-oct-29', 'Masterclass: Ilustración Acrílica, Color & Composición Viva', '29 de Octubre, 2026', '17:00 - 19:30 hrs', 'https://meet.google.com/nah-arte-oct29', 'Google Meet (En Vivo)', 'Fernanda Treviño', 'fer.trevino@gmail.com', '833 412 7731', 1, 480, 'transferencia', '25 Oct 2026, 19:42', true, true),
  ('enr-103', '#CURSO-NOV14-004', 'NAHO-NOV14-302', 'curso-nov-14', 'Taller de Pintura Botánica & Texturas Orgánicas en Lienzo', '14 de Noviembre, 2026', '16:00 - 18:30 hrs', 'https://meet.google.com/nah-botanico-nov14', 'Google Meet (En Vivo)', 'Carlos Mendoza', 'carlos.mendoza.art@gmail.com', '833 194 6520', 1, 520, 'tarjeta', '25 Oct 2026, 14:10', true, true),
  ('enr-104', '#CURSO-NOV14-005', 'NAHO-NOV14-918', 'curso-nov-14', 'Taller de Pintura Botánica & Texturas Orgánicas en Lienzo', '14 de Noviembre, 2026', '16:00 - 18:30 hrs', 'https://meet.google.com/nah-botanico-nov14', 'Google Meet (En Vivo)', 'Ana Lucía Castillo', 'analucia.castillo@yahoo.com', '833 521 8033', 1, 520, 'transferencia', '26 Oct 2026, 09:20', true, true),
  ('enr-105', '#CURSO-NOV28-002', 'NAHO-NOV28-744', 'curso-nov-28', 'Introducción al Diseño de Murales: Del Boceto al Muro Real', '28 de Noviembre, 2026', '11:00 - 14:00 hrs', 'https://meet.google.com/nah-muralismo-nov28', 'Google Meet (En Vivo)', 'Rodrigo Villarreal', 'rodrigo.villarreal.mx@gmail.com', '833 277 4915', 1, 650, 'tarjeta', '26 Oct 2026, 12:45', true, true)
on conflict (id) do nothing;

insert into public.quote_tickets (
  folio, created_at_display, status, form_data, reference_art_title, quoted_amount, admin_notes
) values
  (
    '#MURAL-2026-104',
    '25 Oct 2026, 18:20',
    'nuevo',
    '{"projectType": "mural", "muralCategory": "Negocios & Comercial", "dimensions": "Mural comercial mediano (4m x 2.5m)", "customDimensions": "Pared principal entrando a la cafetería, muro liso recién pintado de blanco.", "surfaceOrMaterial": "Muro interior liso (Yeso / Tablaroca)", "colorPalette": "Vibrante Nahocraft (Tonos cálidos, fucsia, naranja y toques botánicos)", "themeAndDetails": "Queremos un mural instagrameable para nuestra nueva cafetería con motivos de café, flores tropicales y una frase corta.", "datePreferenceType": "especifica", "deadlineDate": "2026-11-15", "cityZone": "Tampico", "neighborhoodOrAddress": "Col. Lomas de Rosales, Tampico", "clientName": "Mariana Garza (Café Brisa)", "clientEmail": "mariana.garza@cafebrisa.mx", "clientPhone": "833 219 4810", "preferredContact": "whatsapp", "clientLocation": "Tampico • Col. Lomas de Rosales, Tampico", "clientNotes": "Nos gustaría agendar visita para que veas el muro esta semana.", "referenceImagePreview": "/murales/mural dulceria.png", "referenceImageName": "inspiracion-cafeteria.png"}'::jsonb,
    'Mural Comercial Dulcería Típica',
    null,
    null
  ),
  (
    '#MURAL-2026-101',
    '23 Oct 2026, 13:15',
    'en_revision',
    '{"projectType": "mural", "muralCategory": "Casa & Residencial", "dimensions": "Mural residencial (3m x 2.4m)", "customDimensions": "3.10m de ancho x 2.45m de alto en sala-comedor", "surfaceOrMaterial": "Pared interior lisa en casa habitación", "colorPalette": "Orgánico & Botánico (Verdes, hojas tropicales y tonos tierra suaves)", "themeAndDetails": "Buscamos un mural de hojas botánicas que le dé frescura y amplitud a nuestra estancia principal.", "datePreferenceType": "flexible", "deadlineDate": "En las próximas 3 semanas (Fecha flexible)", "cityZone": "Ciudad Madero", "neighborhoodOrAddress": "Col. Ampliación Unidad Nacional, Cd. Madero", "clientName": "Dr. Roberto Elizondo", "clientEmail": "relizondo.med@gmail.com", "clientPhone": "833 140 9921", "preferredContact": "email", "clientLocation": "Ciudad Madero • Col. Ampliación Unidad Nacional", "clientNotes": "Disponible por las tardes para llamada o correo.", "referenceImagePreview": "/murales/mural hojas.png", "referenceImageName": "referencia-hojas-sala.png"}'::jsonb,
    'Mural Botánico Orgánico & Follaje',
    7800,
    'Cliente prefiere visita técnica el jueves por la tarde. Muro ya fondeado en blanco mate.'
  )
on conflict (folio) do nothing;

insert into public.about_me_content (
  id, badge, title, subtitle, philosophy_quote, bio_paragraph1, bio_paragraph2, bio_paragraph3,
  portrait_image, secondary_image, years_experience, mural_count_label, students_count_label,
  signature_text, highlights
) values (
  'default',
  'Sobre Mí • Artista Visual & Fundadora de Nahocraft',
  'Hola, soy Nahomy',
  'Muralista y maestra de arte en Tampico, Tamaulipas',
  '“Cada obra y cada mural nacen de una emoción; mi misión es llenar de color e identidad los espacios que habitamos y despertar el talento creativo en cada alumno.”',
  'Soy artista visual y fundadora de Nahocraft Centro de Arte en Tampico. Desde mis primeros trazos descubrí que la pintura tiene el poder de transformar por completo la energía de un lugar: ya sea el muro de un nuevo negocio que busca cautivar a sus visitantes, o el rincón favorito de un hogar en la zona sur de Tamaulipas.',
  'A través del muralismo en Tampico, Ciudad Madero y Altamira, diseño y pinto obras 100% a mano adaptadas a la personalidad de cada cliente. Me apasiona escuchar tu idea, imaginar la paleta perfecta y llevarla a gran escala con materiales de máxima durabilidad.',
  'Además de pintar murales, mi otra gran vocación es compartir el arte. En nuestro taller físico en la colonia Minerva imparto clases presenciales para niños, adolescentes y adultos, y cada mes abro nuevos cursos en línea en vivo para que cualquier persona pueda aprender y disfrutar de la pintura paso a paso.',
  '/murales/mural minerva.png',
  '/logoNahocraft.jpg',
  '+6 Años',
  'Tampico, Madero y Altamira',
  'Niños, Jóvenes y Adultos',
  'Nahomy • Centro de Arte Nahocraft',
  '[{"id": "h-1", "title": "Muralismo a Medida", "description": "Intervenciones artísticas en negocios, casas y espacios comerciales en Tampico, Cd. Madero y Altamira."}, {"id": "h-2", "title": "Cursos Mensuales Online", "description": "Talleres en vivo con cupo limitado donde recibes tu enlace privado y aprendes técnicas reales desde casa."}, {"id": "h-3", "title": "Taller Físico en Tampico", "description": "Un espacio creativo seguro e inspirador con clases presenciales para niños, adolescentes y adultos."}]'::jsonb
) on conflict (id) do nothing;

insert into public.in_person_classes (
  id, audience, age_range, title, description, schedule_summary, techniques, price_info, badge, sort_order
) values
  (
    'clase-ninos',
    'Niños',
    '5 a 11 años',
    'Taller Creativo Infantil: Descubriendo el Color',
    'Clases lúdicas donde los pequeños desarrollan su motricidad, imaginación y confianza a través de pintura acrílica, acuarela, dibujo y expresión libre guiada paso a paso.',
    'Martes y Jueves • Turnos vespertinos / Sábados por la mañana',
    array['Pintura acrílica', 'Acuarela creativa', 'Dibujo e ilustración', 'Texturas y color'],
    'Inscripciones abiertas en el taller',
    'Infantil Presencial',
    1
  ),
  (
    'clase-adolescentes',
    'Adolescentes',
    '12 a 17 años',
    'Estudio Juvenil: Ilustración, Lienzo & Estilo Propio',
    'Un espacio ideal para jóvenes que quieren perfeccionar su técnica de dibujo, anatomía, proporción, mezcla de color, pintura sobre bastidor y creación de personajes.',
    'Lunes, Miércoles y Viernes • Tardes / Sábados',
    array['Acrílico en bastidor', 'Composición y sombreado', 'Ilustración moderna', 'Técnica mixta'],
    'Grupos reducidos personalizados',
    'Juvenil Presencial',
    2
  ),
  (
    'clase-adultos',
    'Adultos',
    '18 años en adelante',
    'Taller Libre para Adultos: Pintura & Arte Terapia',
    'Desconéctate de la rutina en un ambiente relajado e inspirador. No necesitas experiencia previa: te guiamos a tu propio ritmo para que pintes cuadros increíbles para tu hogar.',
    'Horarios flexibles entre semana y Sábados',
    array['Pintura en lienzo desde cero', 'Botánica y paisaje', 'Arte abstracto y figurativo', 'Proyecto libre'],
    'Sesiones semanales o mensuales',
    'Adultos Presencial',
    3
  )
on conflict (id) do nothing;

insert into public.studio_photos (id, title, caption, image, tag, sort_order) values
  (
    'studio-photo-1',
    'Área de Caballetes y Creación en el Taller',
    'Espacio iluminado y equipado en Col. Minerva para nuestras sesiones presenciales de niños, adolescentes y adultos.',
    '/murales/mural dulceria.png',
    'Nuestro Espacio',
    1
  ),
  (
    'studio-photo-2',
    'Muestras de Color, Acrílicos y Lienzos',
    'Trabajamos con materiales profesionales para que cada alumno y cada proyecto luzca vibrante.',
    '/murales/mural hojas.png',
    'Materiales & Ambiente',
    2
  ),
  (
    'studio-photo-3',
    'Rincón de Inspiración Muralista en Tampico',
    'Visítanos en Av. Ayuntamiento 3 - 109 para conocer el taller o platicar sobre tu próximo mural.',
    '/murales/mural minerva.png',
    'Zona Minerva, Tampico',
    3
  )
on conflict (id) do nothing;

insert into public.weekly_schedule (day_index, day_name, is_open, open_hour, close_hour, display_time) values
  (0, 'Domingo', false, null, null, 'Cerrado'),
  (1, 'Lunes', true, 11, 21, '11:00 - 21:00 hrs'),
  (2, 'Martes', true, 11, 19, '11:00 - 19:00 hrs'),
  (3, 'Miércoles', true, 11, 19, '11:00 - 19:00 hrs'),
  (4, 'Jueves', true, 15, 21, '15:00 - 21:00 hrs'),
  (5, 'Viernes', true, 15, 21, '15:00 - 21:00 hrs'),
  (6, 'Sábado', true, 11, 21, '11:00 - 21:00 hrs')
on conflict (day_index) do nothing;

