/**
 * Servicio de Configuración General, Acerca de Mí, Horarios y Taller
 * Módulo desacoplado de Supabase (PostgreSQL + RLS)
 */

import { supabase, isSupabaseConfigured } from '../lib/conexion';
import type { Database } from '../types/supabase';
import type {
  AboutMeContent,
  InPersonClassProgram,
  StudioGalleryPhoto,
  DailySchedule,
  SiteGeneralConfig,
  DayOfWeek,
} from '../types';

// =============================================================================
// SITE CONFIG
// =============================================================================

export async function fetchSiteConfig(): Promise<SiteGeneralConfig | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error || !data) return null;

  return {
    heroBadge: data.hero_badge,
    heroTitleLine1: data.hero_title_line1,
    heroTitleHighlight: data.hero_title_highlight,
    heroDescription: data.hero_description,
    studioName: data.studio_name,
    studioAddress: data.studio_address,
    studioPhone: data.studio_phone,
    studioWhatsapp: data.studio_whatsapp,
    adminEmail: data.admin_email,
    instagramHandle: data.instagram_handle || undefined,
    instagramUrl: data.instagram_url || undefined,
    tiktokHandle: data.tiktok_handle || undefined,
    tiktokUrl: data.tiktok_url || undefined,
    facebookHandle: data.facebook_handle || undefined,
    facebookUrl: data.facebook_url || undefined,
    youtubeHandle: data.youtube_handle || undefined,
    youtubeUrl: data.youtube_url || undefined,
  };
}

export async function saveSiteConfig(config: Partial<SiteGeneralConfig>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const payload: Database['public']['Tables']['site_config']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (config.heroBadge !== undefined) payload.hero_badge = config.heroBadge;
  if (config.heroTitleLine1 !== undefined) payload.hero_title_line1 = config.heroTitleLine1;
  if (config.heroTitleHighlight !== undefined) payload.hero_title_highlight = config.heroTitleHighlight;
  if (config.heroDescription !== undefined) payload.hero_description = config.heroDescription;
  if (config.studioName !== undefined) payload.studio_name = config.studioName;
  if (config.studioAddress !== undefined) payload.studio_address = config.studioAddress;
  if (config.studioPhone !== undefined) payload.studio_phone = config.studioPhone;
  if (config.studioWhatsapp !== undefined) payload.studio_whatsapp = config.studioWhatsapp;
  if (config.adminEmail !== undefined) payload.admin_email = config.adminEmail;
  if (config.instagramHandle !== undefined) payload.instagram_handle = config.instagramHandle;
  if (config.instagramUrl !== undefined) payload.instagram_url = config.instagramUrl;
  if (config.tiktokHandle !== undefined) payload.tiktok_handle = config.tiktokHandle;
  if (config.tiktokUrl !== undefined) payload.tiktok_url = config.tiktokUrl;
  if (config.facebookHandle !== undefined) payload.facebook_handle = config.facebookHandle;
  if (config.facebookUrl !== undefined) payload.facebook_url = config.facebookUrl;
  if (config.youtubeHandle !== undefined) payload.youtube_handle = config.youtubeHandle;
  if (config.youtubeUrl !== undefined) payload.youtube_url = config.youtubeUrl;

  const { error } = await supabase
    .from('site_config')
    .update(payload)
    .eq('id', 'default');

  return !error;
}

// =============================================================================
// ABOUT ME
// =============================================================================

export async function fetchAboutMe(): Promise<AboutMeContent | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('about_me_content')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error || !data) return null;

  return {
    badge: data.badge,
    title: data.title,
    subtitle: data.subtitle,
    philosophyQuote: data.philosophy_quote,
    bioParagraph1: data.bio_paragraph1,
    bioParagraph2: data.bio_paragraph2,
    bioParagraph3: data.bio_paragraph3,
    portraitImage: data.portrait_image,
    secondaryImage: data.secondary_image,
    yearsExperience: data.years_experience,
    muralCountLabel: data.mural_count_label,
    studentsCountLabel: data.students_count_label,
    signatureText: data.signature_text,
    highlights: (data.highlights as AboutMeContent['highlights']) || [],
  };
}

