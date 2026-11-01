import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Eye, Save, Upload } from 'lucide-react';
import { uploadMediaWithCompression } from '../../../../utils/mediaUploader';
import type { AboutMeContent } from '../../../../types';

export interface SobreMiTabProps {
  aboutMe: AboutMeContent;
  onUpdateAboutMe: (partial: Partial<AboutMeContent>) => void;
  onShowToast: (msg: string) => void;
}

export function SobreMiTab({
  aboutMe,
  onUpdateAboutMe,
  onShowToast,
}: SobreMiTabProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPortrait = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'sobre-mi');
      onUpdateAboutMe({ portraitImage: url });
      onShowToast('Fotografía principal actualizada.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSecondary = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'sobre-mi');
      onUpdateAboutMe({ secondaryImage: url });
      onShowToast('Fotografía secundaria actualizada.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-naho-pink/10 text-naho-pink mb-2">
            <Eye className="w-3.5 h-3.5" />
            Editor Visual con Vista Previa en Tiempo Real
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            Sobre Mí • Historia & Perfil de Nahomy
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Modifica tu fotografía, frase y biografía. El panel derecho te muestra exactamente cómo se verá en la web.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Sección "Sobre Mí" guardada.')}
          className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Form Editor (7 cols) */}
        <div className="xl:col-span-7 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-8">
          {/* Portrait & Secondary Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-black/[0.06]">
            <div className="flex items-center gap-4">
              <img
                src={aboutMe.portraitImage}
                alt="Retrato Sobre Mí"
                className="w-24 h-32 object-cover bg-neutral-100 border border-black/10 shrink-0 shadow-xs"
              />
              <div className="space-y-2.5 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block">
                  Retrato Principal
                </span>
                <label className="px-4 py-2 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Subiendo...' : 'Cambiar Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={handleUploadPortrait}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={aboutMe.secondaryImage}
                alt="Imagen Secundaria Sobre Mí"
                className="w-24 h-32 object-cover bg-neutral-100 border border-black/10 shrink-0 shadow-xs"
              />
              <div className="space-y-2.5 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block">
                  Foto Secundaria / Taller
                </span>
                <label className="px-4 py-2 bg-[#F5F2EB] hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Subiendo...' : 'Cambiar Secundaria'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={handleUploadSecondary}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Insignia Superior (Badge)
              </label>
              <input
                type="text"
                value={aboutMe.badge}
                onChange={(e) => onUpdateAboutMe({ badge: e.target.value })}
                className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Firma al pie de foto
              </label>
              <input
                type="text"
                value={aboutMe.signatureText}
                onChange={(e) => onUpdateAboutMe({ signatureText: e.target.value })}
                className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={aboutMe.title}
                onChange={(e) => onUpdateAboutMe({ title: e.target.value })}
                className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={aboutMe.subtitle}
                onChange={(e) => onUpdateAboutMe({ subtitle: e.target.value })}
                className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Metric Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F5F2EB]/60 border border-black/[0.05]">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1">
                Años de Experiencia
              </label>
              <input
                type="text"
                value={aboutMe.yearsExperience}
                onChange={(e) => onUpdateAboutMe({ yearsExperience: e.target.value })}
                className="w-full py-1.5 bg-white px-2.5 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1">
                Etiqueta de Murales
              </label>
              <input
                type="text"
                value={aboutMe.muralCountLabel}
                onChange={(e) => onUpdateAboutMe({ muralCountLabel: e.target.value })}
                className="w-full py-1.5 bg-white px-2.5 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1">
                Etiqueta de Alumnos
              </label>
              <input
                type="text"
                value={aboutMe.studentsCountLabel}
                onChange={(e) => onUpdateAboutMe({ studentsCountLabel: e.target.value })}
                className="w-full py-1.5 bg-white px-2.5 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Frase / Filosofía Artística
            </label>
            <textarea
              rows={2}
              value={aboutMe.philosophyQuote}
              onChange={(e) => onUpdateAboutMe({ philosophyQuote: e.target.value })}
              className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
            />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Párrafo 1 de Biografía
              </label>
              <textarea
                rows={3}
                value={aboutMe.bioParagraph1}
                onChange={(e) => onUpdateAboutMe({ bioParagraph1: e.target.value })}
                className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Párrafo 2 de Biografía
              </label>
              <textarea
                rows={3}
                value={aboutMe.bioParagraph2}
                onChange={(e) => onUpdateAboutMe({ bioParagraph2: e.target.value })}
                className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                Párrafo 3 de Biografía
              </label>
              <textarea
                rows={3}
                value={aboutMe.bioParagraph3}
                onChange={(e) => onUpdateAboutMe({ bioParagraph3: e.target.value })}
                className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Highlights / Pilares */}
          {aboutMe.highlights && aboutMe.highlights.length > 0 && (
            <div className="pt-4 border-t border-black/[0.06] space-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block">
                Tarjetas Destacadas de Trayectoria (3 Pilares)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {aboutMe.highlights.map((hl, idx) => (
                  <div
                    key={hl.id || idx}
                    className="p-3.5 bg-[#F5F2EB]/60 border border-black/[0.05] space-y-2.5"
                  >
                    <div>
                      <label className="block text-[9px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Título Pilar #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={hl.title}
                        onChange={(e) => {
                          const next = [...aboutMe.highlights];
                          next[idx] = { ...hl, title: e.target.value };
                          onUpdateAboutMe({ highlights: next });
                        }}
                        className="w-full py-1.5 px-2 bg-white border border-neutral-200 focus:border-naho-pink text-xs font-semibold text-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Descripción
                      </label>
                      <textarea
                        rows={2}
                        value={hl.description}
                        onChange={(e) => {
                          const next = [...aboutMe.highlights];
                          next[idx] = { ...hl, description: e.target.value };
                          onUpdateAboutMe({ highlights: next });
                        }}
                        className="w-full p-2 bg-white border border-neutral-200 focus:border-naho-pink text-xs text-neutral-700 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
            <span className="flex items-center gap-1.5 text-naho-pink">
              <Eye className="w-3.5 h-3.5" />
              Vista Previa en Vivo
            </span>
            <span className="text-[10px] text-neutral-400">Web Pública</span>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-black/[0.06] shadow-sm space-y-6">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden rounded-xl border border-black/10 relative">
              <img
                src={aboutMe.portraitImage}
                alt="Retrato"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/80 backdrop-blur-md text-white p-3 rounded-lg text-center">
                <span className="text-[11px] font-serif italic block">
                  {aboutMe.signatureText || 'Nahomy • Artista & Muralista'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-naho-pink block">
                {aboutMe.badge}
              </span>
              <h3 className="font-serif text-2xl text-neutral-900 font-bold leading-tight">
                {aboutMe.title}
              </h3>
              <p className="text-xs text-neutral-600 font-medium">
                {aboutMe.subtitle}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border-l-4 border-naho-pink shadow-xs">
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                Filosofía Artística
              </span>
              <p className="font-serif italic text-xs text-neutral-800 leading-relaxed">
                &ldquo;{aboutMe.philosophyQuote}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/[0.06] text-center">
              <div>
                <span className="block font-serif text-xl font-bold text-neutral-900">
                  {aboutMe.yearsExperience}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">
                  Años
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-neutral-900">
                  {aboutMe.muralCountLabel}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">
                  Murales
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-neutral-900">
                  {aboutMe.studentsCountLabel}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">
                  Alumnos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
