/**
 * Definiciones de tipos para el sistema de correos electrónicos de Nahocraft.
 * Estructuras estandarizadas para integración directa con cualquier backend
 * (Resend, SendGrid, Nodemailer, Supabase, Cloudflare Workers o API REST).
 */

export interface EmailPayload {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  tags?: Array<{ name: string; value: string }>;
  metadata?: Record<string, unknown>;
}

export interface EmailDispatchResult {
  success: boolean;
  messageId: string;
  recipient: string;
  dispatchedAt: string;
  mode: 'live_backend' | 'simulated_dev';
  error?: string;
}

// ----------------------------------------------------------------------------
// Datos de entrada para cada plantilla (100% tipados)
// ----------------------------------------------------------------------------

export interface StudentTicketEmailData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  accessCode: string;
  folio: string;
  courseTitle: string;
  courseSubtitle?: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  meetingLink: string;
  totalPaid: number;
  paymentMethod: string;
  studioAddress?: string;
  studioPhone?: string;
  adminEmail?: string;
}

export interface StudioEnrollmentNotificationData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  accessCode: string;
  folio: string;
  courseTitle: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  totalPaid: number;
  paymentMethod: string;
  purchasedAt?: string;
  adminEmail?: string;
}

export interface ClientQuoteConfirmationData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  folio: string;
  muralCategory: string;
  dimensions: string;
  customDimensions?: string;
  surfaceOrMaterial?: string;
  cityZone: string;
  neighborhoodOrAddress?: string;
  deadlineDate?: string;
  themeAndDetails: string;
  studioAddress?: string;
  studioPhone?: string;
  adminEmail?: string;
}

export interface StudioQuoteNotificationData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  folio: string;
  muralCategory: string;
  dimensions: string;
  customDimensions?: string;
  surfaceOrMaterial?: string;
  cityZone: string;
  neighborhoodOrAddress?: string;
  deadlineDate?: string;
  themeAndDetails: string;
  referenceImagePreview?: string;
  adminEmail?: string;
}

export interface FormalProposalEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  folio: string;
  muralCategory: string;
  dimensions: string;
  cityZone: string;
  neighborhoodOrAddress?: string;
  themeAndDetails: string;
  estimatedDays?: string;
  totalEstimatedPrice?: number;
  downPaymentPercent?: number;
  studioAddress?: string;
  studioPhone?: string;
  adminEmail?: string;
}
