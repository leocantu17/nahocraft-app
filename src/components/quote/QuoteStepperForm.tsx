import { useState, useId } from 'react';
import { QuoteFormData, ProjectType, PreferredContactMethod, QuoteTicket } from '../../types';
import { LiveSummary } from './LiveSummary';
import { StudioAdminPreviewModal } from './StudioAdminPreviewModal';
import confetti from 'canvas-confetti';
import {
  Palette,
  Shirt,
  ShoppingBag,
  Sparkles,
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
  Inbox,
  MessageCircle,
  Check,
} from 'lucide-react';

interface QuoteStepperFormProps {
  initialProjectType?: ProjectType;
  referenceArtTitle?: string;
}

export function QuoteStepperForm({
  initialProjectType = 'mural',
  referenceArtTitle,
}: QuoteStepperFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<QuoteFormData>({
    projectType: initialProjectType,
    dimensions: 'Mural mediano (aprox. 3m x 2m)',
    customDimensions: '',
    surfaceOrMaterial: 'Pared lisa en interior',
    colorPalette: 'Vibrante Nahocraft (Fucsia, Naranja, Amarillo, Azul)',
    themeAndDetails: '',
    deadlineDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    preferredContact: 'whatsapp',
    clientLocation: 'Tampico, Tamps.',
    clientNotes: '',
    referenceImagePreview: undefined,
    referenceImageName: undefined,
  });

  const [createdTicket, setCreatedTicket] = useState<QuoteTicket | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdminPanelModal, setShowAdminPanelModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Accessibility IDs
  const customDimensionsId = useId();
  const themeDetailsId = useId();
  const deadlineDateId = useId();
  const clientNameId = useId();
  const clientEmailId = useId();
  const clientPhoneId = useId();
  const clientLocationId = useId();
  const clientNotesId = useId();
  const imageUploadInputId = useId();

  // Presets based on project type
  const dimensionPresets: Record<ProjectType, { label: string; surface: string; popular?: boolean }[]> = {
    mural: [
      { label: 'Mural mediano (aprox. 3m x 2m)', surface: 'Pared lisa en interior', popular: true },
      { label: 'Mural comercial gran formato (5m x 3m)', surface: 'Fachada o muro comercial exterior' },
      { label: 'Mural decorativo boutique (2m x 2m)', surface: 'Pared interior de negocio / casa' },
      { label: 'Medidas especiales personalizadas', surface: 'Por inspeccionar en sitio' },
    ],
    ropa: [
      { label: 'Chamarra Denim (Intervención espalda completa)', surface: 'Mezclilla / Denim pesado', popular: true },
      { label: 'Chamarra Denim (Espalda + detalles cuello/mangas)', surface: 'Mezclilla vintage / nueva' },
      { label: 'Prenda propia del cliente a intervenir', surface: 'Algodón, mezclilla o lona' },
      { label: 'Prenda provista por Nahocraft a medida', surface: 'Textil seleccionado de autor' },
    ],
    totebag: [
      { label: '1 Totebag de Lienzo (38 x 42 cm)', surface: 'Lona 100% algodón grueso', popular: true },
      { label: 'Pack Colección (3 a 5 piezas ilustradas)', surface: 'Lona 100% algodón premium' },
      { label: 'Lote personalizado para eventos (6+ piezas)', surface: 'Lienzo artesanal' },
    ],
    otro: [
      { label: 'Intervención en soporte especial', surface: 'Madera, calzado, accesorios u otro', popular: true },
      { label: 'Cuadro en bastidor / Lienzo artístico', surface: 'Lienzo montado en madera' },
    ],
  };

  // Artistic palettes / creative color moods
  const artisticPalettes = [
    {
      id: 'vibrante',
      name: 'Vibrante Nahocraft',
      description: 'Estilo icónico del taller: lleno de vida, alegría y energía tropical',
      colors: ['#FE3770', '#FC6408', '#FCDD1D', '#23B3F4'],
    },
    {
      id: 'pastel',
      name: 'Pastel & Floral',
      description: 'Delicado, romántico y sutil con tonalidades suaves',
      colors: ['#F9A8D4', '#C4B5FD', '#A7F3D0', '#FEF08A'],
    },
    {
      id: 'organico',
      name: 'Orgánico & Botánico',
      description: 'Tonos cálidos inspirados en la tierra, hojas y naturaleza',
      colors: ['#B45309', '#65A30D', '#D97706', '#78350F'],
    },
    {
      id: 'contraste',
      name: 'Alto Contraste Urbano',
      description: 'Base oscura con destellos de color gráfico audaz',
      colors: ['#171717', '#FFFFFF', '#FE3770', '#38BDF8'],
    },
    {
      id: 'libre',
      name: 'Libre Elección por Nahomy',
      description: 'Deja que la artista diseñe la armonía perfecta según tu espacio',
      colors: ['#FE3770', '#FCDD1D', '#B0DC07', '#D77EF9'],
    },
  ];

  const themeIdeaPresets = [
    'Botánico, hojas y naturaleza tropical',
    'Identidad de marca / Logotipo / Branding comercial',
    'Retrato ilustrado / Personaje favorito',
    'Cultura pop / Homenaje musical (Eras Tour, festivales)',
    'Propuesta artística libre por Nahomy',
  ];

  const quickZones = [
    'Tampico, Tamps.',
    'Cd. Madero, Tamps.',
    'Altamira, Tamps.',
    'Envío Nacional (México)',
  ];

  const handleProjectTypeChange = (type: ProjectType) => {
    const defaultPreset = dimensionPresets[type][0];
    setFormData((prev) => ({
      ...prev,
      projectType: type,
      dimensions: defaultPreset.label,
      surfaceOrMaterial: defaultPreset.surface,
    }));
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, etc.).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        referenceImagePreview: result,
        referenceImageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
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

  const isStepValid = (step: number): boolean => {
    if (step === 1) return Boolean(formData.projectType);
    if (step === 2) return Boolean(formData.dimensions);
    if (step === 3) return formData.themeAndDetails.trim().length >= 4;
    if (step === 4)
      return (
        formData.clientName.trim().length >= 2 &&
        formData.clientEmail.trim().includes('@') &&
        formData.clientPhone.trim().length >= 8
      );
    return true;
  };

  const isFormComplete =
    Boolean(formData.projectType) &&
    Boolean(formData.dimensions) &&
    formData.themeAndDetails.trim().length >= 4 &&
    formData.clientName.trim().length >= 2 &&
    formData.clientEmail.trim().includes('@') &&
    formData.clientPhone.trim().length >= 8;

  const buildOfficialSummary = () => {
    const projectLabels: Record<ProjectType, string> = {
      mural: 'Mural Artístico (Comercial / Residencial)',
      ropa: 'Diseño de Ropa & Custom Denim',
      totebag: 'Totebag Artesanal en Lienzo',
      otro: 'Proyecto Artístico Personalizado',
    };

    let msg = `🎨 FICHA DE COTIZACIÓN - NAHOCRAFT CENTRO DE ARTE\n`;
    msg += `═══════════════════════════════════════════════════\n\n`;
    if (referenceArtTitle) {
      msg += `✨ Obra de inspiración: "${referenceArtTitle}"\n\n`;
    }
    msg += `📋 DETALLES TÉCNICOS:\n`;
    msg += `• Disciplina: ${projectLabels[formData.projectType]}\n`;
    msg += `• Dimensiones: ${formData.dimensions}${
      formData.customDimensions ? ` (Detalle: ${formData.customDimensions})` : ''
    }\n`;
    msg += `• Soporte / Superficie: ${formData.surfaceOrMaterial || 'Por coordinar'}\n`;
    msg += `• Paleta o Vibra: ${formData.colorPalette || 'Elección libre por Nahomy'}\n`;
    msg += `• Idea / Visión: ${formData.themeAndDetails}\n`;

    if (formData.referenceImageName) {
      msg += `• Imagen de referencia: Adjunta (${formData.referenceImageName})\n`;
    }

    msg += `• Fecha límite: ${formData.deadlineDate || 'Flexible / A coordinar'}\n\n`;

    msg += `👤 DATOS DEL CLIENTE:\n`;
    msg += `• Nombre: ${formData.clientName}\n`;
    msg += `• Correo: ${formData.clientEmail}\n`;
    msg += `• Teléfono: ${formData.clientPhone}\n`;
    msg += `• Canal de contacto preferido: ${formData.preferredContact.toUpperCase()}\n`;
    msg += `• Ubicación / Zona: ${formData.clientLocation}\n`;
    if (formData.clientNotes.trim()) {
      msg += `• Notas adicionales: ${formData.clientNotes}\n`;
    }
    msg += `\n📍 Enviado para registro en panel oficial y correo de Nahomy (Tampico, Tamps.)`;

    return msg;
  };

  // Submit quote handler (official workflow)
  const handleSubmitQuote = () => {
    if (!isFormComplete) return;

    // Generate ticket for production dashboard
    const folioNumber = Math.floor(100 + Math.random() * 900);
    const newTicket: QuoteTicket = {
      folio: `#NC-2026-${folioNumber}`,
      createdAt: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'nuevo',
      formData: { ...formData },
      referenceArtTitle,
    };

    setCreatedTicket(newTicket);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FE3770', '#FC6408', '#FCDD1D', '#23B3F4', '#B0DC07', '#D77EF9'],
      });
    } catch {
      // Ignore confetti error
    }

    setShowSuccessModal(true);
  };

  const openWhatsAppFallback = () => {
    const summary = buildOfficialSummary();
    const encoded = encodeURIComponent(
      `🎨 ¡Hola Nahomy! Registré mi cotización ${createdTicket?.folio || ''} en la web:\n\n${summary}`
    );
    window.open(`https://wa.me/528333655622?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="cotizador" className="py-24 md:py-32 bg-[#FBFBFA] relative overflow-hidden">
      {/* Background artistic ambient lighting with Nahocraft palette */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-br from-naho-pink/[0.06] via-naho-orange/[0.04] to-naho-purple/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-naho-blue/[0.05] via-naho-green/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title (Apple editorial typography + artistic soul) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-black/[0.06] text-neutral-800 shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-naho-pink to-naho-orange" />
            Configurador de Obras & Proyectos Artísticos
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-[-0.035em]">
            Diseña tu Obra con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-blue">
              Nahomy
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Personaliza el formato, la técnica y la vibra cromática de tu proyecto en 4 pasos. Tu solicitud ingresará al panel de trabajo y correo oficial del estudio para recibir una propuesta formal.
          </p>
        </div>

        {/* Stepper Progress Bar (Apple Segmented Capsule Indicator) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-black/[0.03] p-1.5 rounded-full border border-black/[0.05] grid grid-cols-4 gap-1 shadow-2xs backdrop-blur-md">
            {[
              { step: 1, label: 'Tipo de Obra', icon: Palette },
              { step: 2, label: 'Dimensiones', icon: Ruler },
              { step: 3, label: 'Arte & Paleta', icon: Calendar },
              { step: 4, label: 'Contacto', icon: User },
            ].map((s) => {
              const isCurrent = currentStep === s.step;
              const isPassed = currentStep > s.step;
              const StepIcon = s.icon;

              return (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`py-2.5 px-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-xs font-semibold select-none cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-neutral-950 shadow-[0_4px_16px_rgba(0,0,0,0.08)] scale-[1.01]'
                      : isPassed
                      ? 'text-neutral-900 hover:bg-black/[0.02]'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-200 ${
                      isCurrent
                        ? 'bg-neutral-950 text-white scale-110'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-black/[0.06] text-neutral-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle className="w-3 h-3" /> : s.step}
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

        {/* Main Grid: Stepper Wizard (Left) + Live Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stepper Wizard Form (Apple Bento Surface) */}
          <div className="lg:col-span-7 apple-card rounded-[2.5rem] p-7 sm:p-10 border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            {/* Step 1: Tipo de Proyecto (Apple Store Device Picker Style) */}
            {currentStep === 1 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400 ease-out">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-pink">
                      Paso 1 de 4 • Disciplina Artística
                    </span>
                    <span className="text-xs text-neutral-400">Paso obligatorio</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    ¿Qué tipo de obra deseas cotizar?
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Selecciona la disciplina artística principal para adaptar automáticamente los formatos y materiales.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'mural' as ProjectType,
                      title: 'Muralismo',
                      tagline: 'Comercial & Interior',
                      description: 'Paredes, fachadas, negocios y residencias en Tampico.',
                      icon: Palette,
                      accentColor: 'text-naho-pink bg-naho-pink/10',
                      badge: 'Gran Formato',
                    },
                    {
                      id: 'ropa' as ProjectType,
                      title: 'Diseño de Ropa',
                      tagline: 'Custom Denim Art',
                      description: 'Chamarras, chalecos y prendas ilustradas a mano indelebles.',
                      icon: Shirt,
                      accentColor: 'text-naho-blue bg-naho-blue/10',
                      badge: 'Más Popular',
                    },
                    {
                      id: 'totebag' as ProjectType,
                      title: 'Totebag Artesanal',
                      tagline: '100% Lienzo de Algodón',
                      description: 'Bolsas ecológicas de autor, individuales o colecciones.',
                      icon: ShoppingBag,
                      accentColor: 'text-lime-700 bg-naho-green/20',
                      badge: 'Artesanal',
                    },
                    {
                      id: 'otro' as ProjectType,
                      title: 'Proyecto Especial',
                      tagline: 'Lienzo o Soporte Libre',
                      description: 'Cuadros en bastidor, calzado o intervención personalizada.',
                      icon: Sparkles,
                      accentColor: 'text-naho-purple bg-purple-100',
                      badge: 'A Medida',
                    },
                  ].map((option) => {
                    const isSelected = formData.projectType === option.id;
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleProjectTypeChange(option.id)}
                        className={`p-6 rounded-[1.75rem] text-left transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer select-none active:scale-[0.98] ${
                          isSelected
                            ? 'border-2 border-neutral-950 bg-neutral-950 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] scale-[1.01]'
                            : 'border border-black/[0.08] bg-white hover:border-black/25 hover:shadow-md text-neutral-900'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-3 rounded-2xl transition-colors ${
                              isSelected ? 'bg-white/10 text-white' : option.accentColor
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-black/[0.04] text-neutral-500'
                              }`}
                            >
                              {option.badge}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-white bg-white text-neutral-950'
                                  : 'border-black/20 bg-transparent'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-950" />}
                            </div>
                          </div>
                        </div>

                        <div>
                          <span
                            className={`text-[11px] font-semibold block uppercase tracking-wider ${
                              isSelected ? 'text-neutral-400' : 'text-neutral-500'
                            }`}
                          >
                            {option.tagline}
                          </span>
                          <h4 className="font-extrabold text-lg tracking-tight mt-0.5">
                            {option.title}
                          </h4>
                          <p
                            className={`text-xs mt-1.5 leading-relaxed ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Dimensiones y Superficie (Apple Mac Configurator Style) */}
            {currentStep === 2 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400 ease-out">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-blue">
                      Paso 2 de 4 • Especificaciones Técnicas
                    </span>
                    <span className="text-xs text-neutral-400">Paso obligatorio</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    Dimensiones y tipo de superficie
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Selecciona el formato más cercano a lo que buscas o especifica medidas personalizadas.
                  </p>
                </div>

                {/* Preset Options */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                    Formatos frecuentes para {formData.projectType.toUpperCase()}:
                  </label>
                  <div className="space-y-2.5">
                    {dimensionPresets[formData.projectType].map((preset, idx) => {
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
                          className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                              : 'border-black/[0.07] hover:border-black/20 bg-white hover:bg-neutral-50/60 text-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-white bg-white text-neutral-950'
                                  : 'border-neutral-300'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm tracking-tight">{preset.label}</p>
                                {preset.popular && (
                                  <span
                                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                      isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    Recomendado
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs font-mono mt-0.5 ${
                                  isSelected ? 'text-neutral-300' : 'text-neutral-500'
                                }`}
                              >
                                Soporte: {preset.surface}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom dimensions detail */}
                <div className="pt-2">
                  <label
                    htmlFor={customDimensionsId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                  >
                    ¿Medidas exactas o condiciones del espacio? (Opcional):
                  </label>
                  <input
                    id={customDimensionsId}
                    type="text"
                    placeholder="Ej. 2.40m alto x 4.10m ancho con ventana central, o talla M en mezclilla..."
                    value={formData.customDimensions}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customDimensions: e.target.value }))
                    }
                    className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Nahomy evaluará la viabilidad técnica directamente sobre estas notas.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Concepto, Paleta de Color y Foto de Referencia */}
            {currentStep === 3 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400 ease-out">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-naho-orange">
                      Paso 3 de 4 • Visión Artística & Color
                    </span>
                    <span className="text-xs text-neutral-400">Paso obligatorio</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    Concepto, atmósfera cromática y foto de referencia
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Comparte tu visión creativa, elige la atmósfera de color deseada y añade bocetos o referencias.
                  </p>
                </div>

                {/* --- ARTISTIC COLOR PALETTE SELECTOR (Moodboard Creativo) --- */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2.5 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-naho-pink" />
                    <span>Atmósfera Cromática & Paleta Sugerida:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {artisticPalettes.map((palette) => {
                      const isSelected = formData.colorPalette?.startsWith(palette.name);
                      return (
                        <div
                          key={palette.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              colorPalette: `${palette.name} (${palette.description})`,
                            }))
                          }
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                              : 'border-black/[0.06] bg-white hover:bg-neutral-50/80 text-neutral-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs tracking-tight">{palette.name}</span>
                            <div className="flex items-center gap-1">
                              {palette.colors.map((color, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10 shrink-0"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <p
                            className={`text-[11px] leading-snug ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {palette.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestion tags (Apple Music / iOS Search Chips) */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Ideas y elementos populares (Haz clic para agregar a tu idea):
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                        className="text-xs px-3.5 py-1.5 rounded-full border border-black/[0.06] bg-neutral-100/70 hover:bg-neutral-200 text-neutral-700 transition-all font-medium cursor-pointer active:scale-95"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme text area */}
                <div>
                  <label
                    htmlFor={themeDetailsId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-2 flex items-center justify-between"
                  >
                    <span>Describe tu idea o temática *</span>
                    <span className="text-[11px] font-mono font-normal text-neutral-400">
                      {formData.themeAndDetails.trim().length} caracteres (mínimo 4)
                    </span>
                  </label>
                  <textarea
                    id={themeDetailsId}
                    rows={3}
                    required
                    placeholder="Ej. Quiero una obra botánica con mariposas monarca y flores tropicales para la pared principal del restaurante..."
                    value={formData.themeAndDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, themeAndDetails: e.target.value }))
                    }
                    className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all leading-relaxed placeholder:text-neutral-400"
                  />
                </div>

                {/* --- REFERENCE IMAGE UPLOADER (Apple AirDrop / Photos Widget Style) --- */}
                <div className="p-6 rounded-[2rem] bg-neutral-50/70 border border-black/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-naho-pink" />
                      <span>Foto o Boceto de Referencia (Opcional)</span>
                    </label>
                  </div>

                  <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                    Sube una foto de referencia, diseño o boceto desde tu dispositivo. Nahomy la recibirá en su panel para valorar el tiempo y técnica requerida.
                  </p>

                  {/* If user uploaded a photo file */}
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
                          Foto de referencia lista
                        </span>
                        <p className="text-sm font-bold text-neutral-900 truncate mt-1">
                          {formData.referenceImageName || 'Imagen seleccionada'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Lista para enviarse al panel del estudio
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
                    /* Dropzone */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer select-none ${
                        isDragging
                          ? 'border-neutral-950 bg-white scale-[1.01]'
                          : 'border-black/15 hover:border-neutral-950 bg-white/80 hover:bg-white'
                      }`}
                    >
                      <input
                        id={imageUploadInputId}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-2.5">
                        <div className="p-3.5 rounded-full bg-black/[0.04] text-neutral-900">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-800">
                            Arrastra tu imagen aquí o{' '}
                            <span className="text-neutral-950 underline decoration-2">
                              haz clic para explorar
                            </span>
                          </p>
                          <p className="text-xs text-neutral-400 mt-1 font-mono">
                            Formatos soportados: PNG, JPG, WEBP (hasta 10 MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deadline date */}
                <div>
                  <label
                    htmlFor={deadlineDateId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                  >
                    ¿Fecha límite o inauguración? (Opcional):
                  </label>
                  <input
                    id={deadlineDateId}
                    type="date"
                    value={formData.deadlineDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, deadlineDate: e.target.value }))
                    }
                    className="w-full sm:w-64 px-4 py-2.5 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Datos de Contacto y Canal de Comunicación (Apple Pay Checkout Style) */}
            {currentStep === 4 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400 ease-out">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-emerald-600">
                      Paso 4 de 4 • Datos de Contacto
                    </span>
                    <span className="text-xs text-neutral-400">Paso final</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    ¿Dónde deseas recibir tu cotización?
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Nahomy revisará tus especificaciones y te contactará con el presupuesto formal y boceto inicial.
                  </p>
                </div>

                {/* Name, Email and Phone */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={clientNameId}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                    >
                      Tu Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                      <input
                        id={clientNameId}
                        type="text"
                        required
                        placeholder="Ej. Andrea Gómez"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, clientName: e.target.value }))
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={clientEmailId}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                      >
                        Correo Electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                        <input
                          id={clientEmailId}
                          type="email"
                          required
                          placeholder="andrea@ejemplo.com"
                          value={formData.clientEmail}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Para enviarte la propuesta formal y boceto
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={clientPhoneId}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                      >
                        Teléfono / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                        <input
                          id={clientPhoneId}
                          type="tel"
                          required
                          placeholder="Ej. 833 123 4567"
                          value={formData.clientPhone}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, clientPhone: e.target.value }))
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Para coordinar dudas inmediatas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Method Pill Toggle */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                    ¿Cómo prefieres que Nahomy se comunique contigo?:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'whatsapp' as PreferredContactMethod,
                        label: 'WhatsApp',
                        desc: 'Respuesta ágil por chat',
                        icon: MessageCircle,
                      },
                      {
                        id: 'email' as PreferredContactMethod,
                        label: 'Correo Electrónico',
                        desc: 'Propuesta formal en PDF',
                        icon: Mail,
                      },
                      {
                        id: 'call' as PreferredContactMethod,
                        label: 'Llamada Directa',
                        desc: 'Consulta telefónica',
                        icon: Phone,
                      },
                    ].map((method) => {
                      const isSelected = formData.preferredContact === method.id;
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.id}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, preferredContact: method.id }))
                          }
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                              : 'border-black/[0.06] bg-white hover:bg-neutral-50 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                            <span className="font-bold text-xs">{method.label}</span>
                          </div>
                          <span
                            className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}
                          >
                            {method.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instant Zone Pills */}
                <div>
                  <label
                    htmlFor={clientLocationId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                  >
                    Zona de entrega o instalación:
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickZones.map((zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, clientLocation: zone }))
                        }
                        className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                          formData.clientLocation === zone
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                    <input
                      id={clientLocationId}
                      type="text"
                      value={formData.clientLocation}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, clientLocation: e.target.value }))
                      }
                      placeholder="Ej. Tampico, Cd. Madero, Altamira o Envío nacional"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={clientNotesId}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2"
                  >
                    Comentario adicional o solicitud especial (Opcional):
                  </label>
                  <input
                    id={clientNotesId}
                    type="text"
                    value={formData.clientNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, clientNotes: e.target.value }))
                    }
                    placeholder="Ej. Tengo fotos de referencia adicionales o prefiero entrega en fin de semana"
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Stepper Footer Controls (Apple Pill Navigation) */}
            <div className="mt-10 pt-6 border-t border-black/[0.05] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.08] text-neutral-700 hover:bg-neutral-100 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 select-none"
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
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className={`px-7 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 select-none ${
                    isStepValid(currentStep)
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm'
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
                  className={`px-7 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 select-none ${
                    isFormComplete
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-md'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>Registrar y Enviar Cotización</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Persistent Live Summary (Right Column) */}
          <div className="lg:col-span-5">
            <LiveSummary
              formData={formData}
              currentStep={currentStep}
              totalSteps={totalSteps}
              isFormValid={isFormComplete}
              onSubmitQuote={handleSubmitQuote}
              referenceArtTitle={referenceArtTitle}
              formattedMessage={buildOfficialSummary()}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Official Studio Submission Flow */}
      {showSuccessModal && createdTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-7 sm:p-9 max-w-lg w-full border border-black/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.35)] space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                FOLIO DEL PROYECTO: {createdTicket.folio}
              </span>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight mt-1">
                ¡Cotización Registrada con Éxito!
              </h3>
              <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
                Tu solicitud ha sido ingresada en el sistema del taller para revisión por Nahomy.
              </p>
            </div>

            {/* Workflow routes explanation */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">Enviado al Panel de Estudio de Nahomy</span>
                  <span className="text-neutral-500 text-[11px]">
                    Listo para que la artista revise las medidas y foto de referencia.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">Notificación por Correo Electrónico</span>
                  <span className="text-neutral-500 text-[11px]">
                    Copia enviada a <strong>{formData.clientEmail}</strong> y <strong>nahomy@nahocraft.com</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">
                    Canal de Respuesta Elegido: {formData.preferredContact.toUpperCase()}
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    Nahomy se comunicará directamente contigo en un plazo de 24 a 48 horas.
                  </span>
                </div>
              </div>
            </div>

            {/* Production Demo Showcase Button: "Ver cómo lo recibe Nahomy en su Panel" */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-naho-pink/10 via-naho-orange/10 to-naho-blue/10 border border-naho-pink/20 text-center">
              <p className="text-xs font-bold text-neutral-900 mb-1">
                🚀 Demostración de Arquitectura y Flujo:
              </p>
              <p className="text-[11px] text-neutral-600 mb-2.5 leading-snug">
                Puedes ver en tiempo real cómo Nahomy recibe este ticket en el panel administrativo del taller.
              </p>
              <button
                type="button"
                onClick={() => setShowAdminPanelModal(true)}
                className="w-full py-2.5 px-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Inbox className="w-4 h-4 text-naho-pink" />
                <span>🎨 Ver cómo lo recibe Nahomy en su Panel de Estudio</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={openWhatsAppFallback}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir también copia directa en WhatsApp (Opcional)</span>
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 rounded-full border border-black/[0.08] text-neutral-600 hover:bg-neutral-100 font-semibold text-xs transition-all cursor-pointer"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Studio Panel Simulation Modal */}
      {showAdminPanelModal && createdTicket && (
        <StudioAdminPreviewModal
          currentTicket={createdTicket}
          onClose={() => setShowAdminPanelModal(false)}
        />
      )}
    </section>
  );
}
