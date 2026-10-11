import { useState } from 'react';
import { QuoteFormData } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Mail,
  Send,
  Palette,
} from 'lucide-react';

interface LiveSummaryProps {
  formData: QuoteFormData;
  currentStep: number;
  totalSteps: number;
  isFormValid: boolean;
  onSubmitQuote: () => void;
  referenceArtTitle?: string;
  formattedMessage?: string;
}

export function LiveSummary({
  formData,
  currentStep,
  totalSteps,
  isFormValid,
  onSubmitQuote,
  referenceArtTitle,
  formattedMessage,
}: LiveSummaryProps) {
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  const getProjectLabel = () => {
    switch (formData.projectType) {
      case 'mural':
        return 'Mural Artístico (Comercial / Residencial)';
      case 'ropa':
        return 'Diseño Textil & Custom Denim';
      case 'totebag':
        return 'Totebag Artesanal en Lienzo';
      case 'otro':
        return 'Proyecto Artístico Personalizado';
      default:
        return 'Proyecto de Arte';
    }
  };

  // Calculate percentage of progress
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Missing fields feedback
  const getMissingFieldsHint = () => {
    if (isFormValid) return null;
    if (currentStep === 1 && !formData.projectType) return 'Selecciona una disciplina';
    if (currentStep === 2 && !formData.dimensions) return 'Elige un formato de medidas';
    if (currentStep === 3 && formData.themeAndDetails.trim().length < 4)
      return 'Escribe al menos 4 caracteres de tu idea artística';
    if (currentStep === 4) {
      if (formData.clientName.trim().length < 2) return 'Ingresa tu nombre completo';
      if (!formData.clientEmail.trim().includes('@')) return 'Ingresa un correo electrónico válido';
      if (formData.clientPhone.trim().length < 8) return 'Ingresa un teléfono o WhatsApp';
    }
    return 'Completa los datos requeridos para enviar';
  };

  const handleCopyPreview = () => {
    if (!formattedMessage) return;
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="apple-card rounded-[2.5rem] p-6 sm:p-7 sticky top-28 flex flex-col justify-between border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <div>
        {/* Apple Wallet / Pass Header */}
        <div className="pb-5 border-b border-black/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-naho-pink to-naho-orange flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] text-neutral-900 tracking-tight leading-none">
                  Ficha de Proyecto
                </h3>
                <span className="text-[11px] text-neutral-400 mt-1 inline-block">
                  Sincronización en tiempo real
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-neutral-800 bg-black/[0.04] px-2.5 py-1 rounded-full border border-black/[0.04]">
                {currentStep} / {totalSteps}
              </span>
            </div>
          </div>

          {/* Micro Progress Track */}
          <div className="w-full bg-black/[0.04] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10px] text-neutral-400 font-mono">
            <span>Progreso del proyecto</span>
            <span className="font-semibold text-neutral-700">{progressPercent}%</span>
          </div>
        </div>

        {/* Gallery Inspiration Badge */}
        {referenceArtTitle && (
          <div className="mt-4 p-3 bg-naho-pink/[0.05] border border-naho-pink/20 rounded-2xl flex items-center gap-2.5 text-xs text-neutral-800">
            <Sparkles className="w-4 h-4 text-naho-pink shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-naho-pink block tracking-wider">
                Inspiración seleccionada
              </span>
              <p className="font-bold text-neutral-900 truncate">"{referenceArtTitle}"</p>
            </div>
          </div>
        )}

        {/* Itemized Overview (Apple Slip Style) */}
        <div className="py-4 space-y-3 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                Disciplina Artística
              </span>
              <span className="text-neutral-950 font-bold text-[13px] block mt-0.5 tracking-tight">
                {getProjectLabel()}
              </span>
            </div>
            <span className="shrink-0 w-2 h-2 rounded-full bg-naho-pink mt-2 ring-2 ring-naho-pink/20" />
          </div>

          <div className="pt-2 border-t border-black/[0.04]">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
              Formato / Dimensiones
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

          {formData.surfaceOrMaterial && (
            <div className="pt-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                Superficie / Soporte
              </span>
              <span className="text-neutral-700 font-medium block mt-0.5">
                {formData.surfaceOrMaterial}
              </span>
            </div>
          )}

          {formData.colorPalette && (
            <div className="pt-2 border-t border-black/[0.04]">
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Palette className="w-3 h-3 text-naho-purple" />
                Vibra Cromática
              </span>
              <span className="text-neutral-900 font-semibold block mt-0.5">
                {formData.colorPalette}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-black/[0.04]">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
              Concepto o Idea
            </span>
            <span className="text-neutral-800 font-medium block mt-0.5 italic leading-relaxed">
              {formData.themeAndDetails ? (
                `"${formData.themeAndDetails}"`
              ) : (
                <span className="text-neutral-400 not-italic">Detalla tu visión en el paso 3</span>
              )}
            </span>
          </div>

          <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
            <div>
              <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                Fecha deseada
              </span>
              <span className="text-neutral-700 font-medium flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
                <Clock className="w-3 h-3 text-neutral-400" />
                {formData.deadlineDate ? formData.deadlineDate : 'Flexible / A coordinar'}
              </span>
            </div>
          </div>

          {/* Reference Image Thumbnail Widget */}
          {formData.referenceImagePreview && (
            <div className="pt-3 border-t border-black/[0.04]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Foto de Referencia
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Adjunta
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-black/[0.06] aspect-[16/9] bg-neutral-100 shadow-2xs group">
                <img
                  src={formData.referenceImagePreview}
                  alt="Referencia de obra"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                Datos de Contacto
              </span>
              <span className="text-neutral-900 font-bold block">
                {formData.clientName}
              </span>
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

        {/* Interactive "Preview formatted Quote" Accordion */}
        {formattedMessage && (
          <div className="mt-2 border-t border-black/[0.05] pt-3">
            <button
              type="button"
              onClick={() => setShowPreviewDrawer(!showPreviewDrawer)}
              className="w-full flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-950 font-semibold py-1.5 px-2 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span>Ficha oficial que recibirá Nahomy</span>
              </span>
              {showPreviewDrawer ? (
                <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </button>

            {showPreviewDrawer && (
              <div className="mt-2 p-3 bg-neutral-50 rounded-2xl border border-black/[0.05] text-[11px] font-mono text-neutral-700 whitespace-pre-wrap max-h-48 overflow-y-auto relative animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-black/[0.05]">
                  <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase">
                    Formato de envío al estudio:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPreview}
                    className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-neutral-900 font-sans cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                {formattedMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action CTA & Studio Routing Guarantees */}
      <div className="pt-5 border-t border-black/[0.05] mt-2">
        {/* Missing hint helper */}
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
          className={`w-full py-4 px-5 rounded-full font-semibold text-[13px] tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 ${
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
          <span>Registrar y Enviar Cotización</span>
        </button>

        <div className="mt-4 space-y-1.5 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-naho-pink" />
            <span>Se envía al panel del taller y correo de Nahomy</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Nahomy te contactará con el presupuesto formal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
