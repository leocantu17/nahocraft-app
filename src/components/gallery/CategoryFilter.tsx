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
    <div className="flex justify-center py-4">
      <div
        role="tablist"
        aria-label="Filtrar murales por categoría"
        className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-black/[0.04] p-1.5 rounded-full border border-black/[0.04] backdrop-blur-xl max-w-full"
      >
        {allTabItems.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 select-none cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-950 shadow-[0_2px_10px_rgba(0,0,0,0.08)] scale-[1.02]'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.03]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-800'
                    : 'bg-black/[0.05] text-neutral-500'
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
