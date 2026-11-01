import type { ChangeEvent } from 'react';
import { Eye, Calendar, Clock, Upload } from 'lucide-react';
import type { CourseItem } from '../../../../types';

export interface CourseCardPreviewProps {
  title: string;
  subtitle: string;
  image: string;
  modality: CourseItem['modality'];
  monthLabel: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  price: number;
  maxSpots: number;
  featured: boolean;
  active: boolean;
  isUploading: boolean;
  onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeFeatured: (v: boolean) => void;
  onChangeActive: (v: boolean) => void;
}

export function CourseCardPreview({
  title,
  subtitle,
  image,
  modality,
  monthLabel,
  eventDateDisplay,
  eventTimeDisplay,
  price,
  maxSpots,
  featured,
  active,
  isUploading,
  onUploadImage,
  onChangeFeatured,
  onChangeActive,
}: CourseCardPreviewProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
        <span className="flex items-center gap-1.5 text-naho-pink">
          <Eye className="w-3.5 h-3.5" />
          Vista Previa de la Tarjeta
        </span>
        <span className="text-[10px] text-neutral-400">Catálogo Web</span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-lg space-y-0">
        <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
          <img
            src={image}
            alt="Portada"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {modality === 'presencial'
                ? 'Presencial en Taller'
                : modality === 'hibrido'
                ? 'Híbrido (Taller + Meet)'
                : 'Online en Vivo'}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-neutral-900 shadow-xs">
            {monthLabel || 'Octubre 2026'}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <span className="text-[10px] font-bold text-naho-pink uppercase tracking-wider block">
              {subtitle || 'Taller en Vivo'}
            </span>
            <h4 className="font-serif text-base font-bold text-neutral-900 leading-snug line-clamp-2 mt-0.5">
              {title || 'Título del Nuevo Curso del Mes'}
            </h4>
          </div>

          <div className="space-y-1.5 text-xs text-neutral-600 pt-1 border-t border-black/[0.04]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-naho-pink" />
              <span className="font-medium text-neutral-800">
                {eventDateDisplay || '29 de Octubre, 2026'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-naho-blue" />
              <span className="font-mono text-neutral-700">
                {eventTimeDisplay}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">
                Inversión
              </span>
              <span className="font-mono text-base font-black text-neutral-900">
                ${price} MXN
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-emerald-600 font-bold block">
                {maxSpots} Lugares disponibles
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold mt-1 inline-block">
                Inscribirme
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F2EB]/60 p-3.5 rounded-xl border border-black/5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5 text-naho-pink" />
            <span>{isUploading ? 'Subiendo...' : 'Cambiar Portada'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              className="hidden"
              onChange={onUploadImage}
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => onChangeFeatured(e.target.checked)}
              className="accent-naho-pink w-4 h-4 rounded"
            />
            <span className="font-medium text-[11px]">Destacar en portada</span>
          </label>
        </div>

        <div className="pt-2.5 border-t border-black/[0.06] flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => onChangeActive(e.target.checked)}
              className="accent-emerald-600 w-4 h-4 rounded"
            />
            <span className="font-semibold text-[11px]">
              Curso visible al público (Desmarcar para guardar como borrador)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

