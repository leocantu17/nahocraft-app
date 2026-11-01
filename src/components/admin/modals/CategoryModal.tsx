import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { MuralCategory } from '../../../types';

export interface CategoryModalProps {
  isOpen: boolean;
  editingCategory: MuralCategory | null;
  onClose: () => void;
  onSave: (catData: { id?: string; label: string; description: string }) => void;
}

export function CategoryModal({
  isOpen,
  editingCategory,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setLabel(editingCategory.label);
      setDescription(editingCategory.description || '');
    } else {
      setLabel('');
      setDescription('');
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    onSave({
      id: editingCategory?.id,
      label: label.trim(),
      description: description.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif text-lg">
            {editingCategory ? 'Editar Categoría de Mural' : 'Nueva Categoría de Mural'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Murales Infantiles"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Descripción Breve
            </label>
            <input
              type="text"
              placeholder="Ej. Diseños para recámaras y áreas infantiles"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer"
            >
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
