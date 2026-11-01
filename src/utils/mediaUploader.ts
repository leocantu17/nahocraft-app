import { uploadImageToSupabase, type SupabaseStorageFolder } from '../lib/conexion';
import { compressImageFile } from './imageCompressor';

function dataUrlToFile(dataUrl: string, originalName: string): File | null {
  try {
    const [header, base64Data] = dataUrl.split(',');
    if (!header || !base64Data) return null;
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const baseName = originalName.replace(/\.[^/.]+$/, '') || 'imagen';
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    return new File([bytes], `${baseName}.${ext}`, { type: mime });
  } catch {
    return null;
  }
}

/**
 * Comprime en cliente y sube una imagen a la subcarpeta específica de Supabase Storage
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
  const compressedDataUrl = await compressImageFile(file, maxDimension, quality);
  const optimizedFile =
    file.size > 250 * 1024
      ? dataUrlToFile(compressedDataUrl, file.name) || file
      : file;

  try {
    const publicUrl = await uploadImageToSupabase(optimizedFile, folder);
    if (publicUrl && !publicUrl.startsWith('data:')) {
      return publicUrl;
    }
  } catch (err) {
    console.warn('[NahoCraft Media]: Error al subir a Supabase Storage, aplicando fallback:', err);
  }

  return compressedDataUrl;
}
