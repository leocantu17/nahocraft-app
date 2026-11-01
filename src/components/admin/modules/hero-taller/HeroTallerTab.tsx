import { Sparkles, Save, RotateCcw } from 'lucide-react';
import type {
  SiteGeneralConfig,
  DailySchedule,
  InPersonClassProgram,
  StudioGalleryPhoto,
} from '../../../../types';

import { HeroConfigForm } from './HeroConfigForm';
import { WeeklyScheduleEditor } from './WeeklyScheduleEditor';
import { InPersonClassesEditor } from './InPersonClassesEditor';
import { StudioPhotosGallery } from './StudioPhotosGallery';
import { HeroLivePreview } from './HeroLivePreview';

export interface HeroTallerTabProps {
  siteConfig: SiteGeneralConfig;
  weeklySchedule: DailySchedule[];
  inPersonClasses: InPersonClassProgram[];
  studioPhotos: StudioGalleryPhoto[];
  onUpdateSiteConfig: (partial: Partial<SiteGeneralConfig>) => void;
  onUpdateWeeklySchedule: (schedule: DailySchedule[]) => void;
  onUpdateInPersonClasses: (classes: InPersonClassProgram[]) => void;
  onAddStudioPhoto: (photo: StudioGalleryPhoto) => void;
  onDeleteStudioPhoto: (id: string, title: string) => void;
  onResetDefaults: () => void;
  onShowToast: (msg: string) => void;
}

export function HeroTallerTab({
  siteConfig,
  weeklySchedule,
  inPersonClasses,
  studioPhotos,
  onUpdateSiteConfig,
  onUpdateWeeklySchedule,
  onUpdateInPersonClasses,
  onAddStudioPhoto,
  onDeleteStudioPhoto,
  onResetDefaults,
  onShowToast,
}: HeroTallerTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-naho-pink/10 text-naho-pink mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Editor Visual con Vista Previa en Vivo
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            Portada Principal (Hero) & Datos del Taller
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Edita la portada de bienvenida, redes sociales, horarios del taller y clases presenciales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Configuración del Hero y Taller guardada.')}
          className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Form Modules (7 cols) */}
        <div className="xl:col-span-7 space-y-8">
          <HeroConfigForm
            siteConfig={siteConfig}
            onUpdateSiteConfig={onUpdateSiteConfig}
          />

          <WeeklyScheduleEditor
            weeklySchedule={weeklySchedule}
            onUpdateWeeklySchedule={onUpdateWeeklySchedule}
          />

          <InPersonClassesEditor
            inPersonClasses={inPersonClasses}
            onUpdateInPersonClasses={onUpdateInPersonClasses}
          />

          <StudioPhotosGallery
            studioPhotos={studioPhotos}
            onAddStudioPhoto={onAddStudioPhoto}
            onDeleteStudioPhoto={onDeleteStudioPhoto}
            onShowToast={onShowToast}
          />
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <HeroLivePreview siteConfig={siteConfig} />
      </div>

      {/* Bottom Factory Reset */}
      <div className="flex justify-end pt-4 border-t border-black/[0.05]">
        <button
          type="button"
          onClick={onResetDefaults}
          className="px-5 py-2.5 border border-neutral-300 hover:border-rose-600 hover:text-rose-600 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600 inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar valores iniciales</span>
        </button>
      </div>
    </div>
  );
}
