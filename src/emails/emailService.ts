import {
  EmailPayload,
  EmailDispatchResult,
  StudentTicketEmailData,
  StudioEnrollmentNotificationData,
  ClientQuoteConfirmationData,
  StudioQuoteNotificationData,
  FormalProposalEmailData,
} from './types';
import { renderStudentTicketEmail } from './StudentTicketEmail';
import { renderStudioEnrollmentNotification } from './StudioEnrollmentNotification';
import { renderClientQuoteConfirmation } from './ClientQuoteConfirmation';
import { renderStudioQuoteNotification } from './StudioQuoteNotification';
import { renderFormalProposalEmail } from './FormalProposalEmail';

const EMAIL_AUDIT_LOG_KEY = 'nahocraft_sent_emails_audit_log';

/**
 * Despacha un correo electrónico estructurado.
 * Si existe una ruta backend configurada (ej. VITE_EMAIL_API_ENDPOINT o /api/send-email),
 * realiza la petición POST con el payload. De lo contrario, emite el evento en consola y
 * registra en el historial local de auditoría.
 */
export async function dispatchEmailPayload(payload: EmailPayload): Promise<EmailDispatchResult> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const customEndpoint = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_API_ENDPOINT) as string | undefined;
  const endpoint = customEndpoint || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '/api/send-email' : undefined);

  // Si existe endpoint de backend conectado
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error en servidor de correo (${response.status}): ${await response.text()}`);
      }

      const resData = (await response.json().catch(() => ({}))) as { id?: string };
      return {
        success: true,
        messageId: resData.id || messageId,
        recipient: payload.to,
        dispatchedAt: new Date().toISOString(),
        mode: 'live_backend',
      };
    } catch (err: unknown) {
      console.error('[Nahocraft Email Backend Error]:', err);
      // Fallback a simulación para no romper la experiencia
      return {
        success: false,
        messageId,
        recipient: payload.to,
        dispatchedAt: new Date().toISOString(),
        mode: 'live_backend',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Modo desarrollo / Frontend autónomo:
  console.groupCollapsed(`✉️ [Nahocraft Correo Enviado]: ${payload.subject} -> ${payload.to}`);
  console.log('Destinatario (to):', payload.to);
  console.log('Remitente (from):', payload.from);
  console.log('Asunto (subject):', payload.subject);
  console.log('Texto plano:', payload.text);
  console.log('Payload completo:', payload);
  console.groupEnd();

  // Guardar en log de auditoría
  try {
    const existing = JSON.parse(localStorage.getItem(EMAIL_AUDIT_LOG_KEY) || '[]');
    const record = {
      messageId,
      to: payload.to,
      subject: payload.subject,
      dispatchedAt: new Date().toISOString(),
      category: payload.tags?.find((t) => t.name === 'category')?.value || 'general',
    };
    localStorage.setItem(EMAIL_AUDIT_LOG_KEY, JSON.stringify([record, ...existing.slice(0, 49)]));
  } catch {
    // ignorar quota de storage
  }

  return {
    success: true,
    messageId,
    recipient: payload.to,
    dispatchedAt: new Date().toISOString(),
    mode: 'simulated_dev',
  };
}

// ----------------------------------------------------------------------------
// Funciones de alto nivel para despachar directamente cada flujo del taller
// ----------------------------------------------------------------------------

export async function sendStudentTicketEmail(data: StudentTicketEmailData): Promise<EmailDispatchResult> {
  const payload = renderStudentTicketEmail(data);
  return dispatchEmailPayload(payload);
}

export async function sendStudioEnrollmentNotification(data: StudioEnrollmentNotificationData): Promise<EmailDispatchResult> {
  const payload = renderStudioEnrollmentNotification(data);
  return dispatchEmailPayload(payload);
}

export async function sendClientQuoteConfirmation(data: ClientQuoteConfirmationData): Promise<EmailDispatchResult> {
  const payload = renderClientQuoteConfirmation(data);
  return dispatchEmailPayload(payload);
}

export async function sendStudioQuoteNotification(data: StudioQuoteNotificationData): Promise<EmailDispatchResult> {
  const payload = renderStudioQuoteNotification(data);
  return dispatchEmailPayload(payload);
}

export async function sendFormalProposalEmail(data: FormalProposalEmailData): Promise<EmailDispatchResult> {
  const payload = renderFormalProposalEmail(data);
  return dispatchEmailPayload(payload);
}
