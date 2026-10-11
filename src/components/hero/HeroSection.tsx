import { localAssets } from '../../assets';
import { ScheduleStatusBadge } from '../layout/ScheduleStatusBadge';
import { ArrowRight, Sparkles, Palette, Shirt, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic chromatic ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-naho-pink/[0.12] via-naho-yellow/[0.1] to-naho-blue/[0.12] blur-3xl rounded-full -z-10 pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top pill badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold bg-white/90 border border-black/[0.08] shadow-2xs text-neutral-900 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-naho-pink to-naho-orange animate-pulse" />
                Estudio Creativo de Nahomy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-naho-pink/[0.08] text-naho-pink border border-naho-pink/20">
                <Sparkles className="w-3.5 h-3.5" />
                100% Pintado a Mano
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium bg-black/[0.03] text-neutral-600 border border-black/[0.05]">
                <MapPin className="w-3 h-3 text-neutral-500" />
                Tampico, Tamps.
              </span>
            </div>

            {/* Main Headline with Animated Gradient Flow */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-900 tracking-[-0.035em] leading-[1.06] mb-6">
              El arte que transforma tus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange via-naho-purple to-naho-blue animate-gradient-flow">
                espacios y tu estilo.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 mb-9 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Muralismo de gran escala, prendas de autor pintadas a mano y totebags artesanales en Tampico. Cada obra es concebida con maestría artística y pasión por Nahomy.
            </p>

            {/* Disciplines Bento Chips with Creative Glows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-9 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="apple-card rounded-2xl p-4 flex items-start gap-3.5 glow-mural transition-all">
                <div className="p-2.5 rounded-xl bg-naho-pink/10 text-naho-pink shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">Muralismo</h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">Comercial & Casa</p>
                </div>
              </div>

              <div className="apple-card rounded-2xl p-4 flex items-start gap-3.5 glow-ropa transition-all">
                <div className="p-2.5 rounded-xl bg-naho-blue/10 text-naho-blue shrink-0">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">Diseño Textil</h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">Custom Denim Art</p>
                </div>
              </div>

              <div className="apple-card rounded-2xl p-4 flex items-start gap-3.5 glow-totebag transition-all">
                <div className="p-2.5 rounded-xl bg-naho-green/15 text-lime-700 shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-neutral-900 leading-tight">Totebags</h2>
                  <p className="text-[12px] text-neutral-500 mt-0.5">Lienzo 100% Algodón</p>
                </div>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-9">
              <a
                href="#cotizador"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-neutral-950 text-white font-semibold text-sm shadow-md hover:bg-neutral-800 transition-all active:scale-95"
              >
                <span>Cotizar Proyecto a Medida</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </a>

              <a
                href="#galeria"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-800 font-semibold text-sm border border-black/[0.08] shadow-xs hover:bg-neutral-50 transition-all active:scale-95"
              >
                <span>Ver Portafolio de Obras</span>
              </a>
            </div>

            {/* Live studio status badge */}
            <div className="inline-block">
              <ScheduleStatusBadge />
            </div>
          </div>

          {/* Right Column: Visual Art Composition with Living Floating Motion */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main focal card: Mural Dulcería (Floating gently) */}
              <div className="relative z-20 rounded-[2rem] overflow-hidden bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/[0.06] animate-float-slow hover:pause">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100">
                  <img
                    src={localAssets.murales.dulceria}
                    alt="Mural Comercial Dulcería por Nahomy Nahocraft"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 apple-glass px-3 py-1 rounded-full text-[11px] font-bold text-neutral-800 flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-naho-pink animate-ping"></span>
                    Mural Comercial Real
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="font-extrabold text-neutral-900 text-base tracking-tight">Mural Dulcería Típica</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Gran formato e ilustración comercial en Tampico</p>
                </div>
              </div>

              {/* Floating secondary card 1: Chamarra Taylor (Delayed float) */}
              <div className="absolute -top-6 -right-4 sm:-right-6 z-30 w-44 sm:w-52 rounded-2xl overflow-hidden bg-white p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.12)] border border-black/[0.06] animate-float-delayed">
                <div className="rounded-xl overflow-hidden aspect-square bg-neutral-100">
                  <img
                    src={localAssets.ropa.taylor}
                    alt="Chamarra Eras Tour Pintada a Mano"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-[11px] font-bold text-naho-blue block">Custom Denim Art</span>
                  <span className="text-[10px] text-neutral-400">Intervención Textil</span>
                </div>
              </div>

              {/* Floating secondary card 2: Totebag Cenicienta (Reverse float) */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 z-30 w-40 sm:w-48 rounded-2xl overflow-hidden bg-white p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.12)] border border-black/[0.06] animate-float-reverse">
                <div className="rounded-xl overflow-hidden aspect-square bg-neutral-100">
                  <img
                    src={localAssets.totebags.cenicienta}
                    alt="Totebag Lienzo de Algodón Pintada a Mano"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-[11px] font-bold text-naho-pink block">Totebag de Autor</span>
                  <span className="text-[10px] text-neutral-400">100% Algodón</span>
                </div>
              </div>

              {/* Circular Logo Badge Seal with slow hypnotic spin */}
              <div className="absolute -bottom-8 right-6 z-40 bg-white rounded-full p-1.5 shadow-2xl border border-black/[0.06] animate-spin-slow">
                <img
                  src={localAssets.logo}
                  alt="Sello Oficial Nahocraft"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Satisfaction guarantee badge */}
            <div className="mt-14 lg:mt-10 flex items-center justify-center gap-5 text-[12px] text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Pinturas indelebles
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Piezas de autor
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Atención directa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
