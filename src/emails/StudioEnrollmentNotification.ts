import { EmailPayload, StudioEnrollmentNotificationData } from './types';
import { renderBaseEmailLayout } from './baseLayout';

/**
 * Plantilla de Correo 2: Aviso a Nahomy de Nuevo Alumno Registrado en Curso.
 * Notifica al correo administrativo con datos del alumno y botón de WhatsApp directo.
 */
export function renderStudioEnrollmentNotification(data: StudioEnrollmentNotificationData): EmailPayload {
  const adminEmail = data.adminEmail || 'Centrodearte@nahocraft.com';
  const subject = `🎨 ¡Nueva Inscripción! ${data.buyerName} adquirió boleto para ${data.courseTitle}`;
  const preheader = `Nuevo alumno registrado: ${data.buyerName} (${data.buyerEmail}) • Pago: $${data.totalPaid} MXN.`;

  const cleanPhone = data.buyerPhone.replace(/\D/g, '');
  const waLink = `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(
    `Hola ${data.buyerName}! Te saluda Nahomy de Nahocraft Centro de Arte. Recibí con gusto tu inscripción al curso "${data.courseTitle}". ¿Todo listo para la clase del ${data.eventDateDisplay}?`
  )}`;

  const htmlContent = `
    <div style="border-left: 4px solid #FE3770; padding-left: 14px; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 800; color: #FE3770; text-transform: uppercase; letter-spacing: 1.5px;">
        Nuevo Alumno en Plataforma
      </span>
      <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #181B20;">
        ¡Tienes una nueva inscripción, Nahomy!
      </h2>
    </div>

    <p style="font-size: 14px; color: #4A5568; margin-bottom: 20px;">
      Se ha confirmado un nuevo boleto en línea para tu masterclass. A continuación tienes la ficha del alumno:
    </p>

    <!-- Student Data Card -->
    <div style="background-color: #FAF7F2; border: 1px solid #EAE6DE; border-radius: 16px; padding: 22px; margin-bottom: 22px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
        <tr>
          <td style="color: #718096; padding-bottom: 10px; width: 130px;">👤 Alumno:</td>
          <td style="color: #181B20; font-weight: 700; padding-bottom: 10px;">${data.buyerName}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 10px;">✉️ Correo:</td>
          <td style="color: #181B20; font-family: monospace; padding-bottom: 10px;">${data.buyerEmail}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 10px;">📱 WhatsApp / Tel:</td>
          <td style="color: #181B20; font-family: monospace; padding-bottom: 10px;">${data.buyerPhone}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 10px;">📚 Taller:</td>
          <td style="color: #181B20; font-weight: 700; padding-bottom: 10px;">${data.courseTitle}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 10px;">📅 Fecha & Hora:</td>
          <td style="color: #181B20; padding-bottom: 10px;">${data.eventDateDisplay} (${data.eventTimeDisplay})</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 10px;">💵 Monto Cobrado:</td>
          <td style="color: #03543F; font-weight: 800; font-size: 15px; padding-bottom: 10px;">$${data.totalPaid} MXN (${data.paymentMethod.toUpperCase()})</td>
        </tr>
        <tr>
          <td style="color: #718096;">🔑 Código Generado:</td>
          <td style="color: #FE3770; font-weight: 800; font-family: monospace;">${data.accessCode}</td>
        </tr>
      </table>
    </div>

    <!-- Quick Action: WhatsApp -->
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="${waLink}" class="btn-green" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 100px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
        💬 Saludar al Alumno por WhatsApp
      </a>
    </div>

    <p style="font-size: 12px; color: #718096; text-align: center; margin: 0;">
      El alumno ya recibió de forma automatizada su boleto digital con su liga de Google Meet.
    </p>
  `;

  const textContent = `
¡NUEVA INSCRIPCIÓN DE ALUMNO EN NAHOCRAFT!
• Alumno: ${data.buyerName}
• Correo: ${data.buyerEmail}
• Teléfono: ${data.buyerPhone}
• Curso: ${data.courseTitle}
• Fecha: ${data.eventDateDisplay} (${data.eventTimeDisplay})
• Monto: $${data.totalPaid} MXN (${data.paymentMethod})
• Código: ${data.accessCode}
• Folio: ${data.folio}

Enlace directo de WhatsApp: ${waLink}
`.trim();

  return {
    to: adminEmail,
    from: `Sistema Nahocraft <${adminEmail}>`,
    replyTo: data.buyerEmail,
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      preheader,
      contentHtml: htmlContent,
      adminEmail,
    }),
    text: textContent,
    tags: [
      { name: 'category', value: 'admin_enrollment_notice' },
      { name: 'folio', value: data.folio },
    ],
    metadata: {
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      folio: data.folio,
    },
  };
}
