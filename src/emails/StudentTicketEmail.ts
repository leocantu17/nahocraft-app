import { EmailPayload, StudentTicketEmailData } from './types';
import { renderBaseEmailLayout } from './baseLayout';

/**
 * Plantilla de Correo 1: Boleto de Acceso al Alumno con enlace a Google Meet y Código Único.
 * Disparada automáticamente al confirmar compra de curso en la plataforma.
 */
export function renderStudentTicketEmail(data: StudentTicketEmailData): EmailPayload {
  const subject = `🎟️ Tu Boleto & Enlace de Google Meet: ${data.courseTitle} • Nahocraft`;
  const preheader = `¡Lugar asegurado, ${data.buyerName}! Tu código de acceso es ${data.accessCode} para la sesión del ${data.eventDateDisplay}.`;

  const htmlContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #DEF7EC; color: #03543F; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 100px;">
        ✓ Inscripción Confirmada
      </span>
      <h2 style="margin: 12px 0 6px 0; color: #181B20; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
        ¡Hola, ${data.buyerName}!
      </h2>
      <p style="margin: 0; color: #4A5568; font-size: 15px;">
        Tu lugar está asegurado. Me da muchísima emoción que nos acompañes en esta sesión creativa en vivo.
      </p>
    </div>

    <!-- Ticket Summary Card -->
    <div style="background-color: #181B20; border-radius: 18px; padding: 24px; color: #ffffff; margin-bottom: 24px; position: relative; overflow: hidden;">
      <div style="border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 16px; margin-bottom: 16px;">
        <span style="font-size: 10px; color: #FE3770; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; display: block; margin-bottom: 4px;">
          Boleto Oficial de Acceso
        </span>
        <h3 style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 700; line-height: 1.3;">
          ${data.courseTitle}
        </h3>
        ${
          data.courseSubtitle
            ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.7);">${data.courseSubtitle}</p>`
            : ''
        }
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; margin-bottom: 18px;">
        <tr>
          <td style="color: rgba(255,255,255,0.6); padding-bottom: 8px;">📅 Fecha:</td>
          <td align="right" style="color: #ffffff; font-weight: 700; padding-bottom: 8px;">${data.eventDateDisplay}</td>
        </tr>
        <tr>
          <td style="color: rgba(255,255,255,0.6); padding-bottom: 8px;">⏱️ Horario:</td>
          <td align="right" style="color: #FCDD1D; font-weight: 700; font-family: monospace; padding-bottom: 8px;">${data.eventTimeDisplay}</td>
        </tr>
        <tr>
          <td style="color: rgba(255,255,255,0.6); padding-bottom: 8px;">🎟️ Folio / Código:</td>
          <td align="right" style="color: #FE3770; font-weight: 800; font-family: monospace; padding-bottom: 8px;">${data.accessCode}</td>
        </tr>
        <tr>
          <td style="color: rgba(255,255,255,0.6);">👩‍🎨 Impartido por:</td>
          <td align="right" style="color: #ffffff; font-weight: 600;">Nahomy • Nahocraft</td>
        </tr>
      </table>

      <!-- Google Meet Join Button -->
      <div style="text-align: center; padding-top: 6px;">
        <a href="${data.meetingLink}" class="btn-pink" style="display: block; background-color: #FE3770; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(254, 55, 112, 0.4);">
          🎥 Entrar a la Clase en Google Meet
        </a>
        <span style="display: block; margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.6); font-family: monospace;">
          ${data.meetingLink}
        </span>
      </div>
    </div>

    <!-- Recommendations & Materials -->
    <div style="background-color: #FAF7F2; border: 1px solid #EAE6DE; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 10px 0; color: #181B20; font-size: 14px; font-weight: 700;">
        💡 Indicaciones para el día del taller:
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #4A5568; font-size: 13px; line-height: 1.7;">
        <li>Conéctate <strong>5 minutos antes</strong> con la misma cuenta de correo con la que registraste tu boleto (${data.buyerEmail}).</li>
        <li>Ten a la mano tus pinceles, acrílicos, agua limpia, trapo y superficie o lienzo.</li>
        <li>Durante la sesión habrá espacio para <strong>preguntas y respuestas en vivo</strong> y revisión de tus avances directamente conmigo.</li>
        <li>La grabación estará disponible durante 15 días posteriores para repasar los ejercicios a tu propio ritmo.</li>
      </ul>
    </div>

    <!-- Receipt / Payment Note -->
    <div style="font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #EDF2F7; padding-top: 16px;">
      <p style="margin: 0;">
        Método de pago registrado: <strong>${data.paymentMethod.toUpperCase()}</strong> • Total pagado: <strong>$${data.totalPaid} MXN</strong> • Folio de orden: <strong style="font-family: monospace;">${data.folio}</strong>
      </p>
      <p style="margin: 6px 0 0 0;">
        ¿Tienes alguna duda sobre tus materiales o conexión? Respóndeme a este correo o al WhatsApp <strong>${data.studioPhone || '+52 833 365 5622'}</strong>.
      </p>
    </div>
  `;

  const textContent = `
¡HOLA, ${data.buyerName.toUpperCase()}!
Tu inscripción al curso "${data.courseTitle}" está confirmada.

DETALLES DEL CURSO:
• Curso: ${data.courseTitle}
• Fecha: ${data.eventDateDisplay}
• Horario: ${data.eventTimeDisplay}
• Impartido por: Nahomy (Nahocraft Centro de Arte)
• Código personal de acceso: ${data.accessCode}
• Folio de orden: ${data.folio}

ENLACE DE ACCESO A GOOGLE MEET:
${data.meetingLink}

INDICACIONES PREVIAS:
1. Conéctate 5 minutos antes con el correo que registraste (${data.buyerEmail}).
2. Ten listos tus materiales y un espacio bien iluminado.
3. Tendremos revisión en vivo y resolución de dudas paso a paso.

DETALLES DE PAGO:
Total pagado: $${data.totalPaid} MXN (${data.paymentMethod.toUpperCase()})

Cualquier duda, contáctanos al WhatsApp ${data.studioPhone || '+52 833 365 5622'} o a ${data.adminEmail || 'Centrodearte@nahocraft.com'}.
¡Nos vemos en clase!
Nahomy • Nahocraft Centro de Arte (Tampico, Tamaulipas)
`.trim();

  return {
    to: data.buyerEmail,
    from: `Nahocraft Centro de Arte <${data.adminEmail || 'Centrodearte@nahocraft.com'}>`,
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
      { name: 'category', value: 'course_ticket' },
      { name: 'folio', value: data.folio },
    ],
    metadata: {
      accessCode: data.accessCode,
      courseTitle: data.courseTitle,
      folio: data.folio,
    },
  };
}
