import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { X, Upload, Plus, Trash2, Images } from 'lucide-react';
import { localAssets } from '../../../assets';
import { uploadMediaWithCompression } from '../../../utils/mediaUploader';
import type { PortfolioItem, MuralCategory, MuralGalleryImage } from '../../../types';

export interface MuralModalProps {
  isOpen: boolean;
  editingMural: PortfolioItem | null;
  categories: MuralCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (mural: PortfolioItem) => void;
}

export function MuralModal({
  isOpen,
  editingMural,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
}: MuralModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategoryId || categories[0]?.id || 'comercial');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('3.5m x 2.5m');
  const [technique, setTechnique] = useState('Acrílico profesional sobre muro');
  const [location, setLocation] = useState('Tampico, Tamps.');
  const [curatedTag, setCuratedTag] = useState('Mural Personalizado');
  const [tagsText, setTagsText] = useState('Comercial, Tampico, Pintado a Mano');
  const [image, setImage] = useState(localAssets.murales.dulceria);
  const [galleryImages, setGalleryImages] = useState<MuralGalleryImage[]>([]);
  const [newGallerySlideLabel, setNewGallerySlideLabel] = useState('Antes del Mural');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingMural) {
      setTitle(editingMural.title);
      setCategory(editingMural.category);
      setDescription(editingMural.description);
      setDimensions(editingMural.details?.dimensions || '3.5m x 2.5m');
      setTechnique(editingMural.details?.technique || 'Acrílico profesional sobre muro');
      setLocation(editingMural.details?.location || 'Tampico, Tamps.');
      setCuratedTag(editingMural.details?.curatedTag || 'Mural Personalizado');
      setTagsText(
        editingMural.tags?.length
          ? editingMural.tags.join(', ')
          : `${editingMural.categoryLabel}, Tampico`
      );
      setImage(editingMural.image);
      setGalleryImages(editingMural.galleryImages || []);
    } else {
      const defCat = defaultCategoryId || categories[0]?.id || 'comercial';
      const matched = categories.find((c) => c.id === defCat);
      setTitle('');
      setCategory(defCat);
      setDescription('');
      setDimensions('3.5m x 2.5m');
      setTechnique('Acrílico profesional sobre muro');
      setLocation('Tampico, Tamps.');
      setCuratedTag('Mural Personalizado');
      setTagsText(`${matched?.label || 'Mural'}, Tampico, Pintado a Mano`);
      setImage(localAssets.murales.dulceria);
      setGalleryImages([]);
    }
  }, [editingMural, defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleUploadMain = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'murales');
      setImage(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'murales');
      setGalleryImages((p) => [
        ...p,
        {
          id: `slide-${Date.now()}`,
          url,
          label: newGallerySlideLabel,
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCat = categories.find((c) => c.id === category);
    const parsedTags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const muralData: PortfolioItem = {
      id: editingMural?.id || `mural-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: matchedCat?.label || 'Mural Personalizado',
      image,
      description: description.trim() || 'Obra artística mural realizada por Nahocraft en Tampico.',
      tags: parsedTags.length ? parsedTags : [matchedCat?.label || 'Mural', 'Tampico'],
      details: {
        dimensions: dimensions.trim() || '3.5m x 2.5m',
        technique: technique.trim() || 'Acrílico profesional sobre muro',
        location: location.trim() || 'Tampico, Tamps.',
        curatedTag: curatedTag.trim() || 'Mural Personalizado',
      },
      galleryImages,
    };

    onSave(muralData);
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
      <div className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <h3 className="font-serif text-lg">
            {editingMural ? 'Editar Mural y Galería de Proceso' : 'Agregar Nuevo Mural'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Título de la Obra / Mural *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Mural Botánico Residencial"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm bg-transparent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Medidas
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Ubicación (Tampico, Cd. Madero o Altamira)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Técnica Utilizada
              </label>
              <input
                type="text"
                placeholder="Ej. Acrílico profesional y sellador UV"
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Insignia Curatorial (Sello de la Obra)
              </label>
              <input
                type="text"
                placeholder="Ej. Obra Destacada • Tampico"
                value={curatedTag}
                onChange={(e) => setCuratedTag(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Etiquetas / Tags (separadas por coma)
              </label>
              <input
                type="text"
                placeholder="Ej. Comercial, Tampico, Pintado a Mano"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Descripción
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre este mural..."
              className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Fotografía Principal (Resultado Final)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={image}
                alt="Previsualización"
                className="w-24 h-18 object-cover border border-black/10 shadow-xs"
              />
              <label className="px-4 py-2.5 bg-[#F5F2EB] hover:bg-neutral-200 text-[10px] font-semibold uppercase tracking-[0.18em] cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Subiendo...' : 'Seleccionar Portada'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  className="hidden"
                  onChange={handleUploadMain}
                />
              </label>
            </div>
          </div>

          {/* Galería Adicional: Antes / Proceso / Detalles */}
          <div className="p-4 bg-[#F5F2EB]/60 border border-black/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                <Images className="w-3.5 h-3.5 text-naho-pink" />
                Galería Adicional (Antes / Proceso / Detalles)
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {galleryImages.length} fotos extra
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={newGallerySlideLabel}
                onChange={(e) => setNewGallerySlideLabel(e.target.value)}
                className="py-2 px-3 bg-white border border-neutral-300 text-xs text-neutral-800 focus:outline-none"
              >
                <option value="Antes del Mural">Antes del Mural</option>
                <option value="Proceso / Boceto">Proceso / Boceto</option>
                <option value="Detalle de Textura">Detalle de Textura</option>
                <option value="Vista Panorámica">Vista Panorámica</option>
              </select>

              <label className="px-3.5 py-2 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.16em] cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Subir Foto de {newGallerySlideLabel}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  className="hidden"
                  onChange={handleUploadGallery}
                />
              </label>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {galleryImages.map((gImg, idx) => (
                  <div
                    key={`${gImg.label}-${idx}`}
                    className="bg-white border border-black/10 p-2 space-y-1.5 relative group"
                  >
                    <img
                      src={gImg.url}
                      alt={gImg.label}
                      className="w-full h-20 object-cover"
                    />
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={gImg.label}
                        onChange={(e) => {
                          const next = [...galleryImages];
                          next[idx] = { ...gImg, label: e.target.value };
                          setGalleryImages(next);
                        }}
                        className="w-full text-[10px] font-semibold text-neutral-800 border-b border-transparent focus:border-naho-pink focus:outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryImages((p) => p.filter((_, i) => i !== idx));
                        }}
                        className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        title="Quitar foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer"
            >
              {editingMural ? 'Guardar Cambios' : 'Publicar Mural'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
