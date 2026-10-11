import { CategoryId } from '../../types';
import { Palette, Shirt, ShoppingBag, LayoutGrid } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  counts: {
    all: number;
    murales: number;
    ropa: number;
    totebags: number;
  };
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  const categories: { id: CategoryId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'Todos',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    {
      id: 'murales',
      label: 'Murales',
      icon: <Palette className="w-3.5 h-3.5 text-naho-pink" />,
    },
    {
      id: 'ropa',
      label: 'Diseño de Ropa',
      icon: <Shirt className="w-3.5 h-3.5 text-naho-blue" />,
    },
    {
      id: 'totebags',
      label: 'Totebags',
      icon: <ShoppingBag className="w-3.5 h-3.5 text-lime-600" />,
    },
  ];

  return (
    <div className="flex justify-center py-4">
      <div className="inline-flex flex-wrap items-center justify-center gap-1 bg-black/[0.04] p-1.5 rounded-full border border-black/[0.04] backdrop-blur-xl max-w-full">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 select-none cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-950 shadow-[0_2px_10px_rgba(0,0,0,0.08)] scale-[1.02]'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-800'
                    : 'bg-black/[0.04] text-neutral-400'
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
