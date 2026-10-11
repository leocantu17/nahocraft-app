import { useState } from 'react';
import { ScheduleCard } from './ScheduleCard';
import { SocialLinks } from './SocialLinks';
import { MapPin, Navigation, ExternalLink, Copy, Check, Compass, Sparkles } from 'lucide-react';

export function StudioLocation() {
  const [copied, setCopied] = useState(false);

  const addressText = 'Avenida Ayuntamiento 3 - 109, Minerva, 89120 Tampico, Tamps., México';
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/[0.03] text-neutral-600 border border-black/[0.06] mb-4">
            <Compass className="w-3.5 h-3.5 text-neutral-800" />
            Visítanos en Tampico
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em]">
            El Taller &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-blue via-naho-purple to-naho-pink">
              Centro de Arte
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
            El espacio de creación donde cobran vida las ideas. Ven a conocer las muestras de materiales, consultar tus diseños en persona o recoger piezas de indumentaria.
          </p>
        </div>

        {/* 2-Column Grid: Location Card & Schedule Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
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

              {/* Address block */}
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
                    22.249666, -97.867119
                  </span>
                </div>
              </div>

              {/* Map Buttons: Apple Maps and Google Maps */}
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

              {/* Stylized Interactive Map Preview Card (Apple Dark Maps aesthetic) */}
              <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-neutral-900 p-6 text-white min-h-[170px] flex flex-col justify-between shadow-xs">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.4) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.4) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                  }}
                />

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
                  <p className="text-base font-extrabold tracking-tight">
                    Nahocraft Centro de Arte
                  </p>
                  <p className="text-xs text-neutral-400">
                    Avenida Ayuntamiento 3 - 109, Minerva
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400">
                  <span>Acceso rápido desde Av. Hidalgo</span>
                  <a
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    Navegar con Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Community & Socials */}
            <div className="apple-card rounded-[2.5rem] p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-naho-pink" />
                <h4 className="font-extrabold text-lg text-neutral-900 tracking-tight">
                  Canales Oficiales
                </h4>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Sigue las obras en proceso, tutoriales y anuncios de colecciones.
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
