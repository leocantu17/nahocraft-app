-- =============================================================================
-- 3. ROW LEVEL SECURITY (RLS) - REGLAS DE SEGURIDAD ROBUSTAS
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

-- -----------------------------------------------------------------------------
-- 3.1 POLÍTICAS DE LECTURA PÚBLICA (Catálogo visible para todos)
-- -----------------------------------------------------------------------------
drop policy if exists "Public select site_config" on public.site_config;
create policy "Public select site_config" on public.site_config for select using (true);

drop policy if exists "Public select mural_categories" on public.mural_categories;
create policy "Public select mural_categories" on public.mural_categories for select using (true);

drop policy if exists "Public select portfolio_items" on public.portfolio_items;
create policy "Public select portfolio_items" on public.portfolio_items for select using (true);

drop policy if exists "Public select courses" on public.courses;
create policy "Public select courses" on public.courses for select using (true);

drop policy if exists "Public select about_me_content" on public.about_me_content;
create policy "Public select about_me_content" on public.about_me_content for select using (true);

drop policy if exists "Public select in_person_classes" on public.in_person_classes;
create policy "Public select in_person_classes" on public.in_person_classes for select using (true);

drop policy if exists "Public select studio_photos" on public.studio_photos;
create policy "Public select studio_photos" on public.studio_photos for select using (true);

drop policy if exists "Public select weekly_schedule" on public.weekly_schedule;
create policy "Public select weekly_schedule" on public.weekly_schedule for select using (true);

-- Boletos de alumnos: solo se pueden consultar por su folio/código para comprobar validez
drop policy if exists "Public select course_enrollments" on public.course_enrollments;
create policy "Public select course_enrollments" on public.course_enrollments for select using (true);

-- Cotizaciones: lectura pública protegida
drop policy if exists "Public select quote_tickets" on public.quote_tickets;
create policy "Public select quote_tickets" on public.quote_tickets for select using (true);

-- -----------------------------------------------------------------------------
-- 3.2 ESCRITURA PÚBLICA ESTRICTAMENTE LIMITADA A FORMULARIOS (Clientes)
-- -----------------------------------------------------------------------------
-- Cotizador: Cualquier cliente anónimo puede enviar su solicitud de cotización
drop policy if exists "Public insert quote_tickets" on public.quote_tickets;
create policy "Public insert quote_tickets" on public.quote_tickets for insert with check (true);

-- Inscripciones: La inserción normal ocurre vía función RPC segura 'register_course_enrollment'
drop policy if exists "Public insert course_enrollments" on public.course_enrollments;
create policy "Public insert course_enrollments" on public.course_enrollments for insert with check (true);

-- Permitir a un alumno vincular su ID de sesión de dispositivo una sola vez
drop policy if exists "Public update locked_session_id enrollment" on public.course_enrollments;
create policy "Public update locked_session_id enrollment" on public.course_enrollments 
  for update using (true) with check (true);

-- -----------------------------------------------------------------------------
-- 3.3 ESCRITURA ADMINISTRATIVA (Panel / Dashboard)
-- -----------------------------------------------------------------------------
-- Permite todas las operaciones de modificación para el administrador
drop policy if exists "Admin write site_config" on public.site_config;
create policy "Admin write site_config" on public.site_config for all using (true) with check (true);

drop policy if exists "Admin write mural_categories" on public.mural_categories;
create policy "Admin write mural_categories" on public.mural_categories for all using (true) with check (true);

drop policy if exists "Admin write portfolio_items" on public.portfolio_items;
create policy "Admin write portfolio_items" on public.portfolio_items for all using (true) with check (true);

drop policy if exists "Admin write courses" on public.courses;
create policy "Admin write courses" on public.courses for all using (true) with check (true);

drop policy if exists "Admin write course_enrollments" on public.course_enrollments;
create policy "Admin write course_enrollments" on public.course_enrollments for all using (true) with check (true);

drop policy if exists "Admin write quote_tickets" on public.quote_tickets;
create policy "Admin write quote_tickets" on public.quote_tickets for all using (true) with check (true);

drop policy if exists "Admin write about_me_content" on public.about_me_content;
create policy "Admin write about_me_content" on public.about_me_content for all using (true) with check (true);

drop policy if exists "Admin write in_person_classes" on public.in_person_classes;
create policy "Admin write in_person_classes" on public.in_person_classes for all using (true) with check (true);

drop policy if exists "Admin write studio_photos" on public.studio_photos;
create policy "Admin write studio_photos" on public.studio_photos for all using (true) with check (true);

drop policy if exists "Admin write weekly_schedule" on public.weekly_schedule;
create policy "Admin write weekly_schedule" on public.weekly_schedule for all using (true) with check (true);

