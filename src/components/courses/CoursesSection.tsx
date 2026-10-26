import { useState, useEffect, useMemo } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { CourseItem } from '../../types';
import { CourseCheckoutModal } from './CourseCheckoutModal';
import {
  Calendar,
  Users,
  Video,
  Sparkles,
  CheckCircle2,
  Timer,
  Ticket,
  Lock,
  Mail,
} from 'lucide-react';

function getDeadlineStatus(deadlineStr: string, now: Date) {
  const deadline = new Date(deadlineStr);
  if (Number.isNaN(deadline.getTime())) {
    return { isExpired: false, label: 'Registro abierto' };
  }
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { isExpired: true, label: 'Tiempo de inscripción finalizado' };
  }
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return {
      isExpired: false,
      label: `Cierra en ${days}d ${hours}h ${minutes}m`,
    };
  }
  return {
    isExpired: false,
    label: `¡Últimas horas! Cierra en ${hours}h ${minutes}m`,
  };
}

export function CoursesSection() {
  const { courses } = useSiteData();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<CourseItem | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeCourses = useMemo(() => courses.filter((c) => c.active), [courses]);

  const monthTabs = useMemo(() => {
    const uniqueMonths = Array.from(new Set(activeCourses.map((c) => c.monthLabel)));
    return ['all', ...uniqueMonths];
  }, [activeCourses]);

  const filteredCourses = useMemo(() => {
    if (selectedMonth === 'all') return activeCourses;
    return activeCourses.filter((c) => c.monthLabel === selectedMonth);
  }, [activeCourses, selectedMonth]);

  // Keep modal course synced with live store updates
  const liveSelectedCourse = useMemo(() => {
    if (!selectedCourseForCheckout) return null;
    return courses.find((c) => c.id === selectedCourseForCheckout.id) || selectedCourseForCheckout;
  }, [courses, selectedCourseForCheckout]);

  return (
    <section id="cursos" className="py-24 md:py-32 bg-[#FBFBFA] relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-r from-naho-pink/[0.08] via-naho-orange/[0.06] to-naho-blue/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-black/[0.08] text-neutral-900 shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-naho-pink animate-ping" />
            Calendario Mensual de Cursos & Talleres Online
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em]">
            Aprende a Pintar en Vivo con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue">
              Nahomy
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Cada mes abrimos nuevos cursos interactivos con <strong>cupo limitado</strong> y fecha límite de registro. Al inscribirte recibirás en tu correo electrónico toda la información y el acceso personal para conectarte a la clase.
          </p>

          {/* How it works pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-neutral-700">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <Ticket className="w-3.5 h-3.5 text-naho-pink" />
              1. Elige tu curso y adquiere tu entrada personal
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <Mail className="w-3.5 h-3.5 text-naho-orange" />
              2. Recibe toda la información y el link en tu correo
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <Video className="w-3.5 h-3.5 text-naho-blue" />
              3. Conéctate a la sesión en vivo en la fecha indicada
            </span>
          </div>
        </div>

        {/* Month Filter Segmented Control */}
        <div className="flex justify-center mb-12">
          <div
            role="tablist"
            aria-label="Filtrar cursos por mes"
            className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-black/[0.04] border border-black/[0.05]"
          >
            {monthTabs.map((month) => {
              const isSelected = selectedMonth === month;
              return (
                <button
                  key={month}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                  }`}
                >
                  {month === 'all' ? 'Todos los Cursos del Mes' : month}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const remainingSpots = Math.max(0, course.maxSpots - course.enrolledCount);
            const isSoldOut = remainingSpots === 0;
            const deadlineInfo = getDeadlineStatus(course.registrationDeadline, now);
            const isClosed = isSoldOut || deadlineInfo.isExpired;
            const occupancyPercent = Math.min(
              100,
              Math.round((course.enrolledCount / Math.max(1, course.maxSpots)) * 100)
            );

            return (
              <article
                key={course.id}
                className={`apple-card rounded-[2.5rem] overflow-hidden flex flex-col justify-between transition-all duration-500 ${
                  course.featured
                    ? 'ring-2 ring-naho-pink/50 shadow-[0_24px_60px_rgba(254,55,112,0.12)]'
                    : ''
                }`}
              >
                <div>
                  {/* Course Image Header */}
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="apple-glass px-3 py-1 rounded-full text-[11px] font-extrabold text-neutral-900 flex items-center gap-1.5 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-naho-pink" />
                        {course.monthLabel}
                      </span>

                      {course.featured && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-naho-pink text-white shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Destacado del Mes
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay date & time */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white flex items-end justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-naho-yellow font-bold block">
                          Fecha del Curso en Vivo
                        </span>
                        <p className="text-base sm:text-lg font-black tracking-tight leading-tight">
                          {course.eventDateDisplay}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-mono text-[11px] font-semibold">
                        {course.eventTimeDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 sm:p-7 space-y-5">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-naho-blue uppercase tracking-wider mb-1">
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          <span>{course.platformName}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          <Lock className="w-2.5 h-2.5" />
                          1 Boleto / Cuenta
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-neutral-900 tracking-tight leading-snug">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Capacity & Countdown Status Box */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-naho-pink" />
                          {isSoldOut ? (
                            <span className="text-rose-600">¡Cupo Agotado! ({course.maxSpots}/{course.maxSpots})</span>
                          ) : (
                            <span>
                              Quedan <strong className="text-naho-pink">{remainingSpots} lugares</strong> de {course.maxSpots}
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500 font-semibold">
                          {course.enrolledCount}/{course.maxSpots} inscritos
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div
                        className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={course.enrolledCount}
                        aria-valuemin={0}
                        aria-valuemax={course.maxSpots}
                        aria-label={`Lugares ocupados para ${course.title}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSoldOut
                              ? 'bg-rose-500'
                              : remainingSpots <= 4
                              ? 'bg-gradient-to-r from-naho-pink to-naho-orange'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>

                      {/* Time limit countdown */}
                      <div className="flex items-center justify-between pt-1 border-t border-black/[0.05] text-[11px]">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-neutral-700" />
                          Límite de registro:
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            deadlineInfo.isExpired ? 'text-rose-600' : 'text-neutral-800'
                          }`}
                        >
                          {deadlineInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Includes list */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Tu inscripción personal incluye:
                      </span>
                      <ul className="space-y-1.5">
                        {course.includes.map((inc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Buy CTA */}
                <div className="p-6 sm:p-7 pt-4 border-t border-black/[0.06] bg-neutral-50/50 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Entrada personal
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-neutral-950">
                        ${course.price.toLocaleString('es-MX')}
                      </span>
                      <span className="text-xs font-bold text-neutral-500">MXN</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isClosed}
                    onClick={() => setSelectedCourseForCheckout(course)}
                    className={`px-5 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                      isClosed
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : 'bg-neutral-950 hover:bg-naho-pink text-white shadow-md'
                    }`}
                  >
                    {isClosed ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isSoldOut ? 'Cupo Lleno' : 'Registro Cerrado'}</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 text-naho-pink" />
                        <span>Comprar Entrada</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Checkout Modal */}
      {liveSelectedCourse && (
        <CourseCheckoutModal
          course={liveSelectedCourse}
          onClose={() => setSelectedCourseForCheckout(null)}
        />
      )}
    </section>
  );
}
