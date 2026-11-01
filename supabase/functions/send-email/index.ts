// =============================================================================
// SUPABASE EDGE FUNCTION: send-email (con Nodemailer SMTP)
// Ubicación: supabase/functions/send-email/index.ts
// Despliegue: pnpm dlx supabase functions deploy send-email --no-verify-jwt
// Secrets requeridos en Supabase:
//   supabase secrets set SMTP_HOST=smtp.gmail.com SMTP_PORT=465 SMTP_USER=tu@correo.com SMTP_PASS=tu_app_password
// =============================================================================

import nodemailer from 'nodemailer';

// Declaración de tipos para que el editor de código (VS Code/IDE) reconozca Deno sin advertencias
declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface IncomingEmailPayload {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

// Deno.serve es la API nativa y moderna recomendada para Supabase Edge Functions
Deno.serve(async (req: Request) => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Validar método HTTP
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido. Utiliza POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload = (await req.json()) as IncomingEmailPayload;

    if (!payload.to || !payload.subject || !payload.html) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios (to, subject, html).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = Number(Deno.env.get('SMTP_PORT') || 465);
    const smtpUser = Deno.env.get('SMTP_USER') || '';
    const smtpPass = Deno.env.get('SMTP_PASS') || '';
    const defaultFrom =
      Deno.env.get('SMTP_FROM') || `Nahocraft Centro de Arte <${smtpUser}>`;

    if (!smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({
          error: 'Credenciales SMTP (SMTP_USER / SMTP_PASS) no configuradas en Supabase Secrets.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from: payload.from || defaultFrom,
      to: payload.to,
      replyTo: payload.replyTo || smtpUser,
      subject: payload.subject,
      text: payload.text || '',
      html: payload.html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        id: info.messageId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido enviando correo';
    console.error('[Nahocraft Nodemailer Error]:', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

