import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl =
  (import.meta.env?.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const supabaseAnonKey =
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('tu-proyecto.supabase.co')
);

/**
 * Cliente centralizado de Supabase para NahoCraft (Cero Prisma ORM).
 * Utiliza conexión directa segura con @supabase/supabase-js,
 * parametrización nativa contra inyecciones SQL y validación de tipos.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-nahocraft.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const NAHOCRAFT_STORAGE_BUCKET =
  (import.meta.env?.VITE_SUPABASE_STORAGE_BUCKET as string | undefined)?.trim() ||
  'nahocraft-media';

/**
 * Subcarpetas estructuradas dentro del bucket `nahocraft-media`.
 * Cada tipo de activo multimedia tiene su propio directorio aislado.
 */
export const STORAGE_SUBFOLDERS = {
  murales: 'murales',
  cursos: 'cursos',
  estudio: 'estudio',
  cotizaciones: 'cotizaciones',
  sobreMi: 'sobre-mi',
  comprobantes: 'comprobantes',
} as const;

export type SupabaseStorageFolder =
  | 'murales'
  | 'cursos'
  | 'estudio'
  | 'cotizaciones'
  | 'sobre-mi'
  | 'comprobantes';

/**
 * Convierte un File a Data URL base64 como fallback local seguro
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo convertir el archivo a Data URL.'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo local.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sube una imagen al bucket público de Supabase Storage en su subcarpeta correspondiente
 * y devuelve la URL pública optimizada para guardarse en PostgreSQL.
 *
 * Subcarpetas admitidas:
 * - `murales`: Portafolio, fotos de proceso y carrusel antes/después
 * - `cursos`: Portadas y flyers de talleres en vivo
 * - `estudio`: Fotografías del taller físico en Minerva, Tampico
 * - `cotizaciones`: Diseños e imágenes de referencia enviadas por clientes
 * - `sobre-mi`: Fotos de biografía y retrato de Nahomy
 * - `comprobantes`: Comprobantes de transferencia de alumnos
 */
export async function uploadImageToSupabase(
  file: File,
  folder: SupabaseStorageFolder = 'murales'
): Promise<string> {
  if (!isSupabaseConfigured) {
    return fileToDataUrl(file);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .slice(0, 48);
  const uniquePath = `${folder}/${Date.now()}-${safeBaseName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(NAHOCRAFT_STORAGE_BUCKET)
    .upload(uniquePath, file, {
      cacheControl: '3600', // 1 hora de caché en CDN
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    console.warn(
      `[NahoCraft Supabase Storage]: Error al subir en subcarpeta '${folder}':`,
      uploadError.message
    );
    return fileToDataUrl(file);
  }

  const { data } = supabase.storage
    .from(NAHOCRAFT_STORAGE_BUCKET)
    .getPublicUrl(uniquePath);

  return data.publicUrl;
}

/**
 * Elimina una imagen del bucket de Supabase Storage cuando se borra o reemplaza
 * un mural, curso o fotografía para evitar acumular archivos huérfanos.
 */
export async function deleteImageFromSupabase(imageUrlOrPath: string): Promise<boolean> {
  if (!isSupabaseConfigured || !imageUrlOrPath) return false;

  try {
    // Si es una URL completa de Supabase, extraer el path relativo dentro del bucket
    let storagePath = imageUrlOrPath;
    const bucketMarker = `/${NAHOCRAFT_STORAGE_BUCKET}/`;
    if (imageUrlOrPath.includes(bucketMarker)) {
      storagePath = imageUrlOrPath.split(bucketMarker)[1];
    }

    if (!storagePath || storagePath.startsWith('data:') || storagePath.startsWith('/')) {
      return false;
    }

    const { error } = await supabase.storage
      .from(NAHOCRAFT_STORAGE_BUCKET)
      .remove([storagePath]);

    return !error;
  } catch (err) {
    console.warn('[NahoCraft Supabase Storage]: Error al eliminar archivo:', err);
    return false;
  }
}
