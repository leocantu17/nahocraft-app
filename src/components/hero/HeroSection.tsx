import { localAssets } from '../../assets';
import { useSiteData } from '../../context/SiteDataContext';
import { ScheduleStatusBadge } from '../layout/ScheduleStatusBadge';
import {
  ArrowRight,
  Sparkles,
  Palette,
  Video,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export function HeroSection() {
  const { siteConfig, courses } = useSiteData();
  const featuredCourse = courses.find((c) => c.featured && c.active) || courses[0];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-naho-pink/[0.12] via-naho-yellow/[0.1] to-naho-blue/[0.12] blur-3xl rounded-full -z-10 pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="animate-hero-1 inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold bg-white/90 border border-black/[0.08] shadow-2xs text-neutral-900 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-naho-pink to-naho-orange animate-pulse" />
                {siteConfig.heroBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-naho-pink/[0.08] text-naho-pink border border-naho-pink/20">
                <Sparkles className="w-3.5 h-3.5" />
                Cursos Mensuales & Muralismo
              </span>
            </div>

            <h1 className="animate-hero-2 text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-900 tracking-[-0.035em] leading-[1.06] mb-6">
              {siteConfig.heroTitleLine1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange via-naho-purple to-naho-blue animate-gradient-flow">
                {siteConfig.heroTitleHighlight}
              </span>
            </h1>

            <p className="animate-hero-3 text-lg sm:text-xl text-neutral-600 mb-9 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {siteConfig.heroDescription}
            </p>

            {/* 3 Core Pillars Bento Chips */}
            <div className="animate-hero-4 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-9 max-w-2xl mx-auto lg:mx-0 text-left">
              <a
                href="#cursos"
                className="apple-card pillar-card-hover rounded-2xl p-4 flex items-start gap-3.5 glow-mural transition-all"
              >
                <div className="pillar-icon p-2.5 rounded-xl bg-naho-pink/10 text-naho-pink shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">
                    Cursos del Mes
                  </h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Cupo limitado + Link en vivo
                  </p>
                </div>
              </a>

              <a
                href="#galeria"
                className="apple-card pillar-card-hover rounded-2xl p-4 flex items-start gap-3.5 glow-mural-blue transition-all"
              >
                <div className="pillar-icon p-2.5 rounded-xl bg-naho-blue/10 text-naho-blue shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">
                    Murales a Medida
                  </h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Tampico, Madero y Altamira
                  </p>
                </div>
              </a>

              <a
                href="#estudio"
                className="apple-card pillar-card-hover rounded-2xl p-4 flex items-start gap-3.5 glow-mural-green transition-all"
              >
                <div className="pillar-icon p-2.5 rounded-xl bg-naho-green/15 text-lime-700 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">
                    Taller Físico
                  </h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Niños, Jóvenes y Adultos
                  </p>
                </div>
              </a>
            </div>

            {/* Call to action buttons */}
            <div className="animate-hero-5 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-9">
              <a
                href="#cursos"
                className="btn-shimmer group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-neutral-950 text-white font-semibold text-sm shadow-md hover:bg-naho-pink transition-all active:scale-95"
              >
                <span>Ver Cursos e Inscribirme</span>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#cotizador"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-800 font-semibold text-sm border border-black/[0.08] shadow-xs hover:bg-neutral-50 transition-all active:scale-95"
              >
                <span>Pedir mi Propio Mural</span>
              </a>
            </div>

            <div className="animate-hero-5 inline-block">
              <ScheduleStatusBadge />
            </div>
          </div>

          {/* Right Column: Visual Composition featuring Mural + Featured Course Card */}
          <div className="lg:col-span-5 relative animate-hero-visual">
            <div className="relative mx-auto max-w-md lg:max-w-none sm:pb-12">
              {/* Main Focal Card: Muralismo */}
              <div className="relative z-20 rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-white p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/[0.06] sm:animate-float-slow">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100">
                  <img
                    src={localAssets.murales.dulceria}
                    alt="Mural Comercial por Nahomy Nahocraft"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 apple-glass px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-neutral-800 flex items-center gap-1.5 shadow-xs max-w-[calc(100%-4rem)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-naho-pink animate-ping shrink-0" />
                    <span className="truncate">Murales en Tampico, Madero y Altamira</span>
                  </div>

                  {/* Circular Logo Badge Seal inside image corner on mobile, floating top-left on sm+ */}
                  <div className="absolute top-2.5 right-2.5 sm:hidden z-30 bg-white/95 rounded-full p-1 shadow-md border border-black/[0.06]">
                    <img
                      src={localAssets.logo}
                      alt="Sello Oficial Nahocraft"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold text-neutral-900 text-sm sm:text-base tracking-tight">
                      Muralismo Comercial & Casa
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Diseños 100% pintados a mano por Nahomy
                    </p>
                  </div>
                  <a
                    href="#cotizador"
                    className="px-3.5 py-2 sm:py-1.5 rounded-full bg-neutral-950 hover:bg-naho-pink transition-colors text-white text-xs sm:text-[11px] font-bold shrink-0"
                  >
                    Cotizar
                  </a>
                </div>
              </div>

              {/* Mobile Stacked Cards / Desktop Floating Collage */}
              <div className="mt-3.5 grid grid-cols-1 gap-3 sm:mt-0 sm:block">
                {/* Card 1: Próximo Curso Destacado */}
                {featuredCourse && (
                  <a
                    href="#cursos"
                    className="relative sm:absolute sm:-top-7 sm:-right-4 lg:-right-6 z-30 w-full sm:w-64 rounded-2xl overflow-hidden bg-neutral-950 text-white p-4 shadow-[0_16px_36px_rgba(0,0,0,0.22)] border border-white/15 sm:animate-float-delayed block"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-naho-pink font-bold">
                        <Calendar className="w-3 h-3" />
                        Próximo Curso
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-emerald-300">
                        {Math.max(0, featuredCourse.maxSpots - featuredCourse.enrolledCount)} lugares libres
                      </span>
                    </div>
                    <p className="font-extrabold text-sm leading-snug line-clamp-2">
                      {featuredCourse.title}
                    </p>
                    <p className="text-[11px] text-naho-yellow font-mono mt-1.5">
                      {featuredCourse.eventDateDisplay} • ${featuredCourse.price} MXN
                    </p>
                  </a>
                )}

                {/* Card 2: Mural Botánico (Compact horizontal row on mobile, floating card on sm+) */}
                <div className="relative sm:absolute sm:-bottom-4 sm:-left-5 z-30 w-full sm:w-48 rounded-2xl overflow-hidden bg-white p-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-black/[0.06] sm:animate-float-reverse flex sm:block items-center gap-3">
                  <div className="w-20 sm:w-full rounded-xl overflow-hidden aspect-[16/10] bg-neutral-100 shrink-0">
                    <img
                      src={localAssets.murales.hojas}
                      alt="Mural Botánico Decorativo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="py-0.5 sm:p-1.5 text-left sm:text-center min-w-0">
                    <span className="text-xs sm:text-[11px] font-bold text-naho-pink block">
                      Murales & Cursos
                    </span>
                    <span className="text-[11px] sm:text-[10px] text-neutral-500 block">
                      Online y en Taller Físico
                    </span>
                  </div>
                </div>
              </div>

              {/* Circular Logo Badge Seal (Desktop / Tablet floating badge) */}
              <div className="hidden sm:block absolute -bottom-2 right-4 z-30 bg-white rounded-full p-1.5 shadow-2xl border border-black/[0.06] animate-spin-slow">
                <img
                  src={localAssets.logo}
                  alt="Sello Oficial Nahocraft"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Link de clase inmediato por correo
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-naho-pink shrink-0" />
                Murales en Tampico, Madero y Altamira
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
