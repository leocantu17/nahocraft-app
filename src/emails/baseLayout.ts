/**
 * Layout base de correo electrónico para Nahocraft Centro de Arte.
 * Compatible con clientes de escritorio (Outlook, Apple Mail) y web/móvil (Gmail, Yahoo, iOS Mail).
 */

/**
 * Escapa caracteres HTML especiales para prevenir inyecciones XSS / HTML en correos.
 */
export function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface BaseLayoutProps {
  title: string;
  preheader: string;
  contentHtml: string;
  studioAddress?: string;
  studioPhone?: string;
  adminEmail?: string;
}

export function renderBaseEmailLayout({
  title,
  preheader,
  contentHtml,
  studioAddress = 'Avenida Ayuntamiento 3 - 109, Minerva, 89120 Tampico, Tamps., México',
  studioPhone = '+52 833 365 5622',
  adminEmail = 'Centrodearte@nahocraft.com',
}: BaseLayoutProps): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F6F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .btn-pink:hover { background-color: #e0265d !important; }
    .btn-green:hover { background-color: #1eb954 !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; border-radius: 16px !important; }
      .content-padding { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EF; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (oculto visualmente en el cuerpo, visible en bandeja de entrada) -->
  <div style="display: none; font-size: 1px; color: #F6F4EF; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F6F4EF; padding: 24px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.06); border: 1px solid #EAE6DE;">
          
          <!-- Brand Header Bar -->
          <tr>
            <td style="background-color: #181B20; padding: 30px 28px 26px 28px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #FE3770; color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 4px 14px; border-radius: 100px; margin-bottom: 12px;">
                      Centro de Arte • Tampico
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 0.5px;">
                      Nahocraft
                    </h1>
                    <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.65); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">
                      Nahomy • Muralismo & Cursos en Vivo
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="content-padding" style="padding: 34px 32px 28px 32px; color: #2D3748; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Studio Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 26px 30px; border-top: 1px solid #EAE6DE; text-align: center; color: #718096; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #181B20; font-size: 13px;">
                Nahocraft Centro de Arte
              </p>
              <p style="margin: 0 0 6px 0;">
                📍 ${studioAddress}
              </p>
              <p style="margin: 0 0 12px 0;">
                📞 Tel / WhatsApp: <strong style="color: #181B20;">${studioPhone}</strong> • ✉️ <a href="mailto:${adminEmail}" style="color: #FE3770; text-decoration: none;">${adminEmail}</a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #A0AEC0; border-top: 1px solid #E2DCD2; padding-top: 10px;">
                © ${currentYear} Nahocraft. Mensaje automatizado generado por el sistema central del taller.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
