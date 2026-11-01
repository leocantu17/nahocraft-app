import { CategoryId, MuralCategory } from '../../types';
import { Palette, LayoutGrid, Building2, Home, Sparkles, Compass } from 'lucide-react';

interface CategoryFilterProps {
  categories: MuralCategory[];
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  const getCategoryIcon = (id: string) => {
    if (id === 'comercial') return <Building2 className="w-3.5 h-3.5 text-naho-pink" />;
    if (id === 'residencial') return <Home className="w-3.5 h-3.5 text-naho-blue" />;
    if (id === 'decoracion') return <Sparkles className="w-3.5 h-3.5 text-lime-600" />;
    if (id === 'urbano') return <Compass className="w-3.5 h-3.5 text-naho-orange" />;
    return <Palette className="w-3.5 h-3.5 text-naho-purple" />;
  };

  const allTabItems = [
    {
      id: 'all',
      label: 'Todos los Murales',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: getCategoryIcon(cat.id),
    })),
  ];

  return (
    <div className="flex justify-center py-3 sm:py-4">
      <div
        role="tablist"
        aria-label="Filtrar murales por categoría"
        className="w-full max-w-md sm:w-auto sm:max-w-full grid grid-cols-2 sm:inline-flex sm:flex-wrap items-center justify-center gap-1.5 bg-black/[0.04] p-1.5 rounded-2xl sm:rounded-full border border-black/[0.05] backdrop-blur-xl"
      >
        {allTabItems.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] ?? 0;
          const isAllTab = idx === 0;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`${
                isAllTab ? 'col-span-2 justify-center' : 'col-span-1 justify-between sm:justify-center'
              } inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-300 select-none cursor-pointer min-w-0 ${
                isActive
                  ? 'bg-white text-neutral-950 shadow-[0_2px_10px_rgba(0,0,0,0.08)] sm:scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.03]'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="shrink-0">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-800'
                    : 'bg-black/[0.06] text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
