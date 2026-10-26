import { useState } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { ScheduleCard } from './ScheduleCard';
import { SocialLinks } from './SocialLinks';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Sparkles,
  Users,
  GraduationCap,
  Camera,
  CheckCircle2,
  Mail,
} from 'lucide-react';

export function StudioLocation() {
  const { siteConfig, inPersonClasses, studioPhotos } = useSiteData();
  const [copied, setCopied] = useState(false);

  const addressText = siteConfig.studioAddress;
  const appleMapsUrl =
    'https://maps.apple.com/place?map=hybrid&address=Avenida+Ayuntamiento+3+-+109%2C+Minerva%2C+89120+Tampico%2C+Tamps.%2C+M%C3%A9xico&coordinate=22.249666%2C-97.867119&name=Avenida+Ayuntamiento+3%E2%80%93109';
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=22.249666,-97.867119+(Nahocraft+Centro+de+Arte,+Avenida+Ayuntamiento+3-109,+Minerva,+89120+Tampico)';

  const handleCopy = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="estudio" className="py-24 md:py-32 bg-[#F6F6F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/[0.03] text-neutral-700 border border-black/[0.06] mb-4">
            <Compass className="w-3.5 h-3.5 text-naho-pink" />
            Taller Físico en Tampico • Niños, Adolescentes y Adultos
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em]">
            Nuestro Taller Físico &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-blue via-naho-purple to-naho-pink">
              Clases Presenciales
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Además de nuestros cursos en línea, contamos con nuestro propio estudio físico en la colonia Minerva en Tampico, donde Nahomy imparte clases presenciales para{' '}
            <strong>niños, adolescentes y adultos</strong>.
          </p>
        </div>

        {/* SUB-SECTION 1: Clases Presenciales para Niños, Adolescentes y Adultos */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-naho-pink font-bold">
                <GraduationCap className="w-4 h-4" />
                Modalidad Presencial en Tampico
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                Clases de Arte para Todas las Edades
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              Grupos reducidos con atención personalizada en nuestro taller de Av. Ayuntamiento 3 - 109, Col. Minerva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {inPersonClasses.map((prog, idx) => {
              const accentColors = [
                'from-naho-pink to-naho-orange',
                'from-naho-blue to-naho-purple',
                'from-emerald-500 to-teal-600',
              ];
              const badgeColors = [
                'bg-naho-pink/10 text-naho-pink border-naho-pink/20',
                'bg-naho-blue/10 text-naho-blue border-naho-blue/20',
                'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
              ];

              return (
                <article
                  key={prog.id}
                  className="apple-card rounded-[2.25rem] p-7 flex flex-col justify-between border border-black/[0.06]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                          badgeColors[idx % badgeColors.length]
                        }`}
                      >
                        {prog.audience} • {prog.ageRange}
                      </span>
                      <Users className="w-4 h-4 text-neutral-400" />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xl text-neutral-900 tracking-tight leading-snug">
                        {prog.title}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {prog.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/[0.05] text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Horarios y Sesiones:
                      </span>
                      <span className="font-semibold text-neutral-800">{prog.scheduleSummary}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Lo que practicamos en el taller:
                      </span>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {prog.techniques.map((tech, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {prog.priceInfo}
                    </span>
                    <a
                      href={`mailto:${siteConfig.adminEmail}?subject=${encodeURIComponent(
                        `Informes sobre clases presenciales para ${prog.audience}`
                      )}`}
                      className={`px-4 py-2.5 rounded-full bg-gradient-to-r ${
                        accentColors[idx % accentColors.length]
                      } text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all active:scale-95`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Pedir Informes</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* SUB-SECTION 2: Galería de Fotos del Taller Físico ("Conoce Cómo se Ve el Taller") */}
        {studioPhotos.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-naho-blue font-bold">
                  <Camera className="w-4 h-4" />
                  Galería del Estudio
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                  Conoce Cómo se Ve Nuestro Taller
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
                Un vistazo al lugar donde pintamos, aprendemos y creamos en Tampico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studioPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="apple-card rounded-[2rem] overflow-hidden group border border-black/[0.06]"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3.5 left-3.5 apple-glass px-3 py-1 rounded-full text-[11px] font-bold text-neutral-900">
                      {photo.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-base text-neutral-900 tracking-tight">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-SECTION 3: Ubicación, Mapas y Horarios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Location & Map info */}
          <div id="ubicacion" className="lg:col-span-6 space-y-6">
            <div className="apple-card rounded-[2.5rem] p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-black/[0.04] text-neutral-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-neutral-900 tracking-tight">
                      Ubicación del Taller
                    </h3>
                    <p className="text-xs text-neutral-400">Zona Minerva • Tampico, Tamaulipas</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/[0.06] hover:bg-neutral-100 text-[11px] font-semibold text-neutral-600 transition-all cursor-pointer active:scale-95"
                  title="Copiar dirección al portapapeles"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-black/[0.04] mb-6">
                <p className="text-sm font-semibold text-neutral-900 leading-relaxed">
                  {addressText}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500 font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.06]">
                    Zona Minerva
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.06]">
                    C.P. 89120
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.06]">
                    Clases Presenciales
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Abrir en Apple Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-black/[0.08] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-neutral-900 p-6 text-white min-h-[160px] flex flex-col justify-between shadow-xs">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-naho-pink ring-4 ring-naho-pink/30 animate-pulse"></span>
                    <span className="text-[11px] font-mono tracking-wider text-neutral-400">
                      22.249666, -97.867119
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">Tampico, MX</span>
                </div>

                <div className="relative z-10 my-3">
                  <p className="text-base font-extrabold tracking-tight">{siteConfig.studioName}</p>
                  <p className="text-xs text-neutral-400">{addressText}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400">
                  <span>Acceso rápido desde Av. Hidalgo</span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    Ver ruta en Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="apple-card rounded-[2.5rem] p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-naho-pink" />
                <h4 className="font-extrabold text-lg text-neutral-900 tracking-tight">
                  Redes Sociales Oficiales
                </h4>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Sigue los próximos cursos mensuales, procesos de murales y actividades del taller.
              </p>
              <SocialLinks layout="grid" />
            </div>
          </div>

          {/* Right Column: Schedule Card */}
          <div className="lg:col-span-6">
            <ScheduleCard />
          </div>
        </div>
      </div>
    </section>
  );
}
