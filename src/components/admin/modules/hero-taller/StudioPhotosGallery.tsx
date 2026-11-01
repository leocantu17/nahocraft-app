import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { localAssets } from '../../../../assets';
import { uploadMediaWithCompression } from '../../../../utils/mediaUploader';
import type { StudioGalleryPhoto } from '../../../../types';

export interface StudioPhotosGalleryProps {
  studioPhotos: StudioGalleryPhoto[];
  onAddStudioPhoto: (photo: StudioGalleryPhoto) => void;
  onDeleteStudioPhoto: (id: string, title: string) => void;
  onShowToast: (msg: string) => void;
}

export function StudioPhotosGallery({
  studioPhotos,
  onAddStudioPhoto,
  onDeleteStudioPhoto,
  onShowToast,
}: StudioPhotosGalleryProps) {
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    caption: '',
    tag: 'Nuestro Taller',
    image: localAssets.murales.hojas,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStudioPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'estudio');
      setNewPhoto((p) => ({ ...p, image: url }));
      onShowToast('Foto del taller cargada.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhotoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim()) return;

    onAddStudioPhoto({
      id: `studio-${Date.now()}`,
      title: newPhoto.title.trim(),
      caption: newPhoto.caption.trim(),
      tag: newPhoto.tag,
      image: newPhoto.image,
    });

    setNewPhoto({
      title: '',
      caption: '',
      tag: 'Nuestro Taller',
      image: localAssets.murales.hojas,
    });
    onShowToast('Nueva foto agregada a la galería del taller.');
  };

  return (
    <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-6">
      <div>
        <h3 className="font-serif text-xl text-neutral-900 font-normal">
          Fotografías del Taller Físico ({studioPhotos.length})
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Muestra cómo se ve el estudio donde impartes clases en Tampico
        </p>
      </div>

      <form
        onSubmit={handleAddPhotoSubmit}
        className="p-5 bg-[#F5F2EB]/60 border border-black/[0.05] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end rounded-xl"
      >
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
            Título *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Área de caballetes"
            value={newPhoto.title}
            onChange={(e) => setNewPhoto((p) => ({ ...p, title: e.target.value }))}
            className="w-full py-1.5 bg-transparent border-b border-neutral-300 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
            Descripción
          </label>
          <input
            type="text"
            placeholder="Ej. Clases vespertinas"
            value={newPhoto.caption}
            onChange={(e) => setNewPhoto((p) => ({ ...p, caption: e.target.value }))}
            className="w-full py-1.5 bg-transparent border-b border-neutral-300 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
            Archivo de Imagen
          </label>
          <label className="w-full py-2 px-3 bg-white border border-neutral-300 text-[10px] font-semibold uppercase tracking-[0.16em] cursor-pointer flex items-center justify-center gap-1.5 rounded">
            <Upload className="w-3.5 h-3.5 text-naho-pink" />
            <span>{isUploading ? 'Subiendo...' : 'Elegir Foto'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              className="hidden"
              onChange={handleUploadStudioPhoto}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="py-2.5 px-5 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer rounded"
        >
          + Agregar Foto
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {studioPhotos.map((p) => (
          <div
            key={p.id}
            className="group bg-white border border-black/[0.06] overflow-hidden flex flex-col justify-between rounded-xl shadow-xs"
          >
            <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
            <div className="bg-[#181B20] text-white p-3.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-serif text-xs truncate">{p.title}</p>
                <p className="text-[10px] text-white/50 truncate">{p.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteStudioPhoto(p.id, p.title)}
                className="p-1.5 text-white/50 hover:text-rose-400 cursor-pointer"
                title="Eliminar foto del taller"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

