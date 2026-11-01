import { Plus, Edit3, Trash2, Images, X } from 'lucide-react';
import type { PortfolioItem, MuralCategory } from '../../../../types';

export interface MuralesTabProps {
  muralCategories: MuralCategory[];
  muralItems: PortfolioItem[];
  selectedMuralCatId: string;
  onSelectCategory: (id: string) => void;
  onOpenNewCategoryModal: () => void;
  onOpenEditCategoryModal: (cat: MuralCategory) => void;
  onDeleteCategory: (cat: MuralCategory) => void;
  onOpenNewMuralModal: () => void;
  onOpenEditMuralModal: (item: PortfolioItem) => void;
  onDeleteMural: (item: PortfolioItem) => void;
}

export function MuralesTab({
  muralCategories,
  muralItems,
  selectedMuralCatId,
  onSelectCategory,
  onOpenNewCategoryModal,
  onOpenEditCategoryModal,
  onDeleteCategory,
  onOpenNewMuralModal,
  onOpenEditMuralModal,
  onDeleteMural,
}: MuralesTabProps) {
  const filteredMurals =
    selectedMuralCatId === 'all'
      ? muralItems
      : muralItems.filter((m) => m.category === selectedMuralCatId);

  const activeCategoryObj = muralCategories.find((c) => c.id === selectedMuralCatId);

  return (
    <div className="space-y-12">
      {/* Category Selector Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {muralCategories.map((cat) => {
          const count = muralItems.filter((m) => m.category === cat.id).length;
          const isSelected = selectedMuralCatId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectCategory(cat.id);
              }}
              className={`group relative p-6 text-left transition-all cursor-pointer border-b-2 ${
                isSelected
                  ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                  : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
              }`}
            >
              <span className="block font-serif text-3xl font-normal leading-none">
                {count}
              </span>
              <span
                className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 truncate ${
                  isSelected ? 'text-white/70' : 'text-neutral-400'
                }`}
              >
                {cat.label}
              </span>

              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditCategoryModal(cat);
                  }}
                  title={`Editar categoría ${cat.label}`}
                  className={`p-1 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-white/60 hover:text-naho-pink'
                      : 'text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {muralCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat);
                    }}
                    title={`Eliminar categoría ${cat.label}`}
                    className={`p-1 transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-white/50 hover:text-rose-400'
                        : 'text-neutral-300 hover:text-rose-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* "Todos" card */}
        <div
          onClick={() => onSelectCategory('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectCategory('all');
          }}
          className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
            selectedMuralCatId === 'all'
              ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
              : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
          }`}
        >
          <span className="block font-serif text-3xl font-normal leading-none">
            {muralItems.length}
          </span>
          <span
            className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
              selectedMuralCatId === 'all' ? 'text-white/70' : 'text-neutral-400'
            }`}
          >
            Todos los Murales
          </span>
        </div>
      </div>

      {/* Category Header + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            {selectedMuralCatId === 'all'
              ? 'Todos los Murales'
              : activeCategoryObj?.label || 'Murales'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {filteredMurals.length} {filteredMurals.length === 1 ? 'obra' : 'obras'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewCategoryModal}
            className="px-5 py-3 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Categoría</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewMuralModal}
            className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Mural</span>
          </button>
        </div>
      </div>

      {/* Murals Gallery Cards Grid */}
      {filteredMurals.length === 0 ? (
        <div className="bg-white p-14 text-center border border-black/[0.05]">
          <p className="font-serif text-lg text-neutral-600">
            No hay murales registrados en esta categoría todavía.
          </p>
          <button
            type="button"
            onClick={onOpenNewMuralModal}
            className="mt-4 px-5 py-2.5 bg-[#181B20] text-white text-[10px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Subir primer mural</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMurals.map((item) => (
            <article
              key={item.id}
              className="group bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between border border-black/[0.03]"
            >
              <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.galleryImages && item.galleryImages.length > 0 && (
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-white text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                    <Images className="w-3 h-3 text-naho-yellow" />
                    <span>+{item.galleryImages.length} fotos</span>
                  </span>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onOpenEditMuralModal(item)}
                    className="p-2 bg-white/95 text-neutral-800 hover:text-naho-pink shadow-md cursor-pointer transition-colors"
                    title="Editar mural"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMural(item)}
                    className="p-2 bg-white/95 text-neutral-800 hover:text-rose-600 shadow-md cursor-pointer transition-colors"
                    title="Eliminar mural"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-naho-pink">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-base text-neutral-900 font-normal leading-snug mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{item.details?.dimensions || '3.5m x 2.5m'}</span>
                  <span>{item.details?.location || 'Tampico'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
