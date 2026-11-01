import { useState } from 'react';
import { QuoteFormData } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Mail,
  Send,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LiveSummaryProps {
  formData: QuoteFormData;
  currentStep: number;
  totalSteps: number;
  isFormValid: boolean;
  onSubmitQuote: () => void;
  referenceArtTitle?: string;
}

export function LiveSummary({
  formData,
  currentStep,
  totalSteps,
  isFormValid,
  onSubmitQuote,
  referenceArtTitle,
}: LiveSummaryProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const isExpandedOnMobile = mobileExpanded || currentStep === 4;

  const displayMuralCategory =
    formData.muralCategory === 'Otro tipo de mural'
      ? formData.customMuralType?.trim()
        ? `Otro: ${formData.customMuralType.trim()}`
        : 'Otro tipo de mural (Por especificar)'
      : formData.muralCategory || 'Mural Personalizado';

  const getMissingFieldsHint = () => {
    if (isFormValid) return null;
    if (currentStep === 1) {
      if (!formData.muralCategory) return 'Selecciona qué tipo de mural deseas';
      if (
        formData.muralCategory === 'Otro tipo de mural' &&
        (!formData.customMuralType || formData.customMuralType.trim().length < 3)
      ) {
        return 'Especifica qué otro tipo de mural buscas (mín. 3 caracteres)';
      }
    }
    if (currentStep === 2) {
      if (!formData.dimensions) return 'Elige un formato de medidas';
      if (
        formData.dimensions === 'Medidas especiales personalizadas' &&
        formData.customDimensions.trim().length < 3
      ) {
        return 'Escribe las medidas aproximadas de tu pared';
      }
    }
    if (currentStep === 3) {
      if (formData.themeAndDetails.trim().length < 5) {
        return 'Describe cómo quieres tu mural (mín. 5 caracteres)';
      }
      if (!formData.deadlineDate.trim()) {
        return 'Selecciona para cuándo buscas tu mural (fecha específica o flexible)';
      }
    }
    if (currentStep === 4) {
      if (formData.clientName.trim().length < 2) return 'Ingresa tu nombre completo';
      if (!formData.clientEmail.trim().includes('@')) return 'Ingresa un correo electrónico válido';
      if (formData.clientPhone.trim().length < 8) return 'Ingresa tu número de teléfono';
    }
    return 'Completa los campos obligatorios del paso actual para continuar';
  };

  return (
    <div className="apple-card rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-7 sticky top-28 flex flex-col justify-between border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <div>
        <div className={`${isExpandedOnMobile ? 'pb-4 sm:pb-5 border-b border-black/[0.05]' : 'pb-1 lg:pb-5 lg:border-b lg:border-black/[0.05]'}`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-naho-pink to-naho-orange flex items-center justify-center text-white shadow-xs shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-[15px] text-neutral-900 tracking-tight leading-none truncate">
                  Resumen de tu Mural
                </h3>
                <span className="text-[11px] text-neutral-400 mt-1 block truncate">
                  {displayMuralCategory} • {formData.cityZone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-neutral-800 bg-black/[0.04] px-2.5 py-1 rounded-full border border-black/[0.04]">
                Paso {currentStep}/{totalSteps}
              </span>
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => setMobileExpanded((prev) => !prev)}
                  className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold cursor-pointer transition-colors"
                  aria-expanded={isExpandedOnMobile}
                >
                  <span>{mobileExpanded ? 'Ocultar' : 'Detalle'}</span>
                  {mobileExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="w-full bg-black/[0.04] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10px] text-neutral-400 font-mono">
            <span>Progreso de cotización</span>
            <span className="font-semibold text-neutral-700">{progressPercent}%</span>
          </div>
        </div>

        <div className={`${isExpandedOnMobile ? 'block' : 'hidden lg:block'}`}>
          {referenceArtTitle && (
            <div className="mt-4 p-3 bg-naho-pink/[0.05] border border-naho-pink/20 rounded-2xl flex items-center gap-2.5 text-xs text-neutral-800">
              <Sparkles className="w-4 h-4 text-naho-pink shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-naho-pink block tracking-wider">
                  Mural de Inspiración
                </span>
                <p className="font-bold text-neutral-900 truncate">&ldquo;{referenceArtTitle}&rdquo;</p>
              </div>
            </div>
          )}

          <div className="py-4 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Tipo / Categoría de Mural
                </span>
                <span className="text-neutral-950 font-bold text-[13px] block mt-0.5 tracking-tight">
                  {displayMuralCategory}
                </span>
              </div>
              <span className="shrink-0 w-2 h-2 rounded-full bg-naho-pink mt-2 ring-2 ring-naho-pink/20" />
            </div>

            <div className="pt-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-naho-pink" />
                Ciudad (Zona Exclusiva)
              </span>
              <span className="text-neutral-900 font-bold block mt-0.5">
                {formData.cityZone}, Tamaulipas
                {formData.neighborhoodOrAddress && (
                  <span className="text-neutral-500 font-normal block text-[11px]">
                    {formData.neighborhoodOrAddress}
                  </span>
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                Medidas y Superficie
              </span>
              <span className="text-neutral-800 font-medium block mt-0.5">
                {formData.dimensions || 'Por definir'}
                {formData.customDimensions && (
                  <span className="text-neutral-500 block text-[11px] font-mono mt-0.5">
                    Detalle: {formData.customDimensions}
                  </span>
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                ¿Cómo quieres tu mural?
              </span>
              <span className="text-neutral-800 font-medium block mt-0.5 italic leading-relaxed">
                {formData.themeAndDetails ? (
                  `“${formData.themeAndDetails}”`
                ) : (
                  <span className="text-neutral-400 not-italic">Describe tu idea en el paso 3</span>
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
              <div>
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                  ¿Cuándo lo necesitas?
                </span>
                <span className="text-neutral-700 font-medium flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {formData.deadlineDate ? formData.deadlineDate : 'Por seleccionar en el paso 3'}
                </span>
              </div>
            </div>

            {formData.referenceImagePreview && (
              <div className="pt-3 border-t border-black/[0.04]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Imagen de Referencia (Opcional)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Adjunta
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-black/[0.06] aspect-[16/9] bg-neutral-100 shadow-2xs group">
                  <img
                    src={formData.referenceImagePreview}
                    alt="Referencia de mural"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-white text-[11px] font-semibold truncate">
                      {formData.referenceImageName || 'Foto adjunta'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {formData.clientName && (
              <div className="pt-2 border-t border-black/[0.04] space-y-1">
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Tus Datos de Contacto
                </span>
                <span className="text-neutral-900 font-bold block">{formData.clientName}</span>
                {formData.clientEmail && (
                  <span className="text-neutral-600 text-[11px] block break-all font-mono">
                    {formData.clientEmail}
                  </span>
                )}
                {formData.clientPhone && (
                  <span className="text-neutral-500 font-mono text-[11px] block">
                    Tel: {formData.clientPhone}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${isExpandedOnMobile ? 'block' : 'hidden lg:block'} pt-4 sm:pt-5 border-t border-black/[0.05] mt-2`}>
        {!isFormValid && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-amber-900 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">{getMissingFieldsHint()}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onSubmitQuote}
          disabled={!isFormValid}
          className={`hidden lg:flex w-full py-4 px-5 rounded-full font-semibold text-[13px] tracking-tight items-center justify-center gap-2.5 transition-all duration-300 ${
            isFormValid
              ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] cursor-pointer'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isFormValid
                ? 'bg-gradient-to-tr from-naho-pink to-naho-orange text-white'
                : 'bg-neutral-200 text-neutral-400'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </div>
          <span>Enviar Cotización de Mural</span>
        </button>

        <div className="mt-2 lg:mt-4 space-y-1.5 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-naho-pink shrink-0" />
            <span>Recibirás confirmación en tu correo electrónico</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Servicio exclusivo en Tampico, Cd. Madero y Altamira</span>
          </div>
        </div>
      </div>
    </div>
  );
}
