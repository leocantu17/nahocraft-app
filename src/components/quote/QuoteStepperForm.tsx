import React, { useState, useId } from 'react';
import {
  QuoteFormData,
  MuralCityZone,
  QuoteTicket,
} from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import { LiveSummary } from './LiveSummary';
import confetti from 'canvas-confetti';
import { sendClientQuoteConfirmation, sendStudioQuoteNotification } from '../../emails';
import { compressImageFile } from '../../utils/imageCompressor';
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
  const totalSteps = 4;

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

  const allowedCities: { city: MuralCityZone; desc: string }[] = [
    { city: 'Tampico', desc: 'Zona Centro, Minerva, Lomas de Rosales, Hidalgo y alrededores' },
    { city: 'Ciudad Madero', desc: 'Playa Miramar, Unidad Nacional, Centro y colonias' },
    { city: 'Altamira', desc: 'Zona Centro, Residenciales, Corredor Urbano e Industrial' },
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

    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.8);
      setFormData((prev) => ({
        ...prev,
        referenceImagePreview: compressedDataUrl,
        referenceImageName: file.name,
      }));
    } catch {
      alert('No se pudo procesar la imagen seleccionada.');
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

    const folioNumber = Math.floor(100 + Math.random() * 900);
    const formattedLoc = `${formData.cityZone}${formData.neighborhoodOrAddress ? ` • ${formData.neighborhoodOrAddress}` : ', Tamps.'
      }`;
    const resolvedCategory =
      formData.muralCategory === 'Otro tipo de mural' && formData.customMuralType?.trim()
        ? `Otro: ${formData.customMuralType.trim()}`
        : formData.muralCategory;

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
      formData: {
        ...formData,
        muralCategory: resolvedCategory,
        clientLocation: formattedLoc,
      },
      referenceArtTitle,
    };

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

  return (
    <section id="cotizador" className="py-24 md:py-32 bg-[#FBFBFA] relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-br from-naho-pink/[0.06] via-naho-orange/[0.04] to-naho-purple/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-naho-blue/[0.05] via-naho-green/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-black/[0.08] text-neutral-900 shadow-2xs mb-4">
            <MapPin className="w-3.5 h-3.5 text-naho-pink" />
            Servicio Exclusivo en Tampico, Ciudad Madero y Altamira
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em]">
            Pide tu Propio Mural con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue">
              Nahomy
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Ya sea para tu <strong>negocio, casa, restaurante o decoración interior</strong>. Cuéntanos qué tipo de mural quieres, para cuándo lo buscas y adjunta una imagen opcional de tu idea.
          </p>
        </div>

        {/* Stepper Progress Bar (Locked unless previous steps are valid) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-black/[0.03] p-1.5 rounded-full border border-black/[0.05] grid grid-cols-4 gap-1 shadow-2xs backdrop-blur-md">
            {[
              { step: 1, label: 'Tipo & Zona', icon: Palette },
              { step: 2, label: 'Medidas', icon: Ruler },
              { step: 3, label: 'Idea, Fecha & Foto', icon: Calendar },
              { step: 4, label: 'Tus Datos', icon: User },
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
                    if (isAllowed) setCurrentStep(s.step);
                  }}
                  title={
                    isAllowed
                      ? `Ir al paso ${s.step}: ${s.label}`
                      : 'Completa los campos obligatorios del paso actual antes de avanzar'
                  }
                  className={`py-2.5 px-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-xs font-semibold select-none ${isCurrent
                    ? 'bg-white text-neutral-950 shadow-[0_4px_16px_rgba(0,0,0,0.08)] scale-[1.01] cursor-pointer'
                    : isPassed
                      ? 'text-neutral-900 hover:bg-black/[0.03] cursor-pointer'
                      : isAllowed
                        ? 'text-neutral-600 hover:text-neutral-900 cursor-pointer'
                        : 'text-neutral-400/70 opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-200 ${isCurrent
                      ? 'bg-neutral-950 text-white scale-110'
                      : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-black/[0.06] text-neutral-400'
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
                  <span className="hidden sm:inline tracking-tight font-medium flex items-center gap-1.5">
                    <StepIcon className="w-3.5 h-3.5 opacity-60 hidden md:inline" />
                    <span>{s.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 apple-card rounded-[2.5rem] p-7 sm:p-10 border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            {/* STEP 1: Tipo de Mural (+ "Otro tipo de mural") y Ubicación */}
            {currentStep === 1 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-pink">
                    Paso 1 de 4 • Categoría de Mural & Ubicación (Obligatorio)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    ¿Qué tipo de mural te gustaría pedir?
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Elige la categoría de tu mural o selecciona &ldquo;Otro tipo de mural&rdquo; si buscas algo diferente.
                  </p>
                </div>

                {/* Dynamic Mural Categories + "Otro tipo de mural" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        className={`p-5 rounded-3xl text-left transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer active:scale-[0.98] ${isSelected
                          ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-lg'
                          : 'border border-black/[0.08] bg-white hover:border-black/25 text-neutral-900'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-2.5 rounded-2xl ${isSelected ? 'bg-white/15 text-white' : 'bg-naho-pink/10 text-naho-pink'
                              }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-black/20'
                              }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-950" />}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-base tracking-tight">{cat.label}</h4>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                          >
                            {cat.description || 'Mural personalizado pintado 100% a mano.'}
                          </p>
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
                    className={`p-5 rounded-3xl text-left transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer active:scale-[0.98] ${isOtherCategorySelected
                      ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-lg'
                      : 'border border-black/[0.08] bg-white hover:border-black/25 text-neutral-900'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-2.5 rounded-2xl ${isOtherCategorySelected
                          ? 'bg-white/15 text-white'
                          : 'bg-naho-purple/15 text-naho-purple'
                          }`}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${isOtherCategorySelected ? 'border-white bg-white' : 'border-black/20'
                          }`}
                      >
                        {isOtherCategorySelected && (
                          <span className="w-2 h-2 rounded-full bg-neutral-950" />
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base tracking-tight">
                        Otro tipo de mural
                      </h4>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${isOtherCategorySelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                      >
                        ¿Tienes una idea o proyecto distinto que no aparece en las opciones? Especifícalo aquí.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Custom Mural Type Input when "Otro tipo de mural" is selected */}
                {isOtherCategorySelected && (
                  <div className="p-5 rounded-3xl bg-naho-pink/[0.05] border border-naho-pink/25 animate-in fade-in duration-200">
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
                      placeholder="Ej. Mural para consultorio pediátrico, salón de eventos, escuela, terraza..."
                      value={formData.customMuralType || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customMuralType: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-black/[0.12] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                )}

                {/* Exclusive Coverage City Selector: Tampico, Ciudad Madero y Altamira */}
                <div className="p-5 rounded-3xl bg-neutral-50 border border-black/[0.06] space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                      <MapPin className="w-4 h-4 text-naho-pink" />
                      ¿En qué municipio se pintará el mural? *
                    </span>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Importante: Nuestro servicio de muralismo está disponible exclusivamente en{' '}
                      <strong className="text-neutral-800">Tampico, Ciudad Madero y Altamira</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${isCitySelected
                            ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                            : 'border-black/[0.08] bg-white hover:bg-neutral-100 text-neutral-800'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-xs">{item.city}</span>
                            {isCitySelected && <CheckCircle className="w-3.5 h-3.5 text-naho-pink" />}
                          </div>
                          <span
                            className={`text-[10px] block leading-snug ${isCitySelected ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                          >
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

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
                      className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Dimensiones y Superficie */}
            {currentStep === 2 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-blue">
                    Paso 2 de 4 • Tamaño del Muro (Obligatorio)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    Dimensiones aproximadas del mural
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Selecciona un tamaño estimado o escribe las medidas de tu pared.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {muralDimensionPresets.map((preset, idx) => {
                    const isSelected = formData.dimensions === preset.label;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dimensions: preset.label,
                            surfaceOrMaterial: preset.surface,
                          }))
                        }
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                          : 'border-black/[0.08] bg-white hover:bg-neutral-50 text-neutral-900'
                          }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-white bg-white' : 'border-neutral-300'
                              }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm">{preset.label}</p>
                              {preset.popular && (
                                <span
                                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                >
                                  Más solicitado
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'
                                }`}
                            >
                              Superficie: {preset.surface}
                            </p>
                          </div>
                        </div>
                      </div>
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
                    className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.1] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Idea, Cuándo lo quiere / Fecha específica e Imagen Opcional (SIN colores) */}
            {currentStep === 3 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-orange">
                    Paso 3 de 4 • Idea, Fecha & Foto Opcional (Obligatorio)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    ¿Cómo quieres tu mural y para cuándo lo buscas?
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Describe tu idea, indícanos para cuándo lo quieres y sube una imagen opcional de referencia.
                  </p>
                </div>

                {/* Idea description */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Ideas rápidas (Haz clic para agregar):
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
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
                        className="text-xs px-3 py-1.5 rounded-full border border-black/[0.06] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <label
                    htmlFor={themeDetailsId}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2 flex items-center justify-between"
                  >
                    <span>Describe cómo quieres que sea tu mural (Obligatorio) *</span>
                    <span className="text-[11px] font-mono font-normal text-neutral-400">
                      {formData.themeAndDetails.trim().length} caracteres (mín. 5)
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
                    className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.1] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
                  />
                </div>

                {/* ¿Cuándo lo quiere o si tiene una fecha específica? */}
                <div className="p-5 rounded-3xl bg-neutral-50 border border-black/[0.06] space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-naho-orange" />
                    <span>¿Cuándo quieres tu mural o tienes una fecha específica? (Obligatorio) *</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          datePreferenceType: 'especifica',
                          deadlineDate: prev.deadlineDate.includes('-') ? prev.deadlineDate : '',
                        }))
                      }
                      className={`p-3 rounded-2xl border text-left text-xs font-bold cursor-pointer transition-all ${formData.datePreferenceType === 'especifica'
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-black/[0.08] bg-white text-neutral-700'
                        }`}
                    >
                      📅 Tengo una fecha específica
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
                      className={`p-3 rounded-2xl border text-left text-xs font-bold cursor-pointer transition-all ${formData.datePreferenceType === 'flexible'
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-black/[0.08] bg-white text-neutral-700'
                        }`}
                    >
                      ✨ Fecha flexible / Próximas semanas
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
                        className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-black/[0.1] text-sm bg-white font-mono"
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
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${formData.deadlineDate === flexLabel
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
                <div className="p-6 rounded-[2rem] bg-neutral-50/70 border border-black/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-naho-pink" />
                      <span>Imagen sobre cómo quieres tu mural (Opcional)</span>
                    </label>
                  </div>

                  <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                    Puedes adjuntar una imagen de referencia, boceto o foto del muro donde quieres tu mural.
                  </p>

                  {formData.referenceImagePreview ? (
                    <div className="relative bg-white rounded-2xl p-4 border border-black/[0.06] shadow-xs flex items-center gap-4">
                      <img
                        src={formData.referenceImagePreview}
                        alt="Previsualización de referencia"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Imagen adjunta
                        </span>
                        <p className="text-sm font-bold text-neutral-900 truncate mt-1">
                          {formData.referenceImageName || 'Imagen seleccionada'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
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
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${isDragging
                        ? 'border-neutral-950 bg-white scale-[1.01]'
                        : 'border-black/15 hover:border-neutral-950 bg-white/80 hover:bg-white'
                        }`}
                    >
                      <input
                        id={imageUploadInputId}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-3 rounded-full bg-black/[0.04] text-neutral-900">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-neutral-800">
                          Arrastra una imagen aquí o{' '}
                          <span className="text-naho-pink underline">haz clic para subir foto</span>
                        </p>
                        <p className="text-xs text-neutral-400 font-mono">
                          Opcional • PNG, JPG, WEBP (hasta 10 MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Nombre, Correo y Número de Teléfono (SIN "Canal de contacto preferido") */}
            {currentStep === 4 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-emerald-600">
                    Paso 4 de 4 • Tus Datos de Contacto (Obligatorio)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    Nombre, correo y número de teléfono
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Ingresa tus datos para enviarte la confirmación de tu cotización de mural.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={clientNameId}
                      className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2"
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
                        className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2"
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
                        className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2"
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
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
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
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="mt-10 pt-6 border-t border-black/[0.05] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.08] text-neutral-700 hover:bg-neutral-100 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  disabled={!isStepValid(currentStep)}
                  onClick={() => {
                    if (isStepValid(currentStep)) {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                  className={`px-7 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 ${isStepValid(currentStep)
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm cursor-pointer'
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
                  className={`px-7 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 ${isFormComplete
                    ? 'bg-neutral-950 hover:bg-naho-pink text-white shadow-md cursor-pointer'
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
        </div>
      </div>

      {/* Clean Client Confirmation Modal */}
      {showSuccessModal && createdTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-7 sm:p-9 max-w-lg w-full border border-black/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.4)] space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                FOLIO DE SOLICITUD: {createdTicket.folio}
              </span>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
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
