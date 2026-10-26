import { EmailPayload, FormalProposalEmailData } from './types';
import { renderBaseEmailLayout } from './baseLayout';

/**
 * Plantilla de Correo 5: Propuesta Formal y Presupuesto Oficial de Mural al Cliente.
 * Generada tras la revisión de Nahomy con desglose de servicios, anticipo y sellador anti-UV.
 */
export function renderFormalProposalEmail(data: FormalProposalEmailData): EmailPayload {
  const subject = `🎨 Propuesta & Presupuesto de Mural ${data.folio} • Nahocraft Centro de Arte`;
  const preheader = `Hola ${data.clientName}, te comparto la propuesta artística y cotización para tu mural en ${data.cityZone}.`;

  const htmlContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #FE3770; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 100px;">
        Propuesta Formal de Muralismo
      </span>
      <h2 style="margin: 12px 0 6px 0; color: #181B20; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
        Propuesta para ${data.clientName}
      </h2>
      <p style="margin: 0; color: #718096; font-size: 13px; font-family: monospace;">
        Proyecto ${data.folio} • ${data.cityZone}
      </p>
    </div>

    <p style="font-size: 15px; color: #2D3748; line-height: 1.6; margin-bottom: 20px;">
      Hola, <strong>${data.clientName}</strong>: con base en las medidas proporcionadas (<strong>${data.dimensions}</strong>) y la idea que platicamos para tu espacio en <strong>${data.cityZone}</strong>, te presento la propuesta artística y condiciones de trabajo:
    </p>

    <!-- Inclusions Card -->
    <div style="background-color: #FAF7F2; border: 1px solid #EAE6DE; border-radius: 16px; padding: 22px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 12px 0; color: #181B20; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
        ✨ ¿Qué incluye este servicio profesional?
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #4A5568; font-size: 13px; line-height: 1.7;">
        <li><strong>Boceto digital personalizado:</strong> Presentación visual sobre la fotografía de tu muro con hasta 2 rondas de ajustes de color y composición.</li>
        <li><strong>Preparación de superficie:</strong> Sellador vinílico y fondo nivelador para garantizar la perfecta adherencia de los trazos.</li>
        <li><strong>Pintura 100% a mano por Nahomy:</strong> Aplicación de acrílicos artísticos de alta pigmentación y resistencia a la humedad de la zona sur de Tamaulipas.</li>
        <li><strong>Sellado de protección final:</strong> Capa de barniz mate o satinado con filtro anti-UV lavable de larga durabilidad.</li>
        <li><strong>Limpieza completa:</strong> El área se entrega impecable al finalizar la obra.</li>
      </ul>
    </div>

    <!-- Execution Timeline & Terms -->
    <div style="background-color: #ffffff; border: 1px solid #EAE6DE; border-radius: 16px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #4A5568; line-height: 1.6;">
      <h4 style="margin: 0 0 10px 0; color: #181B20; font-size: 14px; font-weight: 700;">
        ⏱️ Tiempos de Entrega & Condiciones:
      </h4>
      <p style="margin: 0 0 8px 0;">
        • Tiempo estimado de pintado: <strong>${data.estimatedDays || '3 a 5 días hábiles'}</strong> (según clima y condiciones del muro).
      </p>
      <p style="margin: 0 0 8px 0;">
        • Esquema de pago: <strong>50% de anticipo</strong> para apartar fechas e iniciar boceto digital, y <strong>50% finiquito</strong> al concluir la obra a tu entera satisfacción.
      </p>
      <p style="margin: 0;">
        • Cobertura sin costo adicional de viáticos en Tampico, Ciudad Madero y Altamira.
      </p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="font-size: 14px; color: #181B20; font-weight: 600; margin: 0 0 12px 0;">
        ¿Te gustaría que agendemos la fecha o afinemos algún detalle del diseño?
      </p>
      <a href="https://wa.me/528333655622?text=${encodeURIComponent(
        `Hola Nahomy! Revisé la propuesta formal de cotización ${data.folio} para mi mural en ${data.cityZone}. Me gustaría platicar los siguientes pasos.`
      )}" class="btn-pink" style="display: inline-block; background-color: #181B20; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 100px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
        💬 Platicar con Nahomy por WhatsApp
      </a>
    </div>

    <div style="border-top: 1px solid #EDF2F7; padding-top: 16px; font-size: 12px; color: #718096; text-align: center;">
      <p style="margin: 0; font-style: italic; color: #181B20; font-family: 'Playfair Display', Georgia, serif; font-size: 14px;">
        "Cada mural nace de una emoción; será un honor crear esta pieza para ti."
      </p>
      <p style="margin: 4px 0 0 0; font-weight: 700; color: #FE3770;">
        Nahomy • Fundadora y Muralista de Nahocraft Centro de Arte
      </p>
    </div>
  `;

  const textContent = `
PROPUESTA FORMAL & PRESUPUESTO DE MURALISMO
Nahocraft Centro de Arte • Tampico, Tamaulipas
Folio del Proyecto: ${data.folio}
Cliente: ${data.clientName}
Ubicación: ${data.cityZone}
Dimensiones: ${data.dimensions}

SERVICIOS INCLUIDOS:
1. Boceto digital sobre foto real del muro con ajustes de composición.
2. Preparación y sellado de muro para máxima adherencia.
3. Pintura artística 100% a mano por Nahomy con acrílicos profesionales.
4. Acabado con sellador anti-UV lavable de alta durabilidad.
5. Limpieza total del área.

TIEMPO ESTIMADO & ESQUEMA:
• ${data.estimatedDays || '3 a 5 días de ejecución en sitio'}.
• 50% de anticipo para calendarizar y comenzar diseño, 50% finiquito contra entrega.
• Cobertura en Tampico, Cd. Madero y Altamira.

Para resolver dudas o apartar tu fecha, escríbeme directamente al WhatsApp ${data.studioPhone || '+52 833 365 5622'}.
Nahomy • Nahocraft Centro de Arte
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
      { name: 'category', value: 'formal_proposal' },
      { name: 'folio', value: data.folio },
    ],
    metadata: {
      folio: data.folio,
      clientName: data.clientName,
      cityZone: data.cityZone,
    },
  };
}
