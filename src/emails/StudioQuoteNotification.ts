import { EmailPayload, StudioQuoteNotificationData } from './types';
import { renderBaseEmailLayout } from './baseLayout';

/**
 * Plantilla de Correo 4: Aviso a Nahomy de Nueva Solicitud de Cotización.
 * Notifica al correo de Nahomy con detalles técnicos, medidas y botón a WhatsApp.
 */
export function renderStudioQuoteNotification(data: StudioQuoteNotificationData): EmailPayload {
  const adminEmail = data.adminEmail || 'Centrodearte@nahocraft.com';
  const subject = `🔔 Nueva Cotización ${data.folio} de ${data.clientName} (${data.cityZone})`;
  const preheader = `Nueva solicitud de mural en ${data.cityZone}: ${data.dimensions} • Cliente: ${data.clientName}`;

  const cleanPhone = data.clientPhone.replace(/\D/g, '');
  const waLink = `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(
    `Hola ${data.clientName}! Te saluda Nahomy de Nahocraft Centro de Arte en Tampico 🎨 Recibí tu solicitud de cotización (${data.folio}) para tu mural en ${data.cityZone}. Me encantó tu idea y te escribo para dar seguimiento a tu propuesta. ¿Cómo estás?`
  )}`;

  const htmlContent = `
    <div style="border-left: 4px solid #FE3770; padding-left: 14px; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 800; color: #FE3770; text-transform: uppercase; letter-spacing: 1.5px;">
        Nueva Cotización Recibida
      </span>
      <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #181B20;">
        Mural solicitado en ${data.cityZone}
      </h2>
    </div>

    <!-- Client & Project Details -->
    <div style="background-color: #FAF7F2; border: 1px solid #EAE6DE; border-radius: 16px; padding: 22px; margin-bottom: 22px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
        <tr>
          <td style="color: #718096; padding-bottom: 8px; width: 130px;">Folio:</td>
          <td style="color: #FE3770; font-weight: 800; font-family: monospace; padding-bottom: 8px;">${data.folio}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Cliente:</td>
          <td style="color: #181B20; font-weight: 700; padding-bottom: 8px;">${data.clientName}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">WhatsApp:</td>
          <td style="color: #181B20; font-family: monospace; padding-bottom: 8px;">${data.clientPhone}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Correo:</td>
          <td style="color: #181B20; font-family: monospace; padding-bottom: 8px;">${data.clientEmail}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Categoría:</td>
          <td style="color: #181B20; font-weight: 600; padding-bottom: 8px;">${data.muralCategory}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Dimensiones:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.dimensions} ${data.customDimensions ? `(${data.customDimensions})` : ''}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Superficie:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.surfaceOrMaterial || 'Pared estándar'}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Zona / Dirección:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.cityZone} - ${data.neighborhoodOrAddress || 'Sin dirección específica'}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">Fecha deseada:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.deadlineDate || 'Flexible'}</td>
        </tr>
      </table>

      <div style="margin-top: 14px; padding: 14px; background-color: #ffffff; border-radius: 12px; border: 1px solid #EAE6DE;">
        <span style="font-size: 10px; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
          Concepto / Necesidad del Cliente:
        </span>
        <p style="margin: 0; font-size: 13px; color: #181B20; font-style: italic; line-height: 1.5;">
          "${data.themeAndDetails}"
        </p>
      </div>

      ${
        data.referenceImagePreview
          ? `
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #E2DCD2;">
          <span style="font-size: 10px; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">
            Foto de Referencia Adjunta por el Cliente:
          </span>
          <img src="${data.referenceImagePreview}" alt="Referencia" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #EAE6DE;" />
        </div>
      `
          : ''
      }
    </div>

    <!-- WhatsApp Fast Action -->
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="${waLink}" class="btn-green" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 100px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
        💬 Abrir Chat de WhatsApp con el Cliente
      </a>
    </div>

    <p style="font-size: 12px; color: #718096; text-align: center; margin: 0;">
      Esta cotización quedó registrada en tu panel con el folio <strong>${data.folio}</strong>.
    </p>
  `;

  const textContent = `
¡NUEVA SOLICITUD DE COTIZACIÓN DE MURAL EN NAHOCRAFT!
• Folio: ${data.folio}
• Cliente: ${data.clientName}
• WhatsApp: ${data.clientPhone}
• Correo: ${data.clientEmail}
• Categoría: ${data.muralCategory}
• Dimensiones: ${data.dimensions}
• Ubicación: ${data.cityZone} (${data.neighborhoodOrAddress || ''})
• Fecha objetivo: ${data.deadlineDate || 'Flexible'}
• Idea: "${data.themeAndDetails}"

Enlace directo de WhatsApp: ${waLink}
`.trim();

  return {
    to: adminEmail,
    from: `Sistema Nahocraft <${adminEmail}>`,
    replyTo: data.clientEmail,
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      preheader,
      contentHtml: htmlContent,
      adminEmail,
    }),
    text: textContent,
    tags: [
      { name: 'category', value: 'admin_quote_notice' },
      { name: 'folio', value: data.folio },
    ],
    metadata: {
      folio: data.folio,
      clientName: data.clientName,
      cityZone: data.cityZone,
    },
  };
}
