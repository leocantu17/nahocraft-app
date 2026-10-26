import { useSiteData } from '../../context/SiteDataContext';
import { Sparkles, Quote, Palette, GraduationCap, MapPin, ArrowUpRight } from 'lucide-react';

export function AboutMeSection() {
  const { aboutMe } = useSiteData();

  return (
    <section id="sobre-mi" className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-black/[0.04]">
      {/* Subtle editorial background accents */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-naho-pink/[0.05] via-naho-orange/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-naho-blue/[0.05] via-naho-purple/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Portrait & Studio Composition (Fernanda Gómez Arte style) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative offset frame */}
              <div className="absolute -inset-3 rounded-[2.75rem] bg-gradient-to-tr from-naho-pink/20 via-naho-orange/15 to-naho-blue/20 blur-xl -z-10" />

              <div className="apple-card-static rounded-[2.5rem] p-3.5 sm:p-4 border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.09)]">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-100">
                  <img
                    src={aboutMe.portraitImage}
                    alt={aboutMe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white mb-2">
                      <Sparkles className="w-3 h-3 text-naho-yellow" />
                      Artista Visual & Muralista
                    </span>
                    <p className="font-extrabold text-lg tracking-tight">
                      {aboutMe.signatureText}
                    </p>
                    <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-naho-pink" />
                      {aboutMe.muralCountLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Studio Seal */}
              {aboutMe.secondaryImage && (
                <div className="absolute -bottom-6 -right-3 sm:-right-5 bg-white rounded-2xl p-2.5 shadow-xl border border-black/[0.08] flex items-center gap-3">
                  <img
                    src={aboutMe.secondaryImage}
                    alt="Sello Nahocraft"
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/10"
                  />
                  <div className="pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-naho-pink font-bold block">
                      Centro de Arte
                    </span>
                    <span className="text-xs font-extrabold text-neutral-900 block">
                      {aboutMe.studentsCountLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Biography, Philosophy Quote & Pillars */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-naho-pink/[0.08] text-naho-pink border border-naho-pink/20 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {aboutMe.badge}
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em] leading-[1.08]">
                {aboutMe.title}
              </h2>
              <p className="text-base sm:text-lg font-semibold text-neutral-500 mt-1.5">
                {aboutMe.subtitle}
              </p>
            </div>

            {/* Philosophy Quote Card (inspired by fernandagomezarte.com "Cada obra nace de una emoción") */}
            <blockquote className="p-6 rounded-3xl bg-neutral-950 text-white relative overflow-hidden shadow-lg">
              <Quote className="w-10 h-10 text-naho-pink/25 absolute top-4 right-5 pointer-events-none" />
              <p className="text-sm sm:text-base font-medium italic leading-relaxed text-neutral-100 relative z-10">
                {aboutMe.philosophyQuote}
              </p>
              <footer className="mt-3 text-[11px] font-mono uppercase tracking-widest text-naho-pink font-bold">
                — Filosofía Creativa • {aboutMe.signatureText}
              </footer>
            </blockquote>

            {/* Bio Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              {aboutMe.bioParagraph1 && <p>{aboutMe.bioParagraph1}</p>}
              {aboutMe.bioParagraph2 && <p>{aboutMe.bioParagraph2}</p>}
              {aboutMe.bioParagraph3 && <p>{aboutMe.bioParagraph3}</p>}
            </div>

            {/* 3 Pillars / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {aboutMe.highlights.map((item, idx) => {
                const icons = [Palette, GraduationCap, MapPin];
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-naho-pink shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-neutral-900 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#cursos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <span>Ver Cursos del Mes</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </a>
              <a
                href="#cotizador"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border border-black/[0.1] font-bold text-xs transition-all active:scale-95"
              >
                <span>Solicitar un Mural Personalizado</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
