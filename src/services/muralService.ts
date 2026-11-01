/**
 * Servicio de Obras de Arte y Categorías de Murales
 * Módulo desacoplado de Supabase (PostgreSQL + RLS)
 */

import { supabase, isSupabaseConfigured } from '../lib/conexion';
import type { PortfolioItem, MuralCategory, MuralGalleryImage } from '../types';

// =============================================================================
// MURAL CATEGORIES
// =============================================================================

export async function fetchMuralCategories(): Promise<MuralCategory[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('mural_categories')
    .select('id, label, description, sort_order')
    .order('sort_order', { ascending: true });

  if (error || !data) return null;

  return data.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description || undefined,
  }));
}

export async function upsertMuralCategory(category: MuralCategory): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('mural_categories').upsert({
    id: category.id,
    label: category.label,
    description: category.description || null,
  });
  return !error;
}

export async function deleteMuralCategoryFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('mural_categories').delete().eq('id', id);
  return !error;
}

// =============================================================================
// PORTFOLIO ITEMS (MURALES)
// =============================================================================

export async function fetchPortfolioItems(): Promise<PortfolioItem[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('id, title, category, category_label, image, description, tags, details, gallery_images, sort_order')
    .order('sort_order', { ascending: true });

  if (error || !data) return null;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    categoryLabel: item.category_label,
    image: item.image,
    description: item.description,
    tags: item.tags || [],
    details: (item.details as PortfolioItem['details']) || undefined,
    galleryImages: (item.gallery_images as PortfolioItem['galleryImages']) || [],
  }));
}

export async function upsertPortfolioItem(item: PortfolioItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('portfolio_items').upsert({
    id: item.id,
    title: item.title,
    category: item.category,
    category_label: item.categoryLabel,
    image: item.image,
    description: item.description,
    tags: item.tags,
    details: (item.details as Record<string, unknown>) || null,
    gallery_images: (item.galleryImages || []) as MuralGalleryImage[],
  });
  return !error;
}

export async function deletePortfolioItemFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
  return !error;
}

