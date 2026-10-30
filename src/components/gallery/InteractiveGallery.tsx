import { useState, useMemo } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { CategoryId, PortfolioItem } from '../../types';
import { CategoryFilter } from './CategoryFilter';
import { ImageLightbox } from './ImageLightbox';
import { Eye, Sparkles, ArrowUpRight, MapPin, Palette } from 'lucide-react';

interface InteractiveGalleryProps {
  onSelectForQuote: (muralCategoryLabel: string, referenceName: string) => void;
}

export function InteractiveGallery({ onSelectForQuote }: InteractiveGalleryProps) {
  const { muralCategories, muralItems } = useSiteData();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: muralItems.length };
    muralCategories.forEach((cat) => {
      map[cat.id] = muralItems.filter((i) => i.category === cat.id).length;
    });
    return map;
  }, [muralCategories, muralItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return muralItems;
    return muralItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, muralItems]);

  const activeLightboxItem: PortfolioItem | null =
    selectedLightboxIndex !== null ? filteredItems[selectedLightboxIndex] : null;

  const handleNext = () => {
    if (selectedLightboxIndex === null) return;
    setSelectedLightboxIndex((selectedLightboxIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedLightboxIndex === null) return;
    setSelectedLightboxIndex(
      (selectedLightboxIndex - 1 + filteredItems.length) % filteredItems.length
    );
  };

  return (
    <section id="galeria" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-naho-pink/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-naho-blue/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/[0.03] text-neutral-700 border border-black/[0.06] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-naho-pink" />
            Portafolio de Murales por Categoría
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.03em]">
            Murales Pintados a Mano para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink to-naho-orange">
              Negocios, Casas y Decoración
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Explora nuestras categorías de muralismo e inspírate. Diseñamos y pintamos murales personalizados exclusivamente en{' '}
            <strong>Tampico, Ciudad Madero y Altamira</strong>.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-600 font-semibold">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-naho-pink/[0.08] text-neutral-900 border border-naho-pink/20">
              <MapPin className="w-3.5 h-3.5 text-naho-pink" />
              Exclusivo en Tampico, Cd. Madero y Altamira
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-naho-blue/[0.06] text-neutral-800 border border-naho-blue/20">
              <Palette className="w-3.5 h-3.5 text-naho-blue" />
              Negocio • Casa • Decoración Interior & Exterior
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={muralCategories}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSelectedLightboxIndex(null);
          }}
          counts={counts}
        />

        {/* Mural Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-12">
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              className="apple-card rounded-[2.5rem] overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2 glow-mural"
            >
              {/* Image Wrap */}
              <div
                className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedLightboxIndex(index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="apple-glass text-xs font-semibold text-neutral-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Eye className="w-3.5 h-3.5" />
                    Ver mural completo
                  </span>
                  <span className="text-xs font-medium text-white/90 font-mono">
                    {item.details?.dimensions}
                  </span>
                </div>

                <span className="absolute top-3.5 left-3.5 apple-glass text-[11px] font-bold text-neutral-800 px-3 py-1 rounded-full shadow-xs">
                  {item.categoryLabel}
                </span>

                {item.details?.curatedTag && (
                  <span className="absolute top-3.5 right-3.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    {item.details.curatedTag}
                  </span>
                )}

                {item.galleryImages && item.galleryImages.length > 1 && (
                  <span className="absolute bottom-3.5 right-3.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-xs">
                    +{item.galleryImages.length} fotos
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setSelectedLightboxIndex(index)}
                    className="font-extrabold text-[17px] text-neutral-900 leading-snug tracking-tight hover:text-naho-pink transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/[0.05]">
                  <div className="text-[11px] text-neutral-400 mb-3.5 flex items-center justify-between font-mono">
                    <span className="truncate max-w-[180px]">
                      {item.details?.location || 'Sur de Tamaulipas'}
                    </span>
                    <span className="text-neutral-700 font-semibold">
                      {item.details?.dimensions}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLightboxIndex(index)}
                      className="col-span-4 py-2.5 px-3 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Ver</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectForQuote(item.categoryLabel, item.title);
                        const el = document.getElementById('cotizador');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="col-span-8 py-2.5 px-3 rounded-full bg-neutral-950 hover:bg-naho-pink text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Pedir mi propio mural</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Invite Banner below gallery */}
        <div className="mt-14 p-7 sm:p-9 rounded-[2.5rem] bg-neutral-950 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-naho-pink font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              ¿Tienes una pared lista para cobrar vida?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pide tu propio mural para tu negocio, casa o decoración
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
              Atención presencial exclusiva en <strong>Tampico, Ciudad Madero y Altamira</strong>. Cuéntanos tu idea, sube una foto de referencia opcional y recibe tu propuesta.
            </p>
          </div>
          <a
            href="#cotizador"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-naho-pink hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95"
          >
            <span>Cotizar mi Mural Ahora</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <ImageLightbox
        item={activeLightboxItem}
        allItems={filteredItems}
        onClose={() => setSelectedLightboxIndex(null)}
        onSelectNext={handleNext}
        onSelectPrev={handlePrev}
        onQuoteSimilar={(catLabel, name) => {
          onSelectForQuote(catLabel, name);
          const el = document.getElementById('cotizador');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </section>
  );
}
