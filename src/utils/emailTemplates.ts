import { CourseEnrollment, CourseItem, QuoteTicket, SiteGeneralConfig } from '../types';
import {
  renderStudentTicketEmail,
  renderStudioEnrollmentNotification,
  renderClientQuoteConfirmation,
  renderStudioQuoteNotification,
  renderFormalProposalEmail,
  EmailPayload,
} from '../emails';

export interface EmailTemplateResult {
  id: string;
  name: string;
  recipientType: 'alumno' | 'estudio' | 'cliente_cotizacion';
  subject: string;
  preheader: string;
  html: string;
  text: string;
  payload: EmailPayload;
}

export function generateStudentCourseTicketEmail(
  enrollment: CourseEnrollment,
  course: CourseItem,
  siteConfig: SiteGeneralConfig
): EmailTemplateResult {
  const payload = renderStudentTicketEmail({
    buyerName: enrollment.buyerName,
    buyerEmail: enrollment.buyerEmail,
    buyerPhone: enrollment.buyerPhone,
    accessCode: enrollment.accessCode,
    folio: enrollment.folio,
    courseTitle: course.title,
    courseSubtitle: course.subtitle,
    eventDateDisplay: course.eventDateDisplay,
    eventTimeDisplay: course.eventTimeDisplay,
    meetingLink: enrollment.meetingLink,
    totalPaid: enrollment.totalPaid,
    paymentMethod: enrollment.paymentMethod,
    studioAddress: siteConfig.studioAddress,
    studioPhone: siteConfig.studioPhone,
    adminEmail: siteConfig.adminEmail,
  });

  return {
    id: 'curso_alumno',
    name: 'Boleto de Alumno (Confirmación con Meet & Código)',
    recipientType: 'alumno',
    subject: payload.subject,
    preheader: `¡Lugar confirmado, ${enrollment.buyerName}! Aquí está tu código de acceso (${enrollment.accessCode}) y enlace de Google Meet.`,
    html: payload.html,
    text: payload.text,
    payload,
  };
}

export function generateStudioNewEnrollmentNotificationEmail(
  enrollment: CourseEnrollment,
  course: CourseItem,
  siteConfig: SiteGeneralConfig
): EmailTemplateResult {
  const payload = renderStudioEnrollmentNotification({
    buyerName: enrollment.buyerName,
    buyerEmail: enrollment.buyerEmail,
    buyerPhone: enrollment.buyerPhone,
    accessCode: enrollment.accessCode,
    folio: enrollment.folio,
    courseTitle: course.title,
    eventDateDisplay: course.eventDateDisplay,
    eventTimeDisplay: course.eventTimeDisplay,
    totalPaid: enrollment.totalPaid,
    paymentMethod: enrollment.paymentMethod,
    purchasedAt: enrollment.purchasedAt,
    adminEmail: siteConfig.adminEmail,
  });

  return {
    id: 'curso_nahomy',
    name: 'Aviso a Nahomy de Nuevo Alumno en Curso',
    recipientType: 'estudio',
    subject: payload.subject,
    preheader: `Nuevo alumno registrado: ${enrollment.buyerName} (${enrollment.buyerEmail}) • Pago: $${enrollment.totalPaid} MXN.`,
    html: payload.html,
    text: payload.text,
    payload,
  };
}

export function generateClientQuoteConfirmationEmail(
  ticket: QuoteTicket,
  siteConfig: SiteGeneralConfig
): EmailTemplateResult {
  const payload = renderClientQuoteConfirmation({
    clientName: ticket.formData.clientName,
    clientEmail: ticket.formData.clientEmail,
    clientPhone: ticket.formData.clientPhone,
    folio: ticket.folio,
    muralCategory: ticket.formData.muralCategory,
    dimensions: ticket.formData.dimensions,
    customDimensions: ticket.formData.customDimensions,
    surfaceOrMaterial: ticket.formData.surfaceOrMaterial,
    cityZone: ticket.formData.cityZone,
    neighborhoodOrAddress: ticket.formData.neighborhoodOrAddress,
    deadlineDate: ticket.formData.deadlineDate,
    themeAndDetails: ticket.formData.themeAndDetails,
    studioAddress: siteConfig.studioAddress,
    studioPhone: siteConfig.studioPhone,
    adminEmail: siteConfig.adminEmail,
  });

  return {
    id: 'cotizacion_cliente',
    name: 'Confirmación de Cotización de Mural al Cliente',
    recipientType: 'cliente_cotizacion',
    subject: payload.subject,
    preheader: `Hola ${ticket.formData.clientName}, ya estamos analizando tu proyecto de mural en ${ticket.formData.cityZone}.`,
    html: payload.html,
    text: payload.text,
    payload,
  };
}

export function generateStudioNewQuoteNotificationEmail(
  ticket: QuoteTicket,
  siteConfig: SiteGeneralConfig
): EmailTemplateResult {
  const payload = renderStudioQuoteNotification({
    clientName: ticket.formData.clientName,
    clientEmail: ticket.formData.clientEmail,
    clientPhone: ticket.formData.clientPhone,
    folio: ticket.folio,
    muralCategory: ticket.formData.muralCategory,
    dimensions: ticket.formData.dimensions,
    customDimensions: ticket.formData.customDimensions,
    surfaceOrMaterial: ticket.formData.surfaceOrMaterial,
    cityZone: ticket.formData.cityZone,
    neighborhoodOrAddress: ticket.formData.neighborhoodOrAddress,
    deadlineDate: ticket.formData.deadlineDate,
    themeAndDetails: ticket.formData.themeAndDetails,
    referenceImagePreview: ticket.formData.referenceImagePreview,
    adminEmail: siteConfig.adminEmail,
  });

  return {
    id: 'cotizacion_nahomy',
    name: 'Aviso a Nahomy de Nueva Cotización de Mural',
    recipientType: 'estudio',
    subject: payload.subject,
    preheader: `Nueva solicitud de mural en ${ticket.formData.cityZone}: ${ticket.formData.dimensions} • Cliente: ${ticket.formData.clientName}`,
    html: payload.html,
    text: payload.text,
    payload,
  };
}

export function generateFormalProposalEmail(
  ticket: QuoteTicket,
  siteConfig: SiteGeneralConfig
): EmailTemplateResult {
  const payload = renderFormalProposalEmail({
    clientName: ticket.formData.clientName,
    clientEmail: ticket.formData.clientEmail,
    clientPhone: ticket.formData.clientPhone,
    folio: ticket.folio,
    muralCategory: ticket.formData.muralCategory,
    dimensions: ticket.formData.dimensions,
    cityZone: ticket.formData.cityZone,
    neighborhoodOrAddress: ticket.formData.neighborhoodOrAddress,
    themeAndDetails: ticket.formData.themeAndDetails,
    studioAddress: siteConfig.studioAddress,
    studioPhone: siteConfig.studioPhone,
    adminEmail: siteConfig.adminEmail,
  });

  return {
    id: 'propuesta_formal',
    name: 'Propuesta Formal & Presupuesto al Cliente',
    recipientType: 'cliente_cotizacion',
    subject: payload.subject,
    preheader: `Hola ${ticket.formData.clientName}, te comparto la propuesta artística y cotización para tu mural en ${ticket.formData.cityZone}.`,
    html: payload.html,
    text: payload.text,
    payload,
  };
}
