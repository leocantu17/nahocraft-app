import { EmailPayload, ClientQuoteConfirmationData } from './types';
import { renderBaseEmailLayout } from './baseLayout';

/**
 * Plantilla de Correo 3: Confirmación de Solicitud de Cotización de Mural al Cliente.
 * Disparada inmediatamente cuando el cliente completa el formulario de cotización.
 */
export function renderClientQuoteConfirmation(data: ClientQuoteConfirmationData): EmailPayload {
  const subject = `✨ Recibimos tu solicitud de cotización ${data.folio} • Nahocraft Centro de Arte`;
  const preheader = `Hola ${data.clientName}, ya estamos analizando tu proyecto de mural en ${data.cityZone}.`;

  const htmlContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #FDF2F8; color: #FE3770; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 100px;">
        Muralismo a Medida • Tampico, Madero y Altamira
      </span>
      <h2 style="margin: 12px 0 6px 0; color: #181B20; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
        ¡Hola, ${data.clientName}!
      </h2>
      <p style="margin: 0; color: #4A5568; font-size: 15px;">
        Muchas gracias por pensar en <strong>Nahocraft</strong> para darle vida e identidad a tu espacio.
      </p>
    </div>

    <p style="font-size: 14px; color: #4A5568; line-height: 1.6; margin-bottom: 20px;">
      He recibido los datos de tu solicitud y ya comencé a estudiar tu idea, las medidas del muro y la atmósfera que buscas proyectar en <strong>${data.cityZone}</strong>.
    </p>

    <!-- Technical Sheet Box -->
    <div style="background-color: #FAF7F2; border: 1px solid #EAE6DE; border-radius: 16px; padding: 22px; margin-bottom: 24px;">
      <div style="border-bottom: 1px solid #E2DCD2; padding-bottom: 10px; margin-bottom: 14px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-size: 11px; font-weight: 800; color: #181B20; text-transform: uppercase; letter-spacing: 1px;">
              Ficha del Proyecto
            </td>
            <td align="right" style="font-family: monospace; font-size: 12px; font-weight: 700; color: #FE3770;">
              ${data.folio}
            </td>
          </tr>
        </table>
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
        <tr>
          <td style="color: #718096; padding-bottom: 8px; width: 140px;">🎨 Categoría:</td>
          <td style="color: #181B20; font-weight: 700; padding-bottom: 8px;">${data.muralCategory || 'Mural Personalizado'}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">📏 Dimensiones:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.dimensions} ${data.customDimensions ? `(${data.customDimensions})` : ''}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">🧱 Superficie:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.surfaceOrMaterial || 'Pared lisa estándar'}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">📍 Ubicación:</td>
          <td style="color: #181B20; font-weight: 600; padding-bottom: 8px;">${data.cityZone} ${data.neighborhoodOrAddress ? `• ${data.neighborhoodOrAddress}` : ''}</td>
        </tr>
        <tr>
          <td style="color: #718096; padding-bottom: 8px;">📅 Fecha Estimada:</td>
          <td style="color: #181B20; padding-bottom: 8px;">${data.deadlineDate || 'Fecha flexible'}</td>
        </tr>
      </table>

      <div style="margin-top: 12px; padding: 12px; background-color: #ffffff; border-radius: 10px; border: 1px solid #EAE6DE;">
        <span style="font-size: 10px; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
          Tu Idea / Concepto:
        </span>
        <p style="margin: 0; font-size: 13px; color: #2D3748; font-style: italic;">
          "${data.themeAndDetails}"
        </p>
      </div>
    </div>

    <!-- Next Steps Timeline -->
    <div style="background-color: #ffffff; border: 1px solid #EAE6DE; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 14px 0; color: #181B20; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
        📌 ¿Qué sigue ahora?
      </h4>
      <div style="font-size: 13px; color: #4A5568; line-height: 1.8;">
        <p style="margin: 0 0 8px 0;">
          <strong>1. Revisión creativa:</strong> Estudiaré el área y la complejidad del diseño para calcular los materiales y el tiempo de ejecución (24 a 48 hrs hábiles).
        </p>
        <p style="margin: 0 0 8px 0;">
          <strong>2. Contacto directo:</strong> Me comunicaré contigo por WhatsApp (o correo) para compartirte la propuesta visual, cotización formal y afinar detalles.
        </p>
        <p style="margin: 0;">
          <strong>3. Agendar fecha:</strong> Si la propuesta te gusta, acordamos el anticipo y reservamos las fechas de pintado en el muro.
        </p>
      </div>
    </div>

    <div style="text-align: center; font-size: 13px; color: #4A5568;">
      <p style="margin: 0 0 4px 0;">
        Si tienes fotos del muro o planos que quieras adelantarme, puedes enviármelos directamente por WhatsApp:
      </p>
      <a href="https://wa.me/528333655622?text=${encodeURIComponent(
        `Hola Nahomy! Soy ${data.clientName} con el folio ${data.folio}. Te escribo para compartirte fotos de mi muro para el mural en ${data.cityZone}.`
      )}" style="color: #25D366; font-weight: 700; text-decoration: none; font-size: 14px;">
        💬 Enviar fotos por WhatsApp (+52 833 365 5622)
      </a>
    </div>
  `;

  const textContent = `
¡HOLA, ${data.clientName.toUpperCase()}!
Recibimos con mucho gusto tu solicitud de cotización para tu mural en ${data.cityZone}.

RESUMEN DE TU SOLICITUD (${data.folio}):
• Categoría: ${data.muralCategory}
• Dimensiones: ${data.dimensions}
• Ubicación: ${data.cityZone} (${data.neighborhoodOrAddress || ''})
• Fecha objetivo: ${data.deadlineDate || 'Flexible'}
• Idea: "${data.themeAndDetails}"

PRÓXIMOS PASOS:
1. Revisaré tus medidas y diseño para calcular los materiales de alta durabilidad (24 a 48 hrs hábiles).
2. Te escribiré por WhatsApp o correo para presentarte la propuesta artística y presupuesto.
3. Si te gusta, reservamos fecha y comenzamos el boceto.

Cualquier duda o fotos adicionales de tu muro, puedes compartírmelas al WhatsApp ${data.studioPhone || '+52 833 365 5622'}.
¡Será un honor crear arte para ti!

Nahomy • Nahocraft Centro de Arte
Tampico, Tamaulipas
`.trim();

  return {
    to: data.clientEmail,
    from: `Nahomy de Nahocraft <${data.adminEmail || 'Centrodearte@nahocraft.com'}>`,
    replyTo: data.adminEmail || 'Centrodearte@nahocraft.com',
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      preheader,
      contentHtml: htmlContent,
      studioAddress: data.studioAddress,
      studioPhone: data.studioPhone,
      adminEmail: data.adminEmail,
    }),
    text: textContent,
    tags: [
      { name: 'category', value: 'quote_confirmation' },
      { name: 'folio', value: data.folio },
    ],
    metadata: {
      folio: data.folio,
      clientName: data.clientName,
      cityZone: data.cityZone,
    },
  };
}
