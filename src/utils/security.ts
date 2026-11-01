/**
 * =============================================================================
 * UTILIDADES DE SEGURIDAD, SANITIZACIÓN Y RATE LIMITING
 * Ubicación: src/utils/security.ts
 * =============================================================================
 */

/**
 * Sanitiza una cadena de texto eliminando etiquetas HTML, secuencias de control
 * y recortando espacios para mitigar inyecciones XSS y sobrecargas de caracteres.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';

  return input
    // Eliminar etiquetas HTML completas (<script>, <iframe>, <img ...>, etc.)
    .replace(/<[^>]*>?/gm, '')
    // Reemplazar caracteres especiales de inyección
    .replace(/[<>'"&;]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        '&': '&amp;',
        ';': '&#59;',
      };
      return map[char] || '';
    })
    // Normalizar espacios múltiples
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Valida si un correo electrónico cumple con el estándar RFC básico.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida un teléfono mexicano (10 dígitos numéricos).
 */
export function isValidMexicanPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
}

/**
 * Mecanismo de Cooldown / Anti-Spam para envíos de formularios.
 * Previene que bots o usuarios envíen múltiples peticiones en ráfaga.
 */
export function checkSubmissionCooldown(
  formKey: string,
  cooldownSeconds = 30
): { allowed: boolean; remainingSeconds: number } {
  try {
    const storageKey = `naho_cooldown_${formKey}`;
    const lastTimestamp = Number(sessionStorage.getItem(storageKey) || 0);
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTimestamp) / 1000);

    if (elapsedSeconds < cooldownSeconds) {
      return {
        allowed: false,
        remainingSeconds: cooldownSeconds - elapsedSeconds,
      };
    }
    return { allowed: true, remainingSeconds: 0 };
  } catch {
    return { allowed: true, remainingSeconds: 0 };
  }
}

/**
 * Registra el instante del envío para activar el cooldown anti-spam.
 */
export function recordSubmission(formKey: string): void {
  try {
    const storageKey = `naho_cooldown_${formKey}`;
    sessionStorage.setItem(storageKey, String(Date.now()));
  } catch {
    // Si el almacenamiento está restringido por el navegador, continuar
  }
}

