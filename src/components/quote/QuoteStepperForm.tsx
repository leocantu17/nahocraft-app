import React, { useState, useId } from 'react';
import {
  QuoteFormData,
  MuralCityZone,
  QuoteTicket,
} from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import { LiveSummary } from './LiveSummary';
import { ScrollReveal } from '../common/ScrollReveal';
import confetti from 'canvas-confetti';
import { sendClientQuoteConfirmation, sendStudioQuoteNotification } from '../../emails';
import { uploadMediaWithCompression } from '../../utils/mediaUploader';
import { sanitizeText, checkSubmissionCooldown, recordSubmission } from '../../utils/security';
import {
  Palette,
  Building2,
  Home,
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle,
  MapPin,
  Ruler,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Check,
  Lock,
  PlusCircle,
} from 'lucide-react';

interface QuoteStepperFormProps {
  initialMuralCategory?: string;
  referenceArtTitle?: string;
}

export function QuoteStepperForm({
  initialMuralCategory = 'Negocios & Comercial',
  referenceArtTitle,
}: QuoteStepperFormProps) {
  const { muralCategories, addQuoteTicket } = useSiteData();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');
  const totalSteps = 4;

  const goToStep = (targetStep: number) => {
    setStepDirection(targetStep >= currentStep ? 'forward' : 'backward');
    setCurrentStep(targetStep);
  };
  const stepAnimClass =
    stepDirection === 'forward' ? 'animate-step-forward' : 'animate-step-backward';

  const [formData, setFormData] = useState<QuoteFormData>({
    projectType: 'mural',
    muralCategory: initialMuralCategory,
    customMuralType: '',
    dimensions: 'Mural mediano (aprox. 3m x 2.5m)',
    customDimensions: '',
    surfaceOrMaterial: 'Pared lisa en interior',
    themeAndDetails: '',
    datePreferenceType: 'especifica',
    deadlineDate: '',
    cityZone: 'Tampico',
    neighborhoodOrAddress: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientLocation: 'Tampico, Tamps.',
    clientNotes: '',
    referenceImagePreview: undefined,
    referenceImageName: undefined,
  });

  const [createdTicket, setCreatedTicket] = useState<QuoteTicket | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [cooldownError, setCooldownError] = useState<string | null>(null);

  // Accessibility IDs
  const customMuralTypeId = useId();
  const customDimensionsId = useId();
  const themeDetailsId = useId();
  const deadlineDateId = useId();
  const clientNameId = useId();
  const clientEmailId = useId();
  const clientPhoneId = useId();
  const neighborhoodId = useId();
  const clientNotesId = useId();
  const imageUploadInputId = useId();

  const muralDimensionPresets = [
    { label: 'Mural decorativo boutique (aprox. 2m x 2m)', surface: 'Pared interior de casa o negocio' },
    { label: 'Mural mediano (aprox. 3m x 2.5m)', surface: 'Pared lisa en interior', popular: true },
    { label: 'Mural comercial gran formato (5m x 3m)', surface: 'Muro comercial o fachada exterior' },
    { label: 'Mural monumental (+6m de ancho)', surface: 'Fachada arquitectónica o nave comercial' },
    { label: 'Medidas especiales personalizadas', surface: 'Por medir o evaluar con Nahomy' },
  ];

  const themeIdeaPresets = [
    'Mural para negocio / Punto fotográfico',
    'Botánico, hojas tropicales y naturaleza para casa',
    'Identidad de marca / Logotipo artístico comercial',
    'Decoración de habitación o sala residencial',
    'Propuesta artística libre diseñada por Nahomy',
  ];

  const allowedCities: { city: MuralCityZone; shortLabel: string; desc: string }[] = [
    {
      city: 'Tampico',
      shortLabel: 'Tampico',
      desc: 'Zona Centro, Minerva, Lomas de Rosales, Hidalgo y alrededores',
    },
    {
      city: 'Ciudad Madero',
      shortLabel: 'Cd. Madero',
      desc: 'Playa Miramar, Unidad Nacional, Centro y colonias',
    },
    {
      city: 'Altamira',
      shortLabel: 'Altamira',
      desc: 'Zona Centro, Residenciales, Corredor Urbano e Industrial',
    },
  ];

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10 MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadedOrCompressedUrl = await uploadMediaWithCompression(
        file,
        'cotizaciones',
        1200,
        0.82
      );
      setFormData((prev) => ({
        ...prev,
        referenceImagePreview: uploadedOrCompressedUrl,
        referenceImageName: file.name,
      }));
    } catch {
      alert('No se pudo procesar la imagen seleccionada.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      referenceImagePreview: undefined,
      referenceImageName: undefined,
    }));
  };

  // Strict per-step validation
  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      if (!formData.muralCategory || !formData.cityZone) return false;
      if (
        formData.muralCategory === 'Otro tipo de mural' &&
        (!formData.customMuralType || formData.customMuralType.trim().length < 3)
      ) {
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.dimensions) return false;
      if (
        formData.dimensions === 'Medidas especiales personalizadas' &&
        formData.customDimensions.trim().length < 3
      ) {
        return false;
      }
      return true;
    }
    if (step === 3) {
      return (
        formData.themeAndDetails.trim().length >= 5 &&
        formData.deadlineDate.trim().length > 0
      );
    }
    if (step === 4) {
      return (
        formData.clientName.trim().length >= 2 &&
        formData.clientEmail.trim().includes('@') &&
        formData.clientEmail.trim().includes('.') &&
        formData.clientPhone.trim().length >= 8
      );
    }
    return true;
  };

  // Can only navigate to targetStep if all previous steps 1..(targetStep-1) are valid
  const canNavigateToStep = (targetStep: number): boolean => {
    if (targetStep <= currentStep) return true;
    for (let s = 1; s < targetStep; s++) {
      if (!isStepValid(s)) return false;
    }
    return true;
  };

  const isFormComplete =
    isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4);

  const handleSubmitQuote = () => {
    if (!isFormComplete) return;

    // Protección Honeypot contra bots automatizados
    if (honeypot.trim() !== '') {
      return;
    }

    // Rate limiting: Cooldown de 20 segundos entre envíos sucesivos
    const cooldown = checkSubmissionCooldown('quote', 20);
    if (!cooldown.allowed) {
      setCooldownError(`Por favor espera ${cooldown.remainingSeconds}s antes de enviar otra cotización.`);
      return;
    }
    setCooldownError(null);

    const folioNumber = Math.floor(100 + Math.random() * 900);
    const formattedLoc = `${formData.cityZone}${
      formData.neighborhoodOrAddress ? ` • ${formData.neighborhoodOrAddress}` : ', Tamps.'
    }`;
    const resolvedCategory =
      formData.muralCategory === 'Otro tipo de mural' && formData.customMuralType?.trim()
        ? `Otro: ${formData.customMuralType.trim()}`
        : formData.muralCategory;

    // Sanitización exhaustiva contra inyecciones XSS y datos maliciosos
    const sanitizedData: QuoteFormData = {
      ...formData,
      clientName: sanitizeText(formData.clientName, 100),
      clientEmail: sanitizeText(formData.clientEmail, 100),
      clientPhone: sanitizeText(formData.clientPhone, 20),
      neighborhoodOrAddress: sanitizeText(formData.neighborhoodOrAddress, 200),
      themeAndDetails: sanitizeText(formData.themeAndDetails, 500),
      clientNotes: sanitizeText(formData.clientNotes, 500),
      customDimensions: sanitizeText(formData.customDimensions, 100),
      customMuralType: sanitizeText(formData.customMuralType, 100),
      muralCategory: resolvedCategory,
      clientLocation: formattedLoc,
    };

    const newTicket: QuoteTicket = {
      folio: `#MURAL-2026-${folioNumber}`,
      createdAt: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'nuevo',
      formData: sanitizedData,
      referenceArtTitle,
    };

    recordSubmission('quote');
    addQuoteTicket(newTicket);
    setCreatedTicket(newTicket);

    // Despacho directo a través del servicio de correos oficial
    sendClientQuoteConfirmation({
      clientName: newTicket.formData.clientName,
      clientEmail: newTicket.formData.clientEmail,
      clientPhone: newTicket.formData.clientPhone,
      folio: newTicket.folio,
      muralCategory: newTicket.formData.muralCategory,
      dimensions: newTicket.formData.dimensions,
      customDimensions: newTicket.formData.customDimensions,
      surfaceOrMaterial: newTicket.formData.surfaceOrMaterial,
      cityZone: newTicket.formData.cityZone,
      neighborhoodOrAddress: newTicket.formData.neighborhoodOrAddress,
      deadlineDate: newTicket.formData.deadlineDate,
      themeAndDetails: newTicket.formData.themeAndDetails,
    }).catch(console.error);

    sendStudioQuoteNotification({
      clientName: newTicket.formData.clientName,
      clientEmail: newTicket.formData.clientEmail,
      clientPhone: newTicket.formData.clientPhone,
      folio: newTicket.folio,
      muralCategory: newTicket.formData.muralCategory,
      dimensions: newTicket.formData.dimensions,
      customDimensions: newTicket.formData.customDimensions,
      surfaceOrMaterial: newTicket.formData.surfaceOrMaterial,
      cityZone: newTicket.formData.cityZone,
      neighborhoodOrAddress: newTicket.formData.neighborhoodOrAddress,
      deadlineDate: newTicket.formData.deadlineDate,
      themeAndDetails: newTicket.formData.themeAndDetails,
      referenceImagePreview: newTicket.formData.referenceImagePreview,
    }).catch(console.error);

    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FE3770', '#FC6408', '#FCDD1D', '#23B3F4', '#B0DC07', '#D77EF9'],
      });
    } catch {
      // ignore confetti error
    }

    setShowSuccessModal(true);
  };

  const getCategoryIcon = (id: string) => {
    if (id === 'comercial') return Building2;
    if (id === 'residencial') return Home;
    if (id === 'decoracion') return Sparkles;
    if (id === 'urbano') return Compass;
    return Palette;
  };

  const isOtherCategorySelected = formData.muralCategory === 'Otro tipo de mural';
  const activeCityData = allowedCities.find((c) => c.city === formData.cityZone) || allowedCities[0];

  return (
    <section id="cotizador" className="py-14 sm:py-24 md:py-32 bg-[#FBFBFA] relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-br from-naho-pink/[0.06] via-naho-orange/[0.04] to-naho-purple/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-naho-blue/[0.05] via-naho-green/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal variant="up" className="text-center max-w-3xl mx-auto mb-7 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-white border border-black/[0.08] text-neutral-900 shadow-2xs mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-naho-pink shrink-0" />
            <span>Exclusivo en Tampico, Cd. Madero y Altamira</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em] leading-[1.12]">
            Pide tu Propio Mural con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue">
              Nahomy
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Ya sea para tu <strong>negocio, casa, restaurante o decoración interior</strong>. Cuéntanos qué tipo de mural quieres, para cuándo lo buscas y adjunta una imagen opcional de tu idea.
          </p>
        </ScrollReveal>

        {/* Stepper Progress Bar (With clear labels on both mobile & desktop) */}
        <ScrollReveal variant="up" delay={80} className="max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="bg-black/[0.04] p-1.5 rounded-2xl sm:rounded-full border border-black/[0.05] grid grid-cols-4 gap-1 sm:gap-1.5 shadow-2xs backdrop-blur-md">
            {[
              { step: 1, shortLabel: 'Tipo', label: 'Tipo & Zona', icon: Palette },
              { step: 2, shortLabel: 'Medidas', label: 'Medidas', icon: Ruler },
              { step: 3, shortLabel: 'Idea', label: 'Idea, Fecha & Foto', icon: Calendar },
              { step: 4, shortLabel: 'Datos', label: 'Tus Datos', icon: User },
            ].map((s) => {
              const isCurrent = currentStep === s.step;
              const isPassed = currentStep > s.step && isStepValid(s.step);
              const isAllowed = canNavigateToStep(s.step);
              const StepIcon = s.icon;

              return (
                <button
                  key={s.step}
                  type="button"
                  disabled={!isAllowed}
                  onClick={() => {
                    if (isAllowed) goToStep(s.step);
                  }}
                  title={
                    isAllowed
                      ? `Ir al paso ${s.step}: ${s.label}`
                      : 'Completa los campos obligatorios del paso actual antes de avanzar'
                  }
                  className={`py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 text-xs font-semibold select-none ${
                    isCurrent
                      ? 'bg-white text-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.08)] cursor-pointer'
                      : isPassed
                        ? 'text-neutral-900 hover:bg-black/[0.03] cursor-pointer'
                        : isAllowed
                          ? 'text-neutral-600 hover:text-neutral-900 cursor-pointer'
                          : 'text-neutral-400/80 opacity-65 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-200 shrink-0 ${
                      isCurrent
                        ? 'bg-neutral-950 text-white'
                        : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/[0.07] text-neutral-500'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : !isAllowed ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      s.step
                    )}
                  </div>
                  <span className="sm:hidden text-[11px] font-bold tracking-tight leading-none">
                    {s.shortLabel}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 tracking-tight font-medium">
                    <StepIcon className="w-3.5 h-3.5 opacity-60 hidden md:inline" />
                    <span>{s.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <ScrollReveal variant="up" delay={140} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          <div className="lg:col-span-7 apple-card rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative">
            {/* Campo Honeypot oculto para atrapar y bloquear bots automáticos de spam */}
            <div className="opacity-0 absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <label htmlFor="quote-company-website">Empresa no llenar</label>
              <input
                id="quote-company-website"
                type="text"
                name="company_website"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            {cooldownError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{cooldownError}</span>
              </div>
            )}

            {/* STEP 1: Tipo de Mural (+ "Otro tipo de mural") y Ubicación */}
            {currentStep === 1 && (
              <div className={`space-y-5 sm:space-y-7 ${stepAnimClass}`}>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider bg-naho-pink/10 text-naho-pink">
                      Paso 1 de 4 • Categoría & Ubicación
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400">Obligatorio</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                    ¿Qué tipo de mural te gustaría pedir?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
                    Elige una categoría o selecciona &ldquo;Otro tipo de mural&rdquo; si buscas algo diferente.
                  </p>
                </div>

                {/* Dynamic Mural Categories + "Otro tipo de mural" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {muralCategories.map((cat) => {
                    const isSelected = formData.muralCategory === cat.label;
                    const Icon = getCategoryIcon(cat.id);

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            muralCategory: cat.label,
                          }))
                        }
                        className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-left transition-all duration-300 flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3 sm:gap-4 cursor-pointer active:scale-[0.99] ${
                          isSelected
                            ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-md'
                            : 'border border-black/[0.08] bg-white hover:border-black/25 text-neutral-900'
                        }`}
                      >
                        <div className="flex items-center sm:justify-between shrink-0">
                          <div
                            className={`p-2.5 rounded-xl sm:rounded-2xl ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : 'bg-naho-pink/10 text-naho-pink'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`hidden sm:flex w-5 h-5 rounded-full border items-center justify-center ${
                              isSelected ? 'border-white bg-white' : 'border-black/20'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-950" />}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug">
                            {cat.label}
                          </h4>
                          <p
                            className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {cat.description || 'Mural personalizado pintado 100% a mano.'}
                          </p>
                        </div>

                        <div
                          className={`sm:hidden w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-white bg-white' : 'border-black/20'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-950" />}
                        </div>
                      </button>
                    );
                  })}

                  {/* Option: "Otro tipo de mural" */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        muralCategory: 'Otro tipo de mural',
                      }))
                    }
                    className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-left transition-all duration-300 flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3 sm:gap-4 cursor-pointer active:scale-[0.99] ${
                      isOtherCategorySelected
                        ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-md'
                        : 'border border-black/[0.08] bg-white hover:border-black/25 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center sm:justify-between shrink-0">
                      <div
                        className={`p-2.5 rounded-xl sm:rounded-2xl ${
                          isOtherCategorySelected
                            ? 'bg-white/15 text-white'
                            : 'bg-naho-purple/15 text-naho-purple'
                        }`}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <div
                        className={`hidden sm:flex w-5 h-5 rounded-full border items-center justify-center ${
                          isOtherCategorySelected ? 'border-white bg-white' : 'border-black/20'
                        }`}
                      >
                        {isOtherCategorySelected && (
                          <span className="w-2 h-2 rounded-full bg-neutral-950" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug">
                        Otro tipo de mural
                      </h4>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none ${
                          isOtherCategorySelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        ¿Tienes una idea distinta que no aparece en las opciones? Especifícala aquí.
                      </p>
                    </div>

                    <div
                      className={`sm:hidden w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isOtherCategorySelected ? 'border-white bg-white' : 'border-black/20'
                      }`}
                    >
                      {isOtherCategorySelected && (
                        <span className="w-2 h-2 rounded-full bg-neutral-950" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Custom Mural Type Input when "Otro tipo de mural" is selected */}
                {isOtherCategorySelected && (
                  <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-naho-pink/[0.05] border border-naho-pink/25 animate-in fade-in duration-200">
                    <label
                      htmlFor={customMuralTypeId}
                      className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 block mb-2"
                    >
                      ¿Qué tipo de mural tienes en mente? (Obligatorio) *
                    </label>
                    <input
                      id={customMuralTypeId}
                      type="text"
                      required
                      placeholder="Ej. Consultorio pediátrico, salón de eventos, escuela, terraza..."
                      value={formData.customMuralType || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customMuralType: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-3 rounded-xl sm:rounded-2xl border border-black/[0.12] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                )}

                {/* Exclusive Coverage City Selector: Tampico, Ciudad Madero y Altamira */}
                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 border border-black/[0.06] space-y-3.5 sm:space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                      <MapPin className="w-4 h-4 text-naho-pink shrink-0" />
                      <span>¿En qué municipio se pintará el mural? *</span>
                    </span>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                      Servicio exclusivo en{' '}
                      <strong className="text-neutral-800">Tampico, Ciudad Madero y Altamira</strong>.
                    </p>
                  </div>

                  {/* 3-Column City Selector on Mobile & Desktop */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {allowedCities.map((item) => {
                      const isCitySelected = formData.cityZone === item.city;
                      return (
                        <button
                          key={item.city}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              cityZone: item.city,
                            }))
                          }
                          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-all cursor-pointer ${
                            isCitySelected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                              : 'border-black/[0.08] bg-white hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center justify-center sm:justify-between gap-1 sm:mb-1">
                            <span className="font-extrabold text-xs truncate">
                              <span className="sm:hidden">{item.shortLabel}</span>
                              <span className="hidden sm:inline">{item.city}</span>
                            </span>
                            {isCitySelected && (
                              <CheckCircle className="w-3.5 h-3.5 text-naho-pink shrink-0 hidden sm:inline" />
                            )}
                          </div>
                          <span
                            className={`hidden sm:block text-[10px] leading-snug ${
                              isCitySelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile selected city coverage note */}
                  <p className="sm:hidden text-[11px] text-neutral-500 bg-white/80 px-3 py-2 rounded-xl border border-black/[0.04]">
                    <strong className="text-neutral-800">{activeCityData.city}:</strong>{' '}
                    {activeCityData.desc}
                  </p>

                  <div>
                    <label
                      htmlFor={neighborhoodId}
                      className="text-xs font-semibold text-neutral-700 block mb-1.5"
                    >
                      Colonia o zona aproximada en {formData.cityZone} (Opcional):
                    </label>
                    <input
                      id={neighborhoodId}
                      type="text"
                      placeholder={`Ej. Col. Minerva en ${formData.cityZone}, o nombre de tu local...`}
                      value={formData.neighborhoodOrAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, neighborhoodOrAddress: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Dimensiones y Superficie */}
            {currentStep === 2 && (
              <div className={`space-y-5 sm:space-y-7 ${stepAnimClass}`}>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider bg-naho-blue/10 text-naho-blue">
                      Paso 2 de 4 • Tamaño del Muro
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400">Obligatorio</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                    Dimensiones aproximadas del mural
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Selecciona un tamaño estimado o escribe las medidas de tu pared.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {muralDimensionPresets.map((preset, idx) => {
                    const isSelected = formData.dimensions === preset.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dimensions: preset.label,
                            surfaceOrMaterial: preset.surface,
                          }))
                        }
                        className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                            : 'border-black/[0.08] bg-white hover:bg-neutral-50 text-neutral-900'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <span
                            className={`w-4 h-4 mt-0.5 sm:mt-0 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-white bg-white' : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <p className="font-bold text-xs sm:text-sm leading-snug">{preset.label}</p>
                              {preset.popular && (
                                <span
                                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  Más solicitado
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] sm:text-xs font-mono mt-0.5 ${
                                isSelected ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                            >
                              Superficie: {preset.surface}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label
                    htmlFor={customDimensionsId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-600 block mb-2"
                  >
                    {formData.dimensions === 'Medidas especiales personalizadas'
                      ? 'Escribe las medidas aproximadas de tu pared (Obligatorio) *'
                      : '¿Tienes las medidas exactas o detalles de la pared? (Opcional):'}
                  </label>
                  <input
                    id={customDimensionsId}
                    type="text"
                    required={formData.dimensions === 'Medidas especiales personalizadas'}
                    placeholder="Ej. 3.50m de ancho x 2.60m de alto, pared interior lisa..."
                    value={formData.customDimensions}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customDimensions: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] text-base sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Idea, Cuándo lo quiere / Fecha específica e Imagen Opcional */}
            {currentStep === 3 && (
              <div className={`space-y-5 sm:space-y-7 ${stepAnimClass}`}>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider bg-naho-orange/10 text-naho-orange">
                      Paso 3 de 4 • Idea, Fecha & Foto
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400">Obligatorio</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                    ¿Cómo quieres tu mural y para cuándo lo buscas?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Describe tu idea, indícanos para cuándo lo quieres y sube una foto opcional de referencia.
                  </p>
                </div>

                {/* Idea description */}
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Ideas rápidas (Toca para agregar):
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {themeIdeaPresets.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            themeAndDetails: prev.themeAndDetails
                              ? `${prev.themeAndDetails}, ${tag}`
                              : tag,
                          }))
                        }
                        className="text-[11px] sm:text-xs px-3 py-1.5 rounded-xl sm:rounded-full border border-black/[0.06] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium cursor-pointer text-left"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <label
                    htmlFor={themeDetailsId}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2 flex flex-wrap items-center justify-between gap-1"
                  >
                    <span>Describe tu idea de mural *</span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-normal text-neutral-400">
                      {formData.themeAndDetails.trim().length} car. (mín. 5)
                    </span>
                  </label>
                  <textarea
                    id={themeDetailsId}
                    rows={3}
                    required
                    placeholder="Ej. Quiero un mural para mi negocio en Tampico con elementos botánicos, flores y el nombre de nuestra marca..."
                    value={formData.themeAndDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, themeAndDetails: e.target.value }))
                    }
                    className="w-full px-3.5 py-3 rounded-2xl border border-black/[0.1] text-base sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
                  />
                </div>

                {/* ¿Cuándo lo quiere o si tiene una fecha específica? */}
                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 border border-black/[0.06] space-y-3.5 sm:space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-naho-orange shrink-0" />
                    <span>¿Para cuándo buscas tu mural? *</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          datePreferenceType: 'especifica',
                          deadlineDate: prev.deadlineDate.includes('-') ? prev.deadlineDate : '',
                        }))
                      }
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left text-xs font-bold cursor-pointer transition-all ${
                        formData.datePreferenceType === 'especifica'
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-black/[0.08] bg-white text-neutral-700'
                      }`}
                    >
                      📅 Fecha específica
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          datePreferenceType: 'flexible',
                          deadlineDate: 'Lo antes posible (Este mes)',
                        }))
                      }
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left text-xs font-bold cursor-pointer transition-all ${
                        formData.datePreferenceType === 'flexible'
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-black/[0.08] bg-white text-neutral-700'
                      }`}
                    >
                      ✨ Fecha flexible
                    </button>
                  </div>

                  {formData.datePreferenceType === 'especifica' ? (
                    <div>
                      <label
                        htmlFor={deadlineDateId}
                        className="text-xs font-semibold text-neutral-600 block mb-1.5"
                      >
                        Selecciona la fecha deseada: *
                      </label>
                      <input
                        id={deadlineDateId}
                        type="date"
                        required
                        value={
                          formData.deadlineDate.includes('-') ? formData.deadlineDate : ''
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, deadlineDate: e.target.value }))
                        }
                        className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-black/[0.1] text-base sm:text-sm bg-white font-mono"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Lo antes posible (Este mes)',
                        'En las próximas 2 a 3 semanas',
                        'Para el próximo mes',
                      ].map((flexLabel) => (
                        <button
                          key={flexLabel}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, deadlineDate: flexLabel }))
                          }
                          className={`px-3.5 py-2 rounded-xl sm:rounded-full text-xs font-semibold cursor-pointer ${
                            formData.deadlineDate === flexLabel
                              ? 'bg-naho-pink text-white'
                              : 'bg-white border border-black/[0.08] text-neutral-700'
                          }`}
                        >
                          {flexLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Imagen Opcional de cómo quiere su mural */}
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-neutral-50/70 border border-black/[0.06]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-naho-pink shrink-0" />
                      <span>Imagen de referencia o foto del muro (Opcional)</span>
                    </label>
                  </div>

                  <p className="text-xs text-neutral-500 mb-3.5 leading-relaxed">
                    Adjunta una idea de referencia, boceto o foto del muro donde quieres tu mural.
                  </p>

                  {formData.referenceImagePreview ? (
                    <div className="relative bg-white rounded-2xl p-3 sm:p-4 border border-black/[0.06] shadow-xs flex items-center gap-3 sm:gap-4">
                      <img
                        src={formData.referenceImagePreview}
                        alt="Previsualización de referencia"
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Imagen lista
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate mt-1">
                          {formData.referenceImageName || 'Imagen seleccionada'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(imageUploadInputId);
                            if (input) input.click();
                          }}
                          className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                          title="Cambiar imagen"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2.5 rounded-full bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-500 transition-colors cursor-pointer"
                          title="Eliminar imagen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all cursor-pointer select-none ${
                        isDragging
                          ? 'border-neutral-950 bg-white scale-[1.01]'
                          : 'border-black/15 hover:border-neutral-950 bg-white/80 hover:bg-white'
                      }`}
                    >
                      <input
                        id={imageUploadInputId}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleImageChange}
                        disabled={isUploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                        <div className="p-2.5 sm:p-3 rounded-full bg-black/[0.04] text-neutral-900">
                          <Upload className={`w-5 h-5 ${isUploadingImage ? 'animate-bounce' : ''}`} />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-neutral-800">
                          {isUploadingImage ? (
                            'Procesando y subiendo imagen...'
                          ) : (
                            <>
                              Toca aquí para{' '}
                              <span className="text-naho-pink underline">subir una foto</span>
                              <span className="hidden sm:inline"> o arrástrala</span>
                            </>
                          )}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Opcional • PNG, JPG, WEBP (máx. 10 MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Nombre, Correo y Número de Teléfono */}
            {currentStep === 4 && (
              <div className={`space-y-5 sm:space-y-7 ${stepAnimClass}`}>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-700">
                      Paso 4 de 4 • Tus Datos de Contacto
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400">Obligatorio</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                    Nombre, correo y teléfono
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Ingresa tus datos para enviarte la confirmación de tu cotización de mural.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={clientNameId}
                      className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5"
                    >
                      Tu Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                      <input
                        id={clientNameId}
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Ej. Mariana Garza"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, clientName: e.target.value }))
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.1] text-base bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={clientEmailId}
                        className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5"
                      >
                        Correo Electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                        <input
                          id={clientEmailId}
                          type="email"
                          required
                          autoComplete="email"
                          spellCheck={false}
                          placeholder="tu@correo.com"
                          value={formData.clientEmail}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.1] text-base bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Recibirás la confirmación de envío en este correo
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={clientPhoneId}
                        className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5"
                      >
                        Número de Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                        <input
                          id={clientPhoneId}
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="Ej. 833 123 4567"
                          value={formData.clientPhone}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, clientPhone: e.target.value }))
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.1] text-base bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        10 dígitos para dar seguimiento a tu proyecto
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={clientNotesId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5"
                  >
                    Comentarios adicionales (Opcional):
                  </label>
                  <input
                    id={clientNotesId}
                    type="text"
                    value={formData.clientNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, clientNotes: e.target.value }))
                    }
                    placeholder="Ej. El local está en segundo piso, o horario preferido para visita..."
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] text-base sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="mt-7 sm:mt-10 pt-5 sm:pt-6 border-t border-black/[0.05] flex items-center justify-between gap-2.5">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep - 1)}
                  className="px-4 sm:px-5 py-3.5 sm:py-2.5 rounded-2xl sm:rounded-full border border-black/[0.08] text-neutral-700 hover:bg-neutral-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  disabled={!isStepValid(currentStep)}
                  onClick={() => {
                    if (isStepValid(currentStep)) {
                      goToStep(currentStep + 1);
                    }
                  }}
                  className={`flex-1 sm:flex-initial px-6 sm:px-7 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-xs sm:text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isStepValid(currentStep)
                      ? 'btn-shimmer bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm cursor-pointer'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>Siguiente paso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isFormComplete}
                  onClick={handleSubmitQuote}
                  className={`flex-1 sm:flex-initial px-6 sm:px-7 py-3.5 sm:py-3 rounded-2xl sm:rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isFormComplete
                      ? 'btn-shimmer bg-neutral-950 hover:bg-naho-pink text-white shadow-md cursor-pointer'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>Enviar Cotización de Mural</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Summary */}
          <div className="lg:col-span-5">
            <LiveSummary
              formData={formData}
              currentStep={currentStep}
              totalSteps={totalSteps}
              isFormValid={isFormComplete}
              onSubmitQuote={handleSubmitQuote}
              referenceArtTitle={referenceArtTitle}
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Clean Client Confirmation Modal */}
      {showSuccessModal && createdTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-9 max-w-lg w-full border border-black/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.4)] space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                FOLIO DE SOLICITUD: {createdTicket.folio}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                ¡Tu Cotización se Envió con Éxito!
              </h3>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
                Hemos enviado un correo de confirmación a{' '}
                <strong className="text-neutral-800">{formData.clientEmail}</strong>. Nahomy revisará los detalles de tu mural en{' '}
                <strong className="text-neutral-800">{formData.cityZone}</strong> y se pondrá en contacto contigo muy pronto.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] text-left text-xs space-y-1.5 text-neutral-600">
              <p>
                <strong className="text-neutral-900">Tipo de Mural:</strong>{' '}
                {createdTicket.formData.muralCategory}
              </p>
              <p>
                <strong className="text-neutral-900">Ubicación:</strong>{' '}
                {createdTicket.formData.cityZone}, Tamaulipas
              </p>
              <p>
                <strong className="text-neutral-900">Fecha solicitada:</strong>{' '}
                {createdTicket.formData.deadlineDate}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Entendido, volver al sitio
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
