import { useSiteData } from '../../context/SiteDataContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import {
  Home,
  Palette,
  Sparkles,
  Ticket,
  Calculator,
  MapPin,
  Heart,
  MessageCircle,
  Mail,
  ArrowRight,
  Compass,
} from 'lucide-react';

export function NotFoundPage() {
  const { navigateTo, siteConfig } = useSiteData();

  const exploreRoutes = [
    {
      title: 'Galería de Murales',
      desc: 'Explora obras para negocios, fachadas y hogares en Tampico, Madero y Altamira.',
      icon: Palette,
      color: 'text-naho-pink bg-naho-pink/10 border-naho-pink/20',
      hash: 'galeria',
    },
    {
      title: 'Cursos & Masterclasses',
      desc: 'Inscríbete a los talleres del mes en vivo por Google Meet o en el taller.',
      icon: Ticket,
      color: 'text-naho-orange bg-naho-orange/10 border-naho-orange/20',
      hash: 'cursos',
    },
    {
      title: 'Cotizador de Murales',
      desc: 'Calcula tu proyecto personalizado y recibe propuesta visual en 24-48 hrs.',
      icon: Calculator,
      color: 'text-naho-blue bg-naho-blue/10 border-naho-blue/20',
      hash: 'cotizador',
    },
    {
      title: 'El Estudio & Clases',
      desc: 'Conoce nuestro espacio físico en Tampico, horarios y clases presenciales.',
      icon: MapPin,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      hash: 'estudio',
    },
    {
      title: 'Sobre Nahomy',
      desc: 'Conoce a la artista fundadora, su visión, trayectoria y proceso creativo.',
      icon: Heart,
      color: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      hash: 'sobre-mi',
    },
  ];

  return (
    <div className="min-h-screen bg-naho-bg text-slate-800 flex flex-col selection:bg-naho-pink selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center space-y-10">
          
          {/* Artistic Easel & Canvas Visual */}
          <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Background glowing palette orbs */}
            <div className="absolute -top-4 -left-6 w-32 h-32 rounded-full bg-naho-pink/20 blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -right-4 w-36 h-36 rounded-full bg-naho-blue/20 blur-2xl animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-naho-yellow/20 blur-3xl" />

            {/* Canvas Illustration */}
            <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] bg-white border-2 border-stone-200 shadow-2xl p-4 flex flex-col items-center justify-between rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              {/* Canvas header tape */}
              <div className="w-16 h-4 bg-amber-100/80 rounded-sm -mt-6 border border-amber-200/60 shadow-xs" />
              
              {/* Painted 404 Canvas Art */}
              <div className="w-full flex-1 rounded-2xl bg-stone-50/80 border border-stone-200/60 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
                  Obra #404
                </span>
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 font-serif">
                  4<span className="text-naho-pink">0</span>4
                </span>
                
                {/* Decorative brush stroke line */}
                <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-naho-pink via-naho-orange to-naho-yellow mt-2" />
                
                <span className="text-[11px] text-neutral-500 font-medium mt-2 italic">
                  Lienzo en preparación
                </span>

                {/* Floating paint dots */}
                <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-naho-pink animate-ping" />
                <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-naho-blue" />
                <span className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-naho-yellow" />
              </div>

              {/* Wooden easel base indicator */}
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                <Sparkles className="w-3 h-3 text-naho-pink" />
                <span>Nahocraft Centro de Arte</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-2 -left-2 sm:-left-4 z-20 bg-neutral-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5 rotate-[4deg]">
              <Compass className="w-3.5 h-3.5 text-naho-yellow" />
              <span>Ruta sin trazar</span>
            </div>
          </div>

          {/* Text Message */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-naho-pink/10 text-naho-pink text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Error 404 • Lienzo sin pintar
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              Esta obra aún no ha sido trazada
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              La dirección que buscas no existe, cambió de lugar o está esperando la primera pincelada de Nahomy. 
              Pero en nuestro estudio de arte siempre hay inspiración y nuevos proyectos por descubrir.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="px-7 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4 text-naho-yellow" />
              <span>Volver a la Página Principal</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/', 'galeria')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-sm border border-neutral-200/80 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Palette className="w-4 h-4 text-naho-pink" />
              <span>Ver Galería de Murales</span>
            </button>
          </div>

          {/* Explore Sections Grid */}
          <div className="pt-8 border-t border-black/[0.06] text-left">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                Otras secciones del estudio:
              </span>
              <span className="text-xs text-neutral-400">
                Selecciona una para ir directo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {exploreRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.title}
                    type="button"
                    onClick={() => navigateTo('/', route.hash)}
                    className="p-4 rounded-2xl bg-white border border-black/[0.05] hover:border-black/[0.15] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${route.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h2 className="text-sm font-extrabold text-neutral-900 group-hover:text-naho-pink transition-colors">
                        {route.title}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {route.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Need help? Contact Box */}
          <div className="p-6 sm:p-7 rounded-3xl bg-neutral-950 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-naho-yellow font-bold block">
                ¿Buscabas algo en particular?
              </span>
              <h2 className="text-lg font-bold text-white">
                Contáctanos directamente en el estudio de Tampico
              </h2>
              <p className="text-xs text-neutral-400 max-w-lg">
                Si tienes dudas sobre tu inscripción de curso, un folio de cotización o quieres platicar con Nahomy, estamos a un mensaje de distancia.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <a
                href={`https://wa.me/528333655622?text=${encodeURIComponent(
                  'Hola Nahomy! Estaba navegando en nahocraft.com y me gustaría hacerte una consulta directa.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp (+52 833 365 5622)</span>
              </a>

              <a
                href={`mailto:${siteConfig.adminEmail || 'Centrodearte@nahocraft.com'}`}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
              >
                <Mail className="w-4 h-4 text-naho-pink" />
                <span>{siteConfig.adminEmail || 'Centrodearte@nahocraft.com'}</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
