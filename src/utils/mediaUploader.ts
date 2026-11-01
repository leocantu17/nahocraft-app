import { uploadImageToSupabase, type SupabaseStorageFolder } from '../lib/conexion';
import { compressImageFile } from './imageCompressor';

/**
 * Comprime y sube una imagen a la subcarpeta específica de Supabase Storage
 * ('murales' | 'cursos' | 'estudio' | 'cotizaciones' | 'sobre-mi' | 'comprobantes')
 * con encabezados estrictos de caché de 1 hora (3600s).
 * Si Supabase no está configurado o falla, devuelve la versión comprimida en dataURL.
 */
export async function uploadMediaWithCompression(
  file: File,
  folder: SupabaseStorageFolder,
  maxDimension: number = 1600,
  quality: number = 0.82
): Promise<string> {
  try {
    const publicUrl = await uploadImageToSupabase(file, folder);
    if (publicUrl && !publicUrl.startsWith('data:')) {
      return publicUrl;
    }
  } catch (err) {
    console.warn('[NahoCraft Media]: Error al subir a Supabase Storage, aplicando fallback:', err);
  }

  return compressImageFile(file, maxDimension, quality);
}

