import { useEffect, useState, useMemo } from 'react';
import { PortfolioItem } from '../../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Tag,
  Maximize2,
  ShieldCheck,
  MapPin,
  Images,
} from 'lucide-react';

interface ImageLightboxProps {
  item: PortfolioItem | null;
  allItems: PortfolioItem[];
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
  onQuoteSimilar: (categoryLabel: string, itemTitle: string) => void;
}

export function ImageLightbox({
  item,
  onClose,
  onSelectNext,
  onSelectPrev,
  onQuoteSimilar,
}: ImageLightboxProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  // Reset active slide when switching mural item
  useEffect(() => {
    setSelectedSlideIndex(0);
  }, [item?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectNext();
      if (e.key === 'ArrowLeft') onSelectPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectNext, onSelectPrev]);

  const slides = useMemo(() => {
    if (!item) return [];
    const baseSlide = {
      id: `${item.id}-main`,
      url: item.image,
      label: 'Vista Principal',
    };
    const extraSlides = (item.galleryImages || []).filter(
      (g) => g.url && g.url !== item.image
    );
    return [baseSlide, ...extraSlides];
  }, [item]);

  if (!item) return null;

  const activeSlide = slides[selectedSlideIndex] || slides[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle del mural ${item.title}`}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-black/[0.08] flex flex-col lg:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Cerrar modal de imagen"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Container + Multi-photo Thumbnails */}
        <div className="relative lg:w-3/5 bg-neutral-950 flex flex-col justify-between min-h-[320px] sm:min-h-[440px] max-h-[58vh] lg:max-h-[92vh] overflow-hidden select-none">
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={activeSlide?.url || item.image}
              alt={`${item.title} - ${activeSlide?.label || 'Mural'}`}
              className="w-full h-full object-contain max-h-[75vh] transition-transform duration-300"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-xl transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
              aria-label="Mural anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-xl transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
              aria-label="Siguiente mural"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/95 flex items-center gap-1.5 font-medium">
              <Maximize2 className="w-3 h-3 text-naho-pink" />
              {activeSlide?.label || 'Mural Real • Nahocraft'}
            </span>
          </div>

          {/* Multi-photo Thumbnails Strip */}
          {slides.length > 1 && (
            <div className="bg-black/90 border-t border-white/10 px-4 py-3 flex items-center gap-2.5 overflow-x-auto">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 flex items-center gap-1 shrink-0 mr-1">
                <Images className="w-3.5 h-3.5 text-naho-pink" />
                <span>Vistas ({slides.length}):</span>
              </span>
              {slides.map((slide, idx) => {
                const isSelected = idx === selectedSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={`group relative flex items-center gap-2 pr-2.5 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-naho-pink bg-white/15 text-white shadow-sm'
                        : 'border-white/15 bg-white/5 text-white/60 hover:text-white hover:border-white/35'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.label}
                      className="w-10 h-10 object-cover shrink-0"
                    />
                    <span className="text-[10px] font-semibold whitespace-nowrap">
                      {slide.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Project Details */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/[0.04] text-neutral-700">
                {item.categoryLabel}
              </span>
              {item.details?.curatedTag && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-naho-yellow/20 text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {item.details.curatedTag}
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black text-neutral-900 leading-snug tracking-tight mb-2">
              {item.title}
            </h3>

            <p className="text-[13px] text-neutral-600 leading-relaxed mb-6 font-normal">
              {item.description}
            </p>

            <div className="bg-neutral-50 rounded-2xl p-4 border border-black/[0.04] space-y-2.5 mb-6 text-[12px]">
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider pb-1 border-b border-black/[0.04]">
                Especificaciones del Mural
              </div>

              {item.details?.dimensions && (
                <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                  <span className="text-neutral-500 font-medium">Dimensiones aprox:</span>
                  <span className="font-semibold text-neutral-900 text-right font-mono">
                    {item.details.dimensions}
                  </span>
                </div>
              )}
              {item.details?.technique && (
                <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                  <span className="text-neutral-500 font-medium">Técnica:</span>
                  <span className="font-semibold text-neutral-900 text-right">
                    {item.details.technique}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                <span className="text-neutral-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-naho-pink" />
                  Ubicación / Cobertura:
                </span>
                <span className="font-semibold text-neutral-900">
                  {item.details?.location || 'Tampico, Cd. Madero y Altamira'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-neutral-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Autoría:
                </span>
                <span className="font-semibold text-emerald-800">100% Pintado a Mano por Nahomy</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5 text-neutral-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.05]">
            <button
              type="button"
              onClick={() => {
                onQuoteSimilar(item.categoryLabel, item.title);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-neutral-950 hover:bg-naho-pink text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-naho-pink" />
              <span>Pedir mi propio mural inspirado en este</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2 font-mono">
              Disponible en Tampico, Ciudad Madero y Altamira
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
