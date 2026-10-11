import { useEffect } from 'react';
import { PortfolioItem, ProjectType } from '../../types';
import { X, ChevronLeft, ChevronRight, MessageSquare, Sparkles, Tag, Maximize2, ShieldCheck, MapPin } from 'lucide-react';

interface ImageLightboxProps {
  item: PortfolioItem | null;
  allItems: PortfolioItem[];
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
  onQuoteSimilar: (projectType: ProjectType, itemTitle: string) => void;
}

export function ImageLightbox({
  item,
  onClose,
  onSelectNext,
  onSelectPrev,
  onQuoteSimilar,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectNext();
      if (e.key === 'ArrowLeft') onSelectPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectNext, onSelectPrev]);

  if (!item) return null;

  const getProjectType = (cat: PortfolioItem['category']): ProjectType => {
    if (cat === 'murales') return 'mural';
    if (cat === 'ropa') return 'ropa';
    if (cat === 'totebags') return 'totebag';
    return 'otro';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-black/[0.08] flex flex-col lg:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple-style Close Pill */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Cerrar modal de imagen"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Container with Nav Arrows (macOS Quick Look Stage) */}
        <div className="relative lg:w-3/5 bg-neutral-950 flex items-center justify-center min-h-[320px] sm:min-h-[440px] max-h-[55vh] lg:max-h-[92vh] overflow-hidden select-none">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain max-h-[85vh] transition-transform duration-300"
          />

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-xl transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Obra anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-xl transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Siguiente obra"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white/90 flex items-center gap-1.5 font-medium">
            <Maximize2 className="w-3 h-3 text-neutral-400" />
            Fotografía real del taller • Quick Look
          </span>
        </div>

        {/* Right: Project Details & Action (Apple Specs Inspector) */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
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

            {/* Title */}
            <h3 className="text-2xl font-black text-neutral-900 leading-snug tracking-tight mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-6 font-normal">
              {item.description}
            </p>

            {/* Technical specs (Apple Specs Table) */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-black/[0.04] space-y-2.5 mb-6 text-[12px]">
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider pb-1 border-b border-black/[0.04]">
                Especificaciones Técnicas
              </div>

              {item.details?.dimensions && (
                <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                  <span className="text-neutral-500 font-medium">Dimensiones:</span>
                  <span className="font-semibold text-neutral-900 text-right font-mono">{item.details.dimensions}</span>
                </div>
              )}
              {item.details?.technique && (
                <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                  <span className="text-neutral-500 font-medium">Técnica & Materiales:</span>
                  <span className="font-semibold text-neutral-900 text-right">{item.details.technique}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-0.5 border-b border-black/[0.03]">
                <span className="text-neutral-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  Origen:
                </span>
                <span className="font-semibold text-neutral-900">Tampico, Tamaulipas</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-neutral-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Autenticidad:
                </span>
                <span className="font-semibold text-emerald-800">Pieza Original de Nahomy</span>
              </div>
            </div>

            {/* Tags */}
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

          {/* CTA Button to quote something similar */}
          <div className="pt-4 border-t border-black/[0.05]">
            <button
              onClick={() => {
                onQuoteSimilar(getProjectType(item.category), item.title);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-naho-pink" />
              <span>Cotizar Obra Similar a Esta</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2 font-mono">
              Se preseleccionará automáticamente en el cotizador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
