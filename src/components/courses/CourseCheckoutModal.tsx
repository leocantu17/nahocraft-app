import React, { useState, useEffect, useId } from 'react';
import { CourseItem, CourseEnrollment } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import confetti from 'canvas-confetti';
import { sendStudentTicketEmail, sendStudioEnrollmentNotification } from '../../emails';
import { sanitizeText, checkSubmissionCooldown, recordSubmission } from '../../utils/security';
import {
  X,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Mail,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Lock,
  UserCheck,
  AlertCircle,
  Sparkles,
  Download,
  CalendarPlus,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react';

interface CourseCheckoutModalProps {
  course: CourseItem | null;
  onClose: () => void;
}

function buildCalendarDates(eventDate: string, eventTimeDisplay: string) {
  const cleanDate = (eventDate || '2026-10-29').replace(/-/g, '');
  const match = eventTimeDisplay.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  const startH = match ? match[1].padStart(2, '0') : '17';
  const startM = match ? match[2].padStart(2, '0') : '00';
  const endH = match ? match[3].padStart(2, '0') : '19';
  const endM = match ? match[4].padStart(2, '0') : '30';
  return {
    start: `${cleanDate}T${startH}${startM}00`,
    end: `${cleanDate}T${endH}${endM}00`,
  };
}

export function CourseCheckoutModal({ course, onClose }: CourseCheckoutModalProps) {
  const { registerCourseEnrollment, courseEnrollments, siteConfig } = useSiteData();
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CourseEnrollment['paymentMethod']>('tarjeta');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedEnrollment, setCompletedEnrollment] = useState<CourseEnrollment | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!course) return null;

  const remainingSpots = Math.max(0, course.maxSpots - course.enrolledCount);
  const normalizedEmail = buyerEmail.trim().toLowerCase();

  // Check if this email account already has a personal ticket for this course
  const existingEnrollmentForEmail = courseEnrollments.find(
    (enr) =>
      enr.courseId === course.id &&
      enr.buyerEmail.trim().toLowerCase() === normalizedEmail &&
      normalizedEmail.length > 0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Detección Honeypot anti-spam
    if (honeypot.trim() !== '') {
      onClose();
      return;
    }

    // Rate limiting / Cooldown de 20s
    const cooldown = checkSubmissionCooldown('enrollment', 20);
    if (!cooldown.allowed) {
      setFormError(`Por favor espera ${cooldown.remainingSeconds}s antes de enviar otra inscripción.`);
      return;
    }

    const trimmedName = buyerName.trim();
    const trimmedEmail = buyerEmail.trim();
    const trimmedPhone = buyerPhone.replace(/\D/g, '');

    if (trimmedName.length < 3) {
      setFormError('Por favor ingresa tu nombre y apellido completo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Ingresa un correo electrónico válido para vincular tu entrada.');
      return;
    }

    if (existingEnrollmentForEmail) {
      setFormError(
        `El correo ${trimmedEmail} ya cuenta con un boleto registrado para este curso. Solo se permite 1 boleto personal por cuenta.`
      );
      return;
    }

    if (trimmedPhone.length < 8) {
      setFormError('Ingresa un número de teléfono válido (mínimo 8 dígitos).');
      return;
    }

    if (remainingSpots <= 0) {
      setFormError('Lo sentimos, los lugares para este curso se han agotado.');
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(100 + Math.random() * 900);
    const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const accessCode = `NAHO-${codeSuffix}-${randomNum}`;

    // Sanitización exhaustiva contra XSS / inyecciones
    const sanitizedName = sanitizeText(trimmedName, 100);
    const sanitizedEmail = sanitizeText(trimmedEmail, 100);
    const sanitizedPhone = sanitizeText(buyerPhone.trim(), 20);

    const enrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      folio: `#CURSO-${randomNum}`,
      accessCode,
      courseId: course.id,
      courseTitle: course.title,
      courseDateDisplay: course.eventDateDisplay,
      courseTimeDisplay: course.eventTimeDisplay,
      meetingLink: course.meetingLink,
      platformName: course.platformName,
      buyerName: sanitizedName,
      buyerEmail: sanitizedEmail,
      buyerPhone: sanitizedPhone,
      ticketsCount: 1,
      totalPaid: course.price,
      paymentMethod,
      purchasedAt: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      emailSentToBuyer: true,
      emailSentToNaho: true,
    };

    recordSubmission('enrollment');
    registerCourseEnrollment(enrollment);
    setCompletedEnrollment(enrollment);
    setIsSubmitting(false);

    // Despacho directo a través del servicio de correos oficial
    sendStudentTicketEmail({
      buyerName: enrollment.buyerName,
      buyerEmail: enrollment.buyerEmail,
      buyerPhone: enrollment.buyerPhone,
      accessCode: enrollment.accessCode,
      folio: enrollment.folio,
      courseTitle: course.title,
      courseSubtitle: course.subtitle,
      eventDateDisplay: course.eventDateDisplay,
      eventTimeDisplay: course.eventTimeDisplay,
      meetingLink: course.meetingLink,
      totalPaid: course.price,
      paymentMethod,
    }).catch(console.error);

    sendStudioEnrollmentNotification({
      buyerName: enrollment.buyerName,
      buyerEmail: enrollment.buyerEmail,
      buyerPhone: enrollment.buyerPhone,
      accessCode: enrollment.accessCode,
      folio: enrollment.folio,
      courseTitle: course.title,
      eventDateDisplay: course.eventDateDisplay,
      eventTimeDisplay: course.eventTimeDisplay,
      totalPaid: course.price,
      paymentMethod,
      purchasedAt: enrollment.purchasedAt,
    }).catch(console.error);

    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#FE3770', '#FC6408', '#FCDD1D', '#23B3F4', '#B0DC07'],
      });
    } catch {
      // ignore confetti error
    }
  };

  const handleOpenGoogleCalendar = () => {
    if (!completedEnrollment) return;
    const { start, end } = buildCalendarDates(course.eventDate, course.eventTimeDisplay);
    const details = `Curso en vivo con Nahomy (${siteConfig.studioName}).\nFolio: ${completedEnrollment.folio}\nCódigo de Acceso Personal: ${completedEnrollment.accessCode}\nEnlace de sesión: ${completedEnrollment.meetingLink}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Nahocraft: ${course.title}`
    )}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      course.modality === 'presencial' ? siteConfig.studioAddress : completedEnrollment.meetingLink
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    if (!completedEnrollment) return;
    const { start, end } = buildCalendarDates(course.eventDate, course.eventTimeDisplay);
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nahocraft Centro de Arte//Cursos//ES',
      'BEGIN:VEVENT',
      `UID:${completedEnrollment.id}@nahocraft.com`,
      `DTSTAMP:${start}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:Nahocraft: ${course.title}`,
      `DESCRIPTION:Folio: ${completedEnrollment.folio} | Código: ${completedEnrollment.accessCode} | Acceso: ${completedEnrollment.meetingLink}`,
      `LOCATION:${course.modality === 'presencial' ? siteConfig.studioAddress : completedEnrollment.meetingLink}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Calendario-${completedEnrollment.folio.replace('#', '')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadTicketPass = () => {
    if (!completedEnrollment) return;
    const htmlPass = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Pase Oficial ${completedEnrollment.folio} - Nahocraft</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #F5F2EB; color: #181B20; padding: 40px 20px; }
    .ticket { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.08); }
    .header { background: #181B20; color: #fff; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #FE3770; }
    .body { padding: 32px; }
    .badge { display: inline-block; background: #FE3770; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.1em; }
    .code-box { background: #FBFBFA; border: 2px dashed #181B20; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
    .code { font-family: monospace; font-size: 26px; font-weight: 900; color: #FE3770; letter-spacing: 0.12em; margin-top: 6px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .label { color: #666; font-weight: 600; }
    .val { font-weight: 700; color: #111; text-align: right; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div>
        <div class="badge">Boleto Personal Confirmado</div>
        <h1 style="margin: 10px 0 0; font-size: 22px;">Nahocraft • Centro de Arte</h1>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 15px; opacity: 0.9;">
        ${completedEnrollment.folio}
      </div>
    </div>
    <div class="body">
      <h2 style="margin-top: 0; font-size: 20px;">${completedEnrollment.courseTitle}</h2>
      <div class="code-box">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #666; font-weight: 700;">Código Único de Acceso a Clase</div>
        <div class="code">${completedEnrollment.accessCode}</div>
      </div>
      <div class="row"><span class="label">Alumno(a):</span><span class="val">${completedEnrollment.buyerName}</span></div>
      <div class="row"><span class="label">Correo Vinculado:</span><span class="val">${completedEnrollment.buyerEmail}</span></div>
      <div class="row"><span class="label">Fecha:</span><span class="val">${completedEnrollment.courseDateDisplay}</span></div>
      <div class="row"><span class="label">Horario:</span><span class="val">${completedEnrollment.courseTimeDisplay}</span></div>
      <div class="row"><span class="label">Modalidad / Sala:</span><span class="val">${completedEnrollment.platformName}</span></div>
      <div class="row"><span class="label">Enlace Directo:</span><span class="val">${completedEnrollment.meetingLink}</span></div>
      <div class="row"><span class="label">Total Pagado:</span><span class="val">$${completedEnrollment.totalPaid.toLocaleString('es-MX')} MXN</span></div>
      <p style="font-size: 12px; color: #777; text-align: center; margin-top: 24px;">
        Conserva este pase. Puedes usar tu código <strong>${completedEnrollment.accessCode}</strong> en la sección de Cursos de nahocraft.com para entrar a tu sesión.
      </p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlPass], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Pase-${completedEnrollment.folio.replace('#', '')}-${completedEnrollment.accessCode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const modalityLabel =
    course.modality === 'presencial'
      ? 'Presencial en Taller'
      : course.modality === 'hibrido'
        ? 'Modalidad Híbrida'
        : 'En Línea en Vivo';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${completedEnrollment ? 'max-w-2xl' : 'max-w-4xl'
          } rounded-[2.5rem] bg-white text-neutral-900 shadow-[0_32px_90px_rgba(0,0,0,0.45)] border border-black/[0.08] overflow-hidden max-h-[92vh] flex flex-col transition-all`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          {!completedEnrollment ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
              {/* Left Column: Course Visual & Single-Ticket Info */}
              <div className="lg:col-span-5 bg-neutral-950 text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-naho-pink/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-naho-blue/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Course Thumbnail & Category */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-naho-pink text-white font-bold text-[10px] uppercase tracking-wider">
                        {course.monthLabel}
                      </span>
                      <span className="font-mono text-[11px] text-white/90 font-semibold">
                        Quedan {remainingSpots} lugares
                      </span>
                    </div>
                  </div>

                  {/* Course Title & Schedule */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-naho-pink font-bold block">
                      Inscripción • {modalityLabel}
                    </span>
                    <h2
                      id={titleId}
                      className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white"
                    >
                      {course.title}
                    </h2>

                    <div className="space-y-2 pt-1 text-xs text-neutral-300">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-naho-pink shrink-0" />
                        <span>{course.eventDateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-naho-orange shrink-0" />
                        <span>{course.eventTimeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Video className="w-4 h-4 text-naho-blue shrink-0" />
                        <span>{course.platformName}</span>
                      </div>
                      {course.level && (
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Nivel: {course.level}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Ticket Notice */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Entrada Personal (1 por cuenta)</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Tu boleto es individual y quedará vinculado directamente al correo electrónico que registres para enviarte ahí tu código de acceso e indicaciones.
                    </p>
                  </div>
                </div>

                {/* Bottom Price Summary */}
                <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Inversión del Curso
                    </span>
                    <span className="text-xs text-neutral-300 font-medium">
                      1 Boleto Personal
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white tracking-tight">
                      ${course.price.toLocaleString('es-MX')}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 ml-1">MXN</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Registration & Payment Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6 bg-white relative"
              >
                {/* Honeypot invisible para protección contra bots */}
                <div className="opacity-0 absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
                  <label htmlFor="course-reg-hp">No llenar</label>
                  <input
                    id="course-reg-hp"
                    type="text"
                    name="reg_security_check"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-bold mb-2">
                      <UserCheck className="w-3.5 h-3.5 text-naho-pink" />
                      Registro de Alumno(a)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                      Completa tu inscripción
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Ingresa tus datos para enviarte a tu correo toda la información y tu pase personal.
                    </p>
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor={nameId}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        id={nameId}
                        name="buyerName"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Ej. Valeria Salazar"
                        value={buyerName}
                        onChange={(e) => {
                          setBuyerName(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Bound Email Account */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={emailId}
                          className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
                        >
                          Correo Electrónico *
                        </label>
                        <span className="text-[10px] font-bold text-naho-pink flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Aquí recibirás toda la información
                        </span>
                      </div>
                      <input
                        id={emailId}
                        name="buyerEmail"
                        type="email"
                        required
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="tucorreo@ejemplo.com"
                        value={buyerEmail}
                        onChange={(e) => {
                          setBuyerEmail(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                      <p className="text-[11px] text-neutral-500 mt-1.5">
                        Tu entrada quedará ligada a este correo para que solo tú puedas acceder a la clase.
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor={phoneId}
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                      >
                        Número de Teléfono (10 dígitos) *
                      </label>
                      <input
                        id={phoneId}
                        name="buyerPhone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="833 123 4567"
                        value={buyerPhone}
                        onChange={(e) => {
                          setBuyerPhone(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <fieldset className="space-y-2.5 pt-1">
                    <legend className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Método de Pago
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'tarjeta' as const,
                          label: 'Tarjeta Bancaria',
                          desc: 'Crédito o Débito',
                        },
                        {
                          id: 'transferencia' as const,
                          label: 'Transferencia SPEI',
                          desc: 'Validación inmediata',
                        },
                        {
                          id: 'oxxo_spei' as const,
                          label: 'Pago Digital',
                          desc: 'Pasarela en línea',
                        },
                      ].map((opt) => {
                        const selected = paymentMethod === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${selected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                              : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 text-neutral-800'
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold">{opt.label}</span>
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selected ? 'border-naho-pink bg-naho-pink' : 'border-neutral-400'
                                  }`}
                              >
                                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] mt-1 ${selected ? 'text-neutral-300' : 'text-neutral-500'
                                }`}
                            >
                              {opt.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>

                {/* Submit Footer */}
                <div className="pt-5 border-t border-neutral-100 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-neutral-950 hover:bg-naho-pink disabled:bg-neutral-400 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Comprar Boleto (${course.price.toLocaleString('es-MX')} MXN)
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Al confirmar te enviaremos toda la información del curso por correo electrónico.
                    </span>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Post-Purchase View: Digital Ticket Pass + Calendar Actions */
            <div className="p-7 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-naho-pink/10 text-naho-pink text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Inscripción Confirmada • {completedEnrollment.folio}
                </span>

                <h3
                  id={titleId}
                  className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight"
                >
                  ¡Muchas gracias por inscribirte, {completedEnrollment.buyerName}!
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
                  Hemos enviado tu confirmación a{' '}
                  <strong className="text-neutral-900">{completedEnrollment.buyerEmail}</strong>.
                  Aquí tienes tu código personal de acceso y las opciones para descargar tu boleto o agendar la clase en tu calendario.
                </p>
              </div>

              {/* Digital Pass Code Box */}
              <div className="p-5 rounded-3xl bg-neutral-950 text-white border border-black/10 space-y-3 text-left relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-naho-pink font-bold block">
                      Código Personal de Acceso a Clase
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-white">
                      {completedEnrollment.accessCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(completedEnrollment.accessCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2500);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-naho-pink" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Curso Registrado
                    </span>
                    <p className="font-bold text-white mt-0.5">
                      {completedEnrollment.courseTitle}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Fecha y Horario
                    </span>
                    <p className="font-semibold text-naho-yellow font-mono mt-0.5">
                      {completedEnrollment.courseDateDisplay} • {completedEnrollment.courseTimeDisplay}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Download Pass & Add to Calendar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadTicketPass}
                  className="py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-naho-pink shrink-0" />
                  <span>Descargar Boleto</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenGoogleCalendar}
                  className="py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4 text-naho-blue shrink-0" />
                  <span>Google Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-naho-orange shrink-0" />
                  <span>Calendario Apple/ICS</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-naho-pink text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Entendido, volver a los cursos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
