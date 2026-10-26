import React, { useState, useEffect, useId } from 'react';
import { CourseItem, CourseEnrollment } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import confetti from 'canvas-confetti';
import { sendStudentTicketEmail, sendStudioEnrollmentNotification } from '../../emails';
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
} from 'lucide-react';

interface CourseCheckoutModalProps {
  course: CourseItem | null;
  onClose: () => void;
}

export function CourseCheckoutModal({ course, onClose }: CourseCheckoutModalProps) {
  const { registerCourseEnrollment, courseEnrollments } = useSiteData();
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
      buyerName: trimmedName,
      buyerEmail: trimmedEmail,
      buyerPhone: buyerPhone.trim(),
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
        className={`relative w-full ${
          completedEnrollment ? 'max-w-xl' : 'max-w-4xl'
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
                      Inscripción al Curso
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
                        <span>Sesión en vivo ({course.platformName})</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Ticket Notice */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Entrada Personal (1 por cuenta)</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Tu boleto es individual y quedará vinculado directamente al correo electrónico que registres para enviarte ahí el acceso e indicaciones del curso.
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
                className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6 bg-white"
              >
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
                      Ingresa tus datos para enviarte a tu correo toda la información y el acceso al curso.
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
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              selected
                                ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                                : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold">{opt.label}</span>
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  selected ? 'border-naho-pink bg-naho-pink' : 'border-neutral-400'
                                }`}
                              >
                                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] mt-1 ${
                                selected ? 'text-neutral-300' : 'text-neutral-500'
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
            /* Post-Purchase View: Simple, Warm Confirmation ("Gracias por inscribirte al curso") */
            <div className="p-8 sm:p-11 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-naho-pink/10 text-naho-pink text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Inscripción Confirmada
                </span>

                <h3
                  id={titleId}
                  className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight"
                >
                  ¡Muchas gracias por inscribirte al curso, {completedEnrollment.buyerName}!
                </h3>

                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Tu lugar ha quedado registrado con éxito. En unos momentos recibirás un correo electrónico en{' '}
                  <strong className="text-neutral-900">{completedEnrollment.buyerEmail}</strong>{' '}
                  donde vendrá toda la información detallada del curso, las indicaciones previas y tu enlace personal para conectarte el día de la clase.
                </p>
              </div>

              {/* Clean Course Info Summary */}
              <div className="p-5 rounded-3xl bg-neutral-50 border border-black/[0.06] text-left space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Curso Registrado
                  </span>
                  <p className="font-extrabold text-sm sm:text-base text-neutral-900 mt-0.5">
                    {completedEnrollment.courseTitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/[0.05] text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Fecha y Horario
                    </span>
                    <p className="font-semibold text-neutral-800 mt-0.5">
                      {completedEnrollment.courseDateDisplay} • {completedEnrollment.courseTimeDisplay}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Información enviada a
                    </span>
                    <p className="font-mono font-semibold text-naho-pink truncate mt-0.5">
                      {completedEnrollment.buyerEmail}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                Recuerda revisar tu bandeja de entrada (o carpeta de promociones/spam) antes de la fecha del curso.
              </p>

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