export async function saveAboutMe(content: Partial<AboutMeContent>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const payload: Database['public']['Tables']['about_me_content']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (content.badge !== undefined) payload.badge = content.badge;
  if (content.title !== undefined) payload.title = content.title;
  if (content.subtitle !== undefined) payload.subtitle = content.subtitle;
  if (content.philosophyQuote !== undefined) payload.philosophy_quote = content.philosophyQuote;
  if (content.bioParagraph1 !== undefined) payload.bio_paragraph1 = content.bioParagraph1;
  if (content.bioParagraph2 !== undefined) payload.bio_paragraph2 = content.bioParagraph2;
  if (content.bioParagraph3 !== undefined) payload.bio_paragraph3 = content.bioParagraph3;
  if (content.portraitImage !== undefined) payload.portrait_image = content.portraitImage;
  if (content.secondaryImage !== undefined) payload.secondary_image = content.secondaryImage;
  if (content.yearsExperience !== undefined) payload.years_experience = content.yearsExperience;
  if (content.muralCountLabel !== undefined) payload.mural_count_label = content.muralCountLabel;
  if (content.studentsCountLabel !== undefined) payload.students_count_label = content.studentsCountLabel;
  if (content.signatureText !== undefined) payload.signature_text = content.signatureText;
  if (content.highlights !== undefined) payload.highlights = content.highlights;

  const { error } = await supabase
    .from('about_me_content')
    .update(payload)
    .eq('id', 'default');

  return !error;
}

// =============================================================================
// WEEKLY SCHEDULE
// =============================================================================

export async function fetchWeeklySchedule(): Promise<DailySchedule[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('weekly_schedule')
    .select('*')
    .order('day_index', { ascending: true });

  if (error || !data) return null;

  return data.map((d) => ({
    dayIndex: d.day_index as DayOfWeek,
    dayName: d.day_name,
    isOpen: d.is_open,
    openHour: d.open_hour ?? undefined,
    closeHour: d.close_hour ?? undefined,
    displayTime: d.display_time,
  }));
}

export async function updateWeeklyScheduleDb(schedule: DailySchedule[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const rows = schedule.map((d) => ({
    day_index: d.dayIndex,
    day_name: d.dayName,
    is_open: d.isOpen,
    open_hour: d.openHour ?? null,
    close_hour: d.closeHour ?? null,
    display_time: d.displayTime,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('weekly_schedule').upsert(rows);
  return !error;
}

// =============================================================================
// IN-PERSON CLASSES
// =============================================================================

export async function fetchInPersonClasses(): Promise<InPersonClassProgram[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('in_person_classes')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return null;

  return data.map((c) => ({
    id: c.id,
    audience: c.audience,
    ageRange: c.age_range,
    title: c.title,
    description: c.description,
    scheduleSummary: c.schedule_summary,
    techniques: c.techniques || [],
    priceInfo: c.price_info,
    badge: c.badge,
  }));
}

export async function updateInPersonClassesDb(classes: InPersonClassProgram[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const rows = classes.map((c, idx) => ({
    id: c.id,
    audience: c.audience,
    age_range: c.ageRange,
    title: c.title,
    description: c.description,
    schedule_summary: c.scheduleSummary,
    techniques: c.techniques,
    price_info: c.priceInfo,
    badge: c.badge,
    sort_order: idx + 1,
  }));

  const { error } = await supabase.from('in_person_classes').upsert(rows);
  return !error;
}

// =============================================================================
// STUDIO PHOTOS
// =============================================================================

export async function fetchStudioPhotos(): Promise<StudioGalleryPhoto[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('studio_photos')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return null;

  return data.map((p) => ({
    id: p.id,
    title: p.title,
    caption: p.caption,
    image: p.image,
    tag: p.tag,
  }));
}

export async function addStudioPhotoDb(photo: StudioGalleryPhoto): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('studio_photos').insert({
    id: photo.id,
    title: photo.title,
    caption: photo.caption,
    image: photo.image,
    tag: photo.tag,
  });
  return !error;
}

export async function deleteStudioPhotoDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('studio_photos').delete().eq('id', id);
  return !error;
}
