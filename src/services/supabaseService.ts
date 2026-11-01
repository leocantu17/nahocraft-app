/**
 * Capa de Servicios de Supabase - Adaptador de compatibilidad
 * Re-exporta los servicios modulares organizados por dominio:
 * - siteService (site_config, about_me, weekly_schedule, in_person_classes, studio_photos)
 * - muralService (mural_categories, portfolio_items)
 * - courseService (courses, course_enrollments)
 * - quoteService (quote_tickets)
 */

export * from './siteService';
export * from './muralService';
export * from './courseService';
export * from './quoteService';
