import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { isNahoAuthenticated, setNahoAuthenticated } from './NahoLoginPage';
import { localAssets } from '../../assets';
import { compressImageFile } from '../../utils/imageCompressor';
import { sendStudentTicketEmail } from '../../emails';
import {
  CourseItem,
  CourseEnrollment,
  PortfolioItem,
  MuralCategory,
  MuralGalleryImage,
  QuoteTicket,
  StudioGalleryPhoto,
} from '../../types';
import {
  Palette,
  Video,
  FileText,
  User,
  Users,
  Search,
  Filter,
  Ticket,
  Sparkles,
  Store,
  FolderPlus,
  LogOut,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  CalendarDays,
  Clock,
  Upload,
  Save,
  RotateCcw,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Wand2,
  Download,
  Send,
  AlertTriangle,
  Images,
  GraduationCap,
} from 'lucide-react';

const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const YEAR_OPTIONS = ['2026', '2027'];

function formatSpanishDateFromIso(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = SPANISH_MONTHS[monthIdx] || parts[1];
  return `${day} de ${monthName}, ${year}`;
}

function getMonthAndYearFromIso(isoDate: string): { month: string; year: string } {
  if (!isoDate) return { month: 'Octubre', year: '2026' };
  const parts = isoDate.split('-');
  if (parts.length < 3) return { month: 'Octubre', year: '2026' };
  const year = parts[0] || '2026';
  const monthIdx = parseInt(parts[1], 10) - 1;
  const month = SPANISH_MONTHS[monthIdx] || 'Octubre';
  return { month, year };
}

function generateGoogleMeetUrl(): string {
  // Google Meet standard pattern: meet.google.com/xxx-yyyy-zzz
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const rPart = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/nah-${rPart(4)}-${rPart(3)}`;
}

type AdminTab = 'murales' | 'cursos' | 'alumnos' | 'cotizaciones' | 'sobre-mi' | 'hero-taller';

export function NahoGestionDashboard() {
  const {
    navigateTo,
    siteConfig,
    updateSiteConfig,
    muralCategories,
    addMuralCategory,
    updateMuralCategory,
    deleteMuralCategory,
    muralItems,
    addMuralItem,
    updateMuralItem,
    deleteMuralItem,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    courseEnrollments,
    deleteCourseEnrollment,
    quoteTickets,
    updateQuoteTicketStatus,
    updateQuoteTicketDetails,
    deleteQuoteTicket,
    aboutMe,
    updateAboutMe,
    inPersonClasses,
    updateInPersonClasses,
    studioPhotos,
    addStudioPhoto,
    deleteStudioPhoto,
    weeklySchedule,
    updateWeeklySchedule,
    resetAllDataToDefaults,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<AdminTab>('murales');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Reusable Confirmation Dialog State (#11)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // State for ALUMNOS tab (Filtering by specific course & search)
  const [selectedStudentCourseFilter, setSelectedStudentCourseFilter] = useState<string>('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [copiedStudentEmails, setCopiedStudentEmails] = useState(false);

  // Selected category in MURALES tab
  const [selectedMuralCatId, setSelectedMuralCatId] = useState<string>(
    muralCategories[0]?.id || 'all'
  );

  // Selected filter in COTIZACIONES tab
  const [selectedQuoteFilter, setSelectedQuoteFilter] = useState<
    'todas' | QuoteTicket['status']
  >('todas');

  // Selected sub-view in CURSOS tab
  const [selectedCoursesView, setSelectedCoursesView] = useState<'catalogo' | 'inscritos'>(
    'catalogo'
  );

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showMuralModal, setShowMuralModal] = useState(false);
  const [editingMuralId, setEditingMuralId] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Redirect to /naho if not authenticated
  useEffect(() => {
    if (!isNahoAuthenticated()) {
      navigateTo('/naho');
    }
  }, [navigateTo]);

  // Keep selectedMuralCatId valid if categories change
  useEffect(() => {
    if (
      selectedMuralCatId !== 'all' &&
      !muralCategories.some((c) => c.id === selectedMuralCatId)
    ) {
      setSelectedMuralCatId(muralCategories[0]?.id || 'all');
    }
  }, [muralCategories, selectedMuralCatId]);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // --- STATE FOR NEW / EDIT CATEGORY MODAL ---
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // --- STATE FOR MURAL MODAL ---
  const [muralForm, setMuralForm] = useState<{
    title: string;
    category: string;
    description: string;
    dimensions: string;
    technique: string;
    location: string;
    curatedTag: string;
    tagsText: string;
    image: string;
    galleryImages: MuralGalleryImage[];
  }>({
    title: '',
    category: muralCategories[0]?.id || 'comercial',
    description: '',
    dimensions: '3.5m x 2.5m',
    technique: 'Acrílico profesional sobre muro',
    location: 'Tampico, Tamps.',
    curatedTag: 'Mural Personalizado',
    tagsText: 'Comercial, Tampico, Pintado a Mano',
    image: localAssets.murales.dulceria,
    galleryImages: [],
  });
  const [newGallerySlideLabel, setNewGallerySlideLabel] = useState('Antes del Mural');

  // --- STATE FOR COURSE MODAL ---
  const [courseForm, setCourseForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    eventDate: string;
    eventDateDisplay: string;
    startTime: string;
    endTime: string;
    eventTimeDisplay: string;
    registrationDeadline: string;
    maxSpots: number;
    price: number;
    modality: CourseItem['modality'];
    level: string;
    platformName: string;
    meetingLink: string;
    selectedMonth: string;
    selectedYear: string;
    monthLabel: string;
    image: string;
    includesText: string;
    featured: boolean;
    active: boolean;
  }>({
    title: '',
    subtitle: 'Curso en Vivo Paso a Paso',
    description: '',
    eventDate: '2026-10-29',
    eventDateDisplay: '29 de Octubre, 2026',
    startTime: '17:00',
    endTime: '19:30',
    eventTimeDisplay: '17:00 - 19:30 hrs',
    registrationDeadline: '2026-10-29T16:00',
    maxSpots: 15,
    price: 480,
    modality: 'online',
    level: 'Todos los niveles (Sin experiencia previa necesaria)',
    platformName: 'Google Meet (En Vivo)',
    meetingLink: 'https://meet.google.com/nah-arte-curso',
    selectedMonth: 'Octubre',
    selectedYear: '2026',
    monthLabel: 'Octubre 2026',
    image: localAssets.murales.dulceria,
    includesText:
      'Acceso en vivo por Google Meet\nLista de materiales en PDF\nRetroalimentación en directo con Nahomy',
    featured: false,
    active: true,
  });
  const [copiedMeetLink, setCopiedMeetLink] = useState(false);

  // --- STATE FOR STUDIO PHOTO ---
  const [newStudioPhoto, setNewStudioPhoto] = useState({
    title: '',
    caption: '',
    tag: 'Nuestro Taller',
    image: localAssets.murales.hojas,
  });

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImageFile(file, 1200, 0.8);
      onLoaded(compressedUrl);
    } catch {
      showToast('No se pudo procesar el archivo de imagen.');
    }
    e.target.value = '';
  };

  // --- HANDLERS FOR MURAL CATEGORIES & ITEMS ---
  const openNewCategoryModal = () => {
    setEditingCategoryId(null);
    setNewCatLabel('');
    setNewCatDesc('');
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat: MuralCategory) => {
    setEditingCategoryId(cat.id);
    setNewCatLabel(cat.label);
    setNewCatDesc(cat.description || '');
    setShowCategoryModal(true);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    if (editingCategoryId) {
      updateMuralCategory({
        id: editingCategoryId,
        label: newCatLabel.trim(),
        description: newCatDesc.trim() || 'Categoría de mural personalizado',
      });
      showToast(`Categoría "${newCatLabel.trim()}" actualizada.`);
    } else {
      const slug = newCatLabel
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');
      const cat: MuralCategory = {
        id: slug || `cat-${Date.now()}`,
        label: newCatLabel.trim(),
        description: newCatDesc.trim() || 'Categoría de mural personalizado',
      };
      addMuralCategory(cat);
      setSelectedMuralCatId(cat.id);
      showToast(`Categoría "${cat.label}" creada.`);
    }

    setNewCatLabel('');
    setNewCatDesc('');
    setEditingCategoryId(null);
    setShowCategoryModal(false);
  };

  const openNewMuralModal = () => {
    const defaultCatId =
      selectedMuralCatId !== 'all'
        ? selectedMuralCatId
        : muralCategories[0]?.id || 'comercial';
    const matchedCat = muralCategories.find((c) => c.id === defaultCatId);
    setEditingMuralId(null);
    setMuralForm({
      title: '',
      category: defaultCatId,
      description: '',
      dimensions: '3.5m x 2.5m',
      technique: 'Acrílico profesional sobre muro',
      location: 'Tampico, Tamps.',
      curatedTag: 'Mural Personalizado',
      tagsText: `${matchedCat?.label || 'Mural'}, Tampico, Pintado a Mano`,
      image: localAssets.murales.dulceria,
      galleryImages: [],
    });
    setShowMuralModal(true);
  };

  const openEditMuralModal = (item: PortfolioItem) => {
    setEditingMuralId(item.id);
    setMuralForm({
      title: item.title,
      category: item.category,
      description: item.description,
      dimensions: item.details?.dimensions || '3.5m x 2.5m',
      technique: item.details?.technique || 'Acrílico profesional sobre muro',
      location: item.details?.location || 'Tampico, Tamps.',
      curatedTag: item.details?.curatedTag || 'Mural Personalizado',
      tagsText: item.tags?.length ? item.tags.join(', ') : `${item.categoryLabel}, Tampico`,
      image: item.image,
      galleryImages: item.galleryImages || [],
    });
    setShowMuralModal(true);
  };

  const handleSaveMural = (e: React.FormEvent) => {
    e.preventDefault();
    if (!muralForm.title.trim()) return;
    const matchedCat = muralCategories.find((c) => c.id === muralForm.category);
    const parsedTags = muralForm.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const finalTags =
      parsedTags.length > 0
        ? parsedTags
        : [matchedCat?.label || 'Mural', muralForm.location, 'Pintado a Mano'];

    if (editingMuralId) {
      const existing = muralItems.find((m) => m.id === editingMuralId);
      if (existing) {
        updateMuralItem({
          ...existing,
          title: muralForm.title.trim(),
          category: muralForm.category,
          categoryLabel: matchedCat?.label || 'Mural Personalizado',
          image: muralForm.image,
          description:
            muralForm.description.trim() || 'Mural artístico pintado a mano por Nahomy.',
          tags: finalTags,
          details: {
            dimensions: muralForm.dimensions,
            technique: muralForm.technique,
            location: muralForm.location,
            curatedTag: muralForm.curatedTag,
          },
          galleryImages: muralForm.galleryImages,
        });
        showToast('Mural actualizado.');
      }
    } else {
      const item: PortfolioItem = {
        id: `mural-${Date.now()}`,
        title: muralForm.title.trim(),
        category: muralForm.category,
        categoryLabel: matchedCat?.label || 'Mural Personalizado',
        image: muralForm.image,
        description:
          muralForm.description.trim() || 'Mural artístico pintado a mano por Nahomy.',
        tags: finalTags,
        details: {
          dimensions: muralForm.dimensions,
          technique: muralForm.technique,
          location: muralForm.location,
          curatedTag: muralForm.curatedTag,
        },
        galleryImages: muralForm.galleryImages,
      };
      addMuralItem(item);
      setSelectedMuralCatId(item.category);
      showToast('Mural agregado al portafolio.');
    }

    setShowMuralModal(false);
    setEditingMuralId(null);
  };

  // --- HANDLERS FOR COURSES ---
  const openNewCourseModal = () => {
    setEditingCourseId(null);
    const initialMeet = generateGoogleMeetUrl();
    const defaultDate = '2026-10-29';
    const { month, year } = getMonthAndYearFromIso(defaultDate);
    setCourseForm({
      title: '',
      subtitle: 'Curso Especial del Mes • Sesión en Vivo con Nahomy',
      description: '',
      eventDate: defaultDate,
      eventDateDisplay: formatSpanishDateFromIso(defaultDate),
      startTime: '17:00',
      endTime: '19:30',
      eventTimeDisplay: '17:00 - 19:30 hrs',
      registrationDeadline: `${defaultDate}T16:00`,
      maxSpots: 15,
      price: 480,
      modality: 'online',
      level: 'Todos los niveles (Sin experiencia previa necesaria)',
      platformName: 'Google Meet (En Vivo)',
      meetingLink: initialMeet,
      selectedMonth: month,
      selectedYear: year,
      monthLabel: `${month} ${year}`,
      image: localAssets.murales.dulceria,
      includesText:
        'Acceso en vivo a la sesión interactiva por Google Meet\nLista de materiales y guía de mezcla en PDF\nRevisión en directo de tu ejercicio con Nahomy\nGrabación disponible por 15 días y constancia digital',
      featured: false,
      active: true,
    });
    setCopiedMeetLink(false);
    setShowCourseModal(true);
  };

  const openEditCourseModal = (c: CourseItem) => {
    setEditingCourseId(c.id);
    const timeMatch = c.eventTimeDisplay.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    const startTime = timeMatch ? timeMatch[1] : '17:00';
    const endTime = timeMatch ? timeMatch[2] : '19:30';
    const { month, year } = getMonthAndYearFromIso(c.eventDate);
    const monthParts = c.monthLabel ? c.monthLabel.split(' ') : [];
    const selectedMonth = monthParts[0] || month;
    const selectedYear = monthParts[1] || year;

    setCourseForm({
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      eventDate: c.eventDate,
      eventDateDisplay: c.eventDateDisplay || formatSpanishDateFromIso(c.eventDate),
      startTime,
      endTime,
      eventTimeDisplay: c.eventTimeDisplay,
      registrationDeadline: c.registrationDeadline.slice(0, 16),
      maxSpots: c.maxSpots,
      price: c.price,
      modality: c.modality || 'online',
      level: c.level || 'Todos los niveles',
      platformName: c.platformName,
      meetingLink: c.meetingLink,
      selectedMonth,
      selectedYear,
      monthLabel: c.monthLabel || `${selectedMonth} ${selectedYear}`,
      image: c.image,
      includesText: c.includes.join('\n'),
      featured: Boolean(c.featured),
      active: c.active !== false,
    });
    setCopiedMeetLink(false);
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.meetingLink.trim()) return;

    const includesList = courseForm.includesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCourseId) {
      const existing = courses.find((c) => c.id === editingCourseId);
      if (existing) {
        updateCourse({
          ...existing,
          title: courseForm.title.trim(),
          subtitle: courseForm.subtitle.trim(),
          description: courseForm.description.trim(),
          eventDate: courseForm.eventDate,
          eventDateDisplay: courseForm.eventDateDisplay.trim(),
          eventTimeDisplay: courseForm.eventTimeDisplay.trim(),
          registrationDeadline: courseForm.registrationDeadline,
          maxSpots: Number(courseForm.maxSpots) || 15,
          price: Number(courseForm.price) || 450,
          modality: courseForm.modality,
          level: courseForm.level.trim() || 'Todos los niveles',
          platformName: courseForm.platformName.trim(),
          meetingLink: courseForm.meetingLink.trim(),
          monthLabel: courseForm.monthLabel.trim(),
          image: courseForm.image,
          includes: includesList,
          featured: courseForm.featured,
          active: courseForm.active,
        });
        showToast('Curso actualizado correctamente.');
      }
    } else {
      const newCourseItem: CourseItem = {
        id: `curso-${Date.now()}`,
        title: courseForm.title.trim(),
        subtitle: courseForm.subtitle.trim(),
        description: courseForm.description.trim(),
        eventDate: courseForm.eventDate,
        eventDateDisplay: courseForm.eventDateDisplay.trim(),
        eventTimeDisplay: courseForm.eventTimeDisplay.trim(),
        registrationDeadline: courseForm.registrationDeadline,
        maxSpots: Number(courseForm.maxSpots) || 15,
        enrolledCount: 0,
        price: Number(courseForm.price) || 450,
        modality: courseForm.modality,
        platformName: courseForm.platformName.trim(),
        meetingLink: courseForm.meetingLink.trim(),
        monthLabel: courseForm.monthLabel.trim(),
        level: courseForm.level.trim() || 'Todos los niveles',
        image: courseForm.image,
        includes: includesList,
        featured: courseForm.featured,
        active: courseForm.active,
      };
      addCourse(newCourseItem);
      showToast('Curso publicado con su link de acceso.');
    }

    setShowCourseModal(false);
    setEditingCourseId(null);
  };

  // --- HANDLERS FOR STUDENT ENROLLMENTS (#5) ---
  const handleResendStudentTicket = (enr: CourseEnrollment) => {
    const matchedCourse = courses.find((c) => c.id === enr.courseId);
    sendStudentTicketEmail({
      buyerName: enr.buyerName,
      buyerEmail: enr.buyerEmail,
      buyerPhone: enr.buyerPhone,
      accessCode: enr.accessCode,
      folio: enr.folio,
      courseTitle: enr.courseTitle,
      courseSubtitle: matchedCourse?.subtitle,
      eventDateDisplay: enr.courseDateDisplay,
      eventTimeDisplay: enr.courseTimeDisplay,
      meetingLink: enr.meetingLink,
      totalPaid: enr.totalPaid,
      paymentMethod: enr.paymentMethod,
      studioAddress: siteConfig.studioAddress,
      studioPhone: siteConfig.studioPhone,
      adminEmail: siteConfig.adminEmail,
    })
      .then(() => {
        showToast(`Boleto reenviado a ${enr.buyerEmail}.`);
      })
      .catch(() => {
        showToast(`No se pudo reenviar el correo a ${enr.buyerEmail}.`);
      });
  };

  const handleExportStudentsCsv = (list: CourseEnrollment[]) => {
    if (list.length === 0) return;
    const headers = [
      'Folio',
      'Codigo_Acceso',
      'Alumno',
      'Correo',
      'Telefono',
      'Curso',
      'Fecha_Curso',
      'Horario',
      'Monto_Pagado_MXN',
      'Metodo_Pago',
      'Fecha_Compra',
      'Enlace_Meet',
    ];
    const escapeCsv = (val: string | number) => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = list.map((e) =>
      [
        e.folio,
        e.accessCode,
        e.buyerName,
        e.buyerEmail,
        e.buyerPhone,
        e.courseTitle,
        e.courseDateDisplay,
        e.courseTimeDisplay,
        e.totalPaid,
        e.paymentMethod,
        e.purchasedAt,
        e.meetingLink,
      ]
        .map(escapeCsv)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Alumnos_Nahocraft_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast(`Archivo CSV exportado (${list.length} alumnos).`);
  };

  const handleAddStudioPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudioPhoto.title.trim()) return;
    const photo: StudioGalleryPhoto = {
      id: `studio-${Date.now()}`,
      title: newStudioPhoto.title.trim(),
      caption: newStudioPhoto.caption.trim(),
      tag: newStudioPhoto.tag.trim() || 'Nuestro Taller',
      image: newStudioPhoto.image,
    };
    addStudioPhoto(photo);
    setNewStudioPhoto((prev) => ({ ...prev, title: '', caption: '' }));
    showToast('Fotografía del taller agregada.');
  };

  if (!isNahoAuthenticated()) {
    return null;
  }

  const activeCategoryObj = muralCategories.find((c) => c.id === selectedMuralCatId);
  const filteredMurals =
    selectedMuralCatId === 'all'
      ? muralItems
      : muralItems.filter((m) => m.category === selectedMuralCatId);

  const filteredQuotes =
    selectedQuoteFilter === 'todas'
      ? quoteTickets
      : quoteTickets.filter((q) => q.status === selectedQuoteFilter);

  // Filtered enrollments for ALUMNOS tab
  const filteredEnrollments = courseEnrollments.filter((enr) => {
    // 1. Course specific filter
    const matchesCourse =
      selectedStudentCourseFilter === 'all' || enr.courseId === selectedStudentCourseFilter;
    if (!matchesCourse) return false;

    // 2. Search query filter (name, email, phone, folio, accessCode, courseTitle)
    if (!studentSearchQuery.trim()) return true;
    const q = studentSearchQuery.toLowerCase().trim();
    return (
      enr.buyerName.toLowerCase().includes(q) ||
      enr.buyerEmail.toLowerCase().includes(q) ||
      enr.buyerPhone.toLowerCase().includes(q) ||
      enr.folio.toLowerCase().includes(q) ||
      enr.accessCode.toLowerCase().includes(q) ||
      enr.courseTitle.toLowerCase().includes(q)
    );
  });

  const activeFilteredCourseObj =
    selectedStudentCourseFilter === 'all'
      ? null
      : courses.find((c) => c.id === selectedStudentCourseFilter);

  const filteredCourseRevenue = filteredEnrollments.reduce((sum, e) => sum + e.totalPaid, 0);

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-neutral-900 flex flex-col">
      {/* ============================================================
          TOP DARK EDITORIAL HEADER (Inspired by Fer's Dashboard)
         ============================================================ */}
      <header className="bg-[#181B20] text-white sticky top-0 z-40 shadow-sm">
        {/* Top Row: Brand Identity & Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden p-0.5">
              <img
                src={localAssets.logo}
                alt="Nahocraft"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-normal tracking-wide text-white leading-tight">
                Panel de administración
              </h1>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45 mt-0.5">
                Nahomy • Centro de Arte
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {activeTab === 'murales' && (
              <button
                type="button"
                onClick={openNewCategoryModal}
                className="px-3.5 py-2 border border-white/15 hover:border-white/35 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-naho-pink" />
                <span>Nueva Categoría</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver Sitio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                setNahoAuthenticated(false);
                navigateTo('/naho');
              }}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-naho-pink flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Minimalist Uppercase Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-white/[0.07]">
          <nav
            aria-label="Secciones del panel"
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar"
          >
            {[
              { id: 'murales' as AdminTab, label: 'Murales', icon: Palette },
              { id: 'cursos' as AdminTab, label: 'Cursos', icon: Video },
              {
                id: 'alumnos' as AdminTab,
                label: 'Alumnos',
                icon: Users,
                badge: courseEnrollments.length,
              },
              {
                id: 'cotizaciones' as AdminTab,
                label: 'Cotizaciones',
                icon: FileText,
                badge: quoteTickets.filter((q) => q.status === 'nuevo').length,
              },
              { id: 'sobre-mi' as AdminTab, label: 'Sobre Mí', icon: User },
              { id: 'hero-taller' as AdminTab, label: 'Hero & Taller', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-naho-pink text-white'
                      : 'border-transparent text-white/45 hover:text-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-naho-pink' : ''}`} />
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                        isActive
                          ? 'bg-naho-pink text-white'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 px-5 py-3.5 bg-[#181B20] text-white text-xs font-medium tracking-wide shadow-2xl border-l-2 border-naho-pink flex items-center gap-2.5 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-naho-pink" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ============================================================
          MAIN WORKSPACE CANVAS
         ============================================================ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        {/* ============================================================
            TAB 1: MURALES (Exact Fer's "OBRAS" layout adapted for Murals)
           ============================================================ */}
        {activeTab === 'murales' && (
          <div className="space-y-12">
            {/* Category Selector Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {muralCategories.map((cat) => {
                const count = muralItems.filter((m) => m.category === cat.id).length;
                const isSelected = selectedMuralCatId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedMuralCatId(cat.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedMuralCatId(cat.id);
                    }}
                    className={`group relative p-6 text-left transition-all cursor-pointer border-b-2 ${
                      isSelected
                        ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                        : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <span className="block font-serif text-3xl font-normal leading-none">
                      {count}
                    </span>
                    <span
                      className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 truncate ${
                        isSelected ? 'text-white/70' : 'text-neutral-400'
                      }`}
                    >
                      {cat.label}
                    </span>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCategoryModal(cat);
                        }}
                        title={`Editar categoría ${cat.label}`}
                        className={`p-1 transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-white/60 hover:text-naho-pink'
                            : 'text-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {muralCategories.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDialog({
                              title: `¿Eliminar categoría "${cat.label}"?`,
                              message:
                                'Se quitará esta categoría del filtro. Te recomendamos reasignar antes los murales que pertenezcan a ella.',
                              confirmLabel: 'Sí, eliminar categoría',
                              onConfirm: () => {
                                deleteMuralCategory(cat.id);
                                showToast(`Categoría "${cat.label}" eliminada.`);
                              },
                            });
                          }}
                          title={`Eliminar categoría ${cat.label}`}
                          className={`p-1 transition-colors cursor-pointer ${
                            isSelected
                              ? 'text-white/50 hover:text-rose-400'
                              : 'text-neutral-300 hover:text-rose-600'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* "Todos" card */}
              <div
                onClick={() => setSelectedMuralCatId('all')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedMuralCatId('all');
                }}
                className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
                  selectedMuralCatId === 'all'
                    ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                    : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                }`}
              >
                <span className="block font-serif text-3xl font-normal leading-none">
                  {muralItems.length}
                </span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
                    selectedMuralCatId === 'all' ? 'text-white/70' : 'text-neutral-400'
                  }`}
                >
                  Todos los Murales
                </span>
              </div>
            </div>

            {/* Category Header + "+ AGREGAR MURAL" Button */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  {selectedMuralCatId === 'all'
                    ? 'Todos los Murales'
                    : activeCategoryObj?.label || 'Murales'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {filteredMurals.length} {filteredMurals.length === 1 ? 'obra' : 'obras'}
                </p>
              </div>

              <button
                type="button"
                onClick={openNewMuralModal}
                className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Mural</span>
              </button>
            </div>

            {/* Murals Gallery Cards Grid */}
            {filteredMurals.length === 0 ? (
              <div className="bg-white p-14 text-center border border-black/[0.05]">
                <p className="font-serif text-lg text-neutral-600">
                  No hay murales registrados en esta categoría todavía.
                </p>
                <button
                  type="button"
                  onClick={openNewMuralModal}
                  className="mt-4 px-5 py-2.5 bg-[#181B20] text-white text-[10px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subir primer mural</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMurals.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.galleryImages && item.galleryImages.length > 0 && (
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/75 text-white text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <Images className="w-3 h-3 text-naho-yellow" />
                          <span>+{item.galleryImages.length} fotos</span>
                        </span>
                      )}
                      {/* Hover quick actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditMuralModal(item)}
                          className="p-2 bg-white/95 hover:bg-white text-neutral-900 shadow-sm cursor-pointer"
                          title="Editar mural"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              title: `¿Eliminar mural "${item.title}"?`,
                              message:
                                'Esta obra se eliminará del catálogo público de murales. Esta acción no se puede deshacer.',
                              confirmLabel: 'Sí, eliminar mural',
                              onConfirm: () => {
                                deleteMuralItem(item.id);
                                showToast(`Mural "${item.title}" eliminado.`);
                              },
                            });
                          }}
                          className="p-2 bg-white/95 hover:bg-rose-600 hover:text-white text-rose-600 shadow-sm cursor-pointer transition-colors"
                          title="Eliminar mural"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#181B20] text-white p-4 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-normal text-white truncate">
                          {item.title}
                        </h3>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/50 truncate mt-0.5">
                          {item.details?.dimensions} • {item.details?.location || 'Tampico'}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: CURSOS MENSUALES Y ALUMNOS INSCRITOS
           ============================================================ */}
        {activeTab === 'cursos' && (
          <div className="space-y-12">
            {/* Top Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setSelectedCoursesView('catalogo')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedCoursesView('catalogo');
                }}
                className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
                  selectedCoursesView === 'catalogo'
                    ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                    : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                }`}
              >
                <span className="block font-serif text-3xl font-normal leading-none">
                  {courses.length}
                </span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
                    selectedCoursesView === 'catalogo' ? 'text-white/70' : 'text-neutral-400'
                  }`}
                >
                  Cursos Publicados
                </span>
              </div>

              <div
                onClick={() => setSelectedCoursesView('inscritos')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedCoursesView('inscritos');
                }}
                className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
                  selectedCoursesView === 'inscritos'
                    ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                    : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                }`}
              >
                <span className="block font-serif text-3xl font-normal leading-none">
                  {courseEnrollments.length}
                </span>
                <span
                  className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
                    selectedCoursesView === 'inscritos' ? 'text-white/70' : 'text-neutral-400'
                  }`}
                >
                  Alumnos Inscritos
                </span>
              </div>
            </div>

            {selectedCoursesView === 'catalogo' ? (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                      Cursos del Mes
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      {courses.filter((c) => c.active !== false).length} activos al público •{' '}
                      {courses.filter((c) => c.active === false).length} ocultos en borrador
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openNewCourseModal}
                    className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Curso</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const isCourseActive = course.active !== false;
                    return (
                      <article
                        key={course.id}
                        className={`group bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between transition-opacity ${
                          isCourseActive ? '' : 'opacity-75 ring-1 ring-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                              <span className="px-2.5 py-1 bg-[#181B20]/90 text-white text-[9px] font-semibold uppercase tracking-[0.18em]">
                                {course.monthLabel}
                              </span>
                              <span
                                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                                  isCourseActive
                                    ? 'bg-emerald-600/95 text-white'
                                    : 'bg-amber-500/95 text-neutral-950'
                                }`}
                              >
                                {isCourseActive ? 'Visible' : 'Oculto / Borrador'}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  updateCourse({ ...course, active: !isCourseActive });
                                  showToast(
                                    !isCourseActive
                                      ? `Curso "${course.title}" activado al público.`
                                      : `Curso "${course.title}" pausado (oculto en la web).`
                                  );
                                }}
                                className="p-2 bg-white/95 hover:bg-white text-neutral-900 shadow-sm cursor-pointer"
                                title={
                                  isCourseActive
                                    ? 'Pausar / ocultar curso del sitio público'
                                    : 'Activar / mostrar curso en el sitio público'
                                }
                              >
                                {isCourseActive ? (
                                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditCourseModal(course)}
                                className="p-2 bg-white/95 hover:bg-white text-neutral-900 shadow-sm cursor-pointer"
                                title="Editar curso y link"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDialog({
                                    title: `¿Eliminar curso "${course.title}"?`,
                                    message:
                                      'Se eliminará este curso del catálogo. Si solo deseas ocultarlo temporalmente sin perder su configuración, usa el botón de Ocultar / Pausar.',
                                    confirmLabel: 'Sí, eliminar curso',
                                    onConfirm: () => {
                                      deleteCourse(course.id);
                                      showToast('Curso eliminado.');
                                    },
                                  });
                                }}
                                className="p-2 bg-white/95 hover:bg-rose-600 hover:text-white text-rose-600 shadow-sm cursor-pointer transition-colors"
                                title="Eliminar curso"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-naho-pink">
                                {course.eventDateDisplay} • {course.eventTimeDisplay}
                              </span>
                              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[9px] font-bold uppercase tracking-wider rounded">
                                {course.modality === 'presencial'
                                  ? 'Presencial'
                                  : course.modality === 'hibrido'
                                  ? 'Híbrido'
                                  : 'Online En Vivo'}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg text-neutral-900 leading-snug">
                              {course.title}
                            </h3>
                            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-naho-blue shrink-0" />
                              <span className="truncate">{course.level}</span>
                            </p>
                            <p className="text-xs text-neutral-500 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="pt-2 border-t border-black/[0.05] text-[11px] font-mono text-neutral-500 truncate">
                              Link: <span className="text-neutral-900">{course.meetingLink}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#181B20] text-white px-5 py-3.5 flex items-center justify-between text-xs">
                          <span className="font-serif text-base">
                            ${course.price.toLocaleString('es-MX')} MXN
                          </span>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                              Cupo: {course.enrolledCount}/{course.maxSpots}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentCourseFilter(course.id);
                                setActiveTab('alumnos');
                              }}
                              className="px-2.5 py-1 bg-white/10 hover:bg-naho-pink text-white text-[9px] font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Ver alumnos inscritos en este curso"
                            >
                              <Users className="w-3 h-3 text-naho-pink" />
                              <span>Alumnos</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Enrolled Students Sub-view */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                      Alumnos Inscritos
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Cada alumno tiene 1 boleto personal vinculado a su correo electrónico
                    </p>
                  </div>

                  {courseEnrollments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleExportStudentsCsv(courseEnrollments)}
                        className="px-4 py-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-naho-pink" />
                        <span>Exportar CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const emails = Array.from(
                            new Set(courseEnrollments.map((e) => e.buyerEmail.trim()))
                          ).join(', ');
                          navigator.clipboard.writeText(emails);
                          showToast('Correos de alumnos copiados para Google Meet.');
                        }}
                        className="px-5 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Correos Autorizados</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-black/[0.06]">
                  {courseEnrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 bg-[#181B20] text-white">
                            {enr.folio}
                          </span>
                          <h3 className="font-serif text-lg text-neutral-900">
                            {enr.buyerName}
                          </h3>
                        </div>
                        <p className="text-xs font-medium text-neutral-700">{enr.courseTitle}</p>
                        <p className="text-xs text-neutral-400 font-mono">
                          {enr.buyerEmail} • Tel: {enr.buyerPhone} • {enr.purchasedAt}
                        </p>
                      </div>

                      <div className="text-left sm:text-right flex flex-col sm:items-end gap-2">
                        <div>
                          <span className="font-serif text-xl text-neutral-900 block">
                            ${enr.totalPaid.toLocaleString('es-MX')} MXN
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-semibold">
                            1 Boleto Personal Confirmado
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleResendStudentTicket(enr)}
                            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#181B20] hover:text-white text-neutral-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-naho-pink" />
                            <span>Reenviar Boleto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentCourseFilter(enr.courseId);
                              setActiveTab('alumnos');
                            }}
                            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#181B20] hover:text-white text-neutral-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Users className="w-3 h-3 text-naho-pink" />
                            <span>Ver Ficha</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: COTIZACIONES DE MURALES
           ============================================================ */}
        {activeTab === 'cotizaciones' && (
          <div className="space-y-12">
            {/* Status Filter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { id: 'todas' as const, label: 'Todas', count: quoteTickets.length },
                {
                  id: 'nuevo' as const,
                  label: 'Nuevas',
                  count: quoteTickets.filter((q) => q.status === 'nuevo').length,
                },
                {
                  id: 'en_revision' as const,
                  label: 'En Revisión',
                  count: quoteTickets.filter((q) => q.status === 'en_revision').length,
                },
                {
                  id: 'propuesta_enviada' as const,
                  label: 'Propuesta Enviada',
                  count: quoteTickets.filter((q) => q.status === 'propuesta_enviada').length,
                },
                {
                  id: 'aprobado' as const,
                  label: 'Aprobadas',
                  count: quoteTickets.filter((q) => q.status === 'aprobado').length,
                },
              ].map((st) => {
                const isSelected = selectedQuoteFilter === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedQuoteFilter(st.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedQuoteFilter(st.id);
                    }}
                    className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
                      isSelected
                        ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                        : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <span className="block font-serif text-3xl font-normal leading-none">
                      {st.count}
                    </span>
                    <span
                      className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
                        isSelected ? 'text-white/70' : 'text-neutral-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  Cotizaciones de Murales
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Solicitudes exclusivas de Tampico, Ciudad Madero y Altamira
                </p>
              </div>

              {filteredQuotes.length === 0 ? (
                <div className="bg-white p-14 text-center border border-black/[0.05]">
                  <p className="font-serif text-lg text-neutral-600">
                    No hay cotizaciones en este estado.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredQuotes.map((ticket) => (
                    <article
                      key={ticket.folio}
                      className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-[#181B20] text-white font-mono text-xs">
                            {ticket.folio}
                          </span>
                          <span className="font-serif text-xl text-neutral-900">
                            {ticket.formData.clientName}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">
                            • {ticket.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            aria-label={`Estado de ${ticket.folio}`}
                            value={ticket.status}
                            onChange={(e) => {
                              updateQuoteTicketStatus(
                                ticket.folio,
                                e.target.value as QuoteTicket['status']
                              );
                              showToast(`Estado de ${ticket.folio} actualizado.`);
                            }}
                            className="px-3.5 py-2 border border-neutral-200 text-xs uppercase tracking-[0.14em] font-semibold bg-[#F5F2EB]/60 text-neutral-800 focus:outline-none"
                          >
                            <option value="nuevo">Nueva</option>
                            <option value="en_revision">En Revisión</option>
                            <option value="propuesta_enviada">Propuesta Enviada</option>
                            <option value="aprobado">Aprobada</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                title: `¿Eliminar cotización ${ticket.folio}?`,
                                message: `Se eliminará permanentemente la solicitud de ${ticket.formData.clientName}.`,
                                confirmLabel: 'Sí, eliminar cotización',
                                onConfirm: () => {
                                  deleteQuoteTicket(ticket.folio);
                                  showToast(`Cotización ${ticket.folio} eliminada.`);
                                },
                              });
                            }}
                            className="p-2 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Eliminar cotización"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                                Tipo de Mural
                              </span>
                              <p className="font-semibold text-neutral-900 mt-1">
                                {ticket.formData.muralCategory === 'Otro tipo de mural' &&
                                ticket.formData.customMuralType
                                  ? `Otro: ${ticket.formData.customMuralType}`
                                  : ticket.formData.muralCategory || 'Mural Personalizado'}
                              </p>
                              <p className="text-neutral-500 mt-0.5">
                                {ticket.formData.dimensions}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                                Ciudad y Fecha
                              </span>
                              <p className="font-semibold text-neutral-900 mt-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-naho-pink" />
                                {ticket.formData.cityZone || ticket.formData.clientLocation}
                              </p>
                              <p className="text-neutral-500 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                {ticket.formData.deadlineDate || 'Fecha flexible'}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                                Contacto Directo
                              </span>
                              <a
                                href={`https://wa.me/52${ticket.formData.clientPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-emerald-700 hover:text-emerald-800 hover:underline mt-1 flex items-center gap-1 font-semibold"
                                title="Abrir WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                                <span>{ticket.formData.clientPhone}</span>
                              </a>
                              <a
                                href={`mailto:${ticket.formData.clientEmail}`}
                                className="font-mono text-neutral-500 hover:text-neutral-900 hover:underline truncate mt-0.5 flex items-center gap-1"
                                title="Enviar correo"
                              >
                                <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="truncate">{ticket.formData.clientEmail}</span>
                              </a>
                            </div>
                          </div>

                          <div className="p-5 bg-[#F5F2EB]/60 border-l-2 border-[#181B20] space-y-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                              Idea descrita por el cliente
                            </span>
                            <p className="text-sm text-neutral-800 leading-relaxed">
                              &ldquo;{ticket.formData.themeAndDetails}&rdquo;
                            </p>
                          </div>

                          {/* Internal Notes & Quoted Budget (#16) */}
                          <div className="p-4 bg-white border border-black/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                                Presupuesto Cotizado ($ MXN)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Ej. 8500"
                                  value={ticket.quotedAmount ?? ''}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    updateQuoteTicketDetails(ticket.folio, {
                                      quotedAmount: raw === '' ? undefined : Number(raw),
                                    });
                                  }}
                                  className="w-full pl-7 pr-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-8">
                              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                                Notas Internas / Seguimiento de Nahomy (Privado)
                              </label>
                              <input
                                type="text"
                                placeholder="Ej. Se acordó visita técnica el viernes a las 4pm, requiere andamio..."
                                value={ticket.adminNotes ?? ''}
                                onChange={(e) =>
                                  updateQuoteTicketDetails(ticket.folio, {
                                    adminNotes: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            {/* WhatsApp Direct Action */}
                            <a
                              href={`https://wa.me/52${ticket.formData.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hola ${ticket.formData.clientName}! Te saluda Nahomy de Nahocraft Centro de Arte en Tampico 🎨 Te escribo respecto a tu solicitud de cotización (${ticket.folio}) para tu proyecto de ${ticket.formData.muralCategory || 'mural'} en ${ticket.formData.cityZone || 'Tampico'}. Me encantó tu idea y me gustaría platicar los detalles y medidas (${ticket.formData.dimensions}). ¿Cómo estás?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>Mandar WhatsApp</span>
                            </a>

                            {/* Email Direct Action */}
                            <a
                              href={`mailto:${
                                ticket.formData.clientEmail
                              }?subject=${encodeURIComponent(
                                `Cotización de Mural ${ticket.folio} • Nahocraft Centro de Arte`
                              )}&body=${encodeURIComponent(
                                `Hola ${ticket.formData.clientName},\n\nGracias por comunicarte con Nahocraft Centro de Arte en Tampico. Recibí con mucho gusto tu solicitud para la cotización de tu mural (${ticket.folio}) en ${ticket.formData.cityZone || 'Tampico'}.\n\nMe encantaría afinar los detalles de tu espacio, medidas (${ticket.formData.dimensions}) y tu idea para prepararte una propuesta visual a la medida.\n\nQuedo a tus órdenes,\nNahomy • Nahocraft Centro de Arte\n+52 833 365 5622\nTampico, Tamaulipas`
                              )}`}
                              className="px-5 py-2.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Responder por Correo</span>
                            </a>
                          </div>
                        </div>

                        <div className="lg:col-span-4">
                          {ticket.formData.referenceImagePreview ? (
                            <div className="space-y-2">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                                Referencia adjunta
                              </span>
                              <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/[0.06]">
                                <img
                                  src={ticket.formData.referenceImagePreview}
                                  alt="Referencia del cliente"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="h-full min-h-[140px] border border-dashed border-neutral-300 flex items-center justify-center p-4 text-center text-xs text-neutral-400">
                              Sin imagen de referencia adjunta
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB: ALUMNOS & ASISTENCIA (Filtrado por curso específico)
           ============================================================ */}
        {activeTab === 'alumnos' && (
          <div className="space-y-8">
            {/* Header section with title and quick actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-naho-pink block mb-1">
                  Gestión de Estudiantes & Enlaces a Google Meet
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  Alumnos Inscritos
                </h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                  Revisa los boletos confirmados, filtra por curso específico, obtén sus códigos de acceso a la sala virtual y comunícate con cada alumno por WhatsApp o correo.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                {filteredEnrollments.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleExportStudentsCsv(filteredEnrollments)}
                      className="px-4 py-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                      title="Descargar lista en CSV compatible con Excel"
                    >
                      <Download className="w-3.5 h-3.5 text-naho-pink" />
                      <span>Exportar CSV ({filteredEnrollments.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const emails = Array.from(
                          new Set(filteredEnrollments.map((e) => e.buyerEmail.trim()))
                        ).join(', ');
                        navigator.clipboard.writeText(emails);
                        setCopiedStudentEmails(true);
                        setTimeout(() => setCopiedStudentEmails(false), 2500);
                        showToast(
                          selectedStudentCourseFilter === 'all'
                            ? 'Todos los correos copiados al portapapeles.'
                            : `Correos del curso "${activeFilteredCourseObj?.title || 'seleccionado'}" copiados.`
                        );
                      }}
                      className="px-5 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
                      title="Copiar correos de la lista actual para invitaciones en Google Meet"
                    >
                      {copiedStudentEmails ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Correos Copiados!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-naho-pink" />
                          <span>Copiar Correos ({filteredEnrollments.length})</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('cursos')}
                  className="px-4 py-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Gestionar Cursos</span>
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 border-b-2 border-neutral-900 shadow-xs">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Total Alumnos
                </span>
                <span className="block font-serif text-3xl font-normal text-neutral-900 mt-1">
                  {courseEnrollments.length}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">En todos los cursos</span>
              </div>

              <div className="bg-white p-5 border-b-2 border-naho-pink shadow-xs">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  En Vista Actual
                </span>
                <span className="block font-serif text-3xl font-normal text-naho-pink mt-1">
                  {filteredEnrollments.length}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {selectedStudentCourseFilter === 'all' ? 'Sin filtro de curso' : 'Filtrados por curso'}
                </span>
              </div>

              <div className="bg-white p-5 border-b-2 border-emerald-600 shadow-xs">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Total Recaudado
                </span>
                <span className="block font-serif text-2xl sm:text-3xl font-normal text-emerald-800 mt-1">
                  ${filteredCourseRevenue.toLocaleString('es-MX')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">MXN boletos confirmados</span>
              </div>

              <div className="bg-white p-5 border-b-2 border-naho-blue shadow-xs">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Cursos Disponibles
                </span>
                <span className="block font-serif text-3xl font-normal text-neutral-900 mt-1">
                  {courses.length}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">En catálogo mensual</span>
              </div>
            </div>

            {/* Course Filter Ribbon & Search Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-naho-pink" />
                  Filtrar por Curso Específico
                </span>
                {selectedStudentCourseFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedStudentCourseFilter('all')}
                    className="text-[10px] font-semibold uppercase tracking-wider text-naho-pink hover:underline cursor-pointer"
                  >
                    Ver todos los cursos ({courseEnrollments.length})
                  </button>
                )}
              </div>

              {/* Course Selector Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Option 1: Todos los cursos */}
                <button
                  type="button"
                  onClick={() => setSelectedStudentCourseFilter('all')}
                  className={`p-4 text-left border transition-all cursor-pointer rounded-xl flex items-center justify-between ${
                    selectedStudentCourseFilter === 'all'
                      ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                      : 'bg-white text-neutral-900 border-black/[0.08] hover:border-black/20 shadow-xs'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                      General
                    </span>
                    <span className="font-serif text-sm font-bold block truncate mt-0.5">
                      Todos los Cursos
                    </span>
                    <span className="text-[10px] opacity-70 block mt-0.5">
                      {courseEnrollments.length} alumnos registrados
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                      selectedStudentCourseFilter === 'all'
                        ? 'bg-naho-pink text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {courseEnrollments.length}
                  </span>
                </button>

                {/* Option N: Each specific course */}
                {courses.map((c) => {
                  const count = courseEnrollments.filter((e) => e.courseId === c.id).length;
                  const isSelected = selectedStudentCourseFilter === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedStudentCourseFilter(c.id)}
                      className={`p-4 text-left border transition-all cursor-pointer rounded-xl flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                          : 'bg-white text-neutral-900 border-black/[0.08] hover:border-black/20 shadow-xs'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                          {c.monthLabel}
                        </span>
                        <span className="font-serif text-sm font-bold block truncate mt-0.5" title={c.title}>
                          {c.title}
                        </span>
                        <span className="text-[10px] opacity-70 block mt-0.5 truncate">
                          {c.eventDateDisplay}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-naho-pink text-white'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Course Spotlight Banner (when a specific course is filtered) */}
              {activeFilteredCourseObj && (
                <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-900 via-[#181B20] to-neutral-900 text-white rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-naho-pink/20 text-naho-pink border border-naho-pink/30">
                        {activeFilteredCourseObj.monthLabel}
                      </span>
                      <span className="text-xs text-neutral-300 font-mono">
                        {activeFilteredCourseObj.eventDateDisplay} • {activeFilteredCourseObj.eventTimeDisplay}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {activeFilteredCourseObj.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1">
                      {activeFilteredCourseObj.subtitle || activeFilteredCourseObj.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Google Meet: {activeFilteredCourseObj.meetingLink}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={activeFilteredCourseObj.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Abrir Sala de Meet</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeFilteredCourseObj.meetingLink);
                        showToast('Enlace de Google Meet copiado.');
                      }}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Link</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="Buscar alumno por nombre, correo, teléfono, folio (#CURSO-...) o clave de acceso (NAHO-...)"
                  className="w-full pl-11 pr-10 py-3 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-naho-pink shadow-xs"
                />
                {studentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Student Roster Section */}
            {filteredEnrollments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-black/[0.06] shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  No se encontraron alumnos
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {selectedStudentCourseFilter !== 'all'
                    ? 'No hay alumnos registrados todavía para este curso en específico o no coinciden con los términos de búsqueda.'
                    : 'No hay alumnos inscritos con los términos de búsqueda ingresados.'}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  {selectedStudentCourseFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedStudentCourseFilter('all')}
                      className="px-4 py-2 bg-[#181B20] text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg cursor-pointer hover:bg-naho-pink transition-colors"
                    >
                      Ver todos los cursos
                    </button>
                  )}
                  {studentSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchQuery('')}
                      className="px-4 py-2 bg-neutral-100 text-neutral-700 text-[10px] font-semibold uppercase tracking-wider rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-500 px-1 font-medium">
                  <span>
                    Mostrando <strong className="text-neutral-900">{filteredEnrollments.length}</strong> {filteredEnrollments.length === 1 ? 'alumno' : 'alumnos'}
                    {selectedStudentCourseFilter !== 'all' && ` en "${activeFilteredCourseObj?.title || 'este curso'}"`}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    Boleto personal intransferible
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredEnrollments.map((enr) => {
                    // Extract initials for avatar
                    const initials = enr.buyerName
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    const paymentLabel =
                      enr.paymentMethod === 'tarjeta'
                        ? 'Tarjeta'
                        : enr.paymentMethod === 'transferencia'
                        ? 'SPEI / Transferencia'
                        : 'OXXO / Efectivo';

                    return (
                      <div
                        key={enr.id}
                        className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
                      >
                        {/* Top: Avatar, Name, Folio, Access Code */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-white/20 shadow-xs">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-serif text-lg font-bold text-neutral-900 truncate leading-tight">
                                  {enr.buyerName}
                                </h3>
                                <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                                  Registrado: {enr.purchasedAt}
                                </span>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Confirmado</span>
                            </span>
                          </div>

                          {/* Folio & Access Code Badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[10px] font-mono font-bold tracking-wider">
                              {enr.folio}
                            </span>
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-naho-pink/10 border border-naho-pink/20 text-naho-pink rounded-lg text-[10px] font-mono font-bold">
                              <Ticket className="w-3 h-3" />
                              <span>Clave: {enr.accessCode}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(enr.accessCode);
                                  showToast(`Clave ${enr.accessCode} copiada.`);
                                }}
                                className="ml-1 hover:text-neutral-900 cursor-pointer"
                                title="Copiar clave de acceso"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-black/5">
                              {paymentLabel}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Course & Schedule Details */}
                        <div className="p-3.5 rounded-xl bg-[#F5F2EB]/60 border border-black/[0.04] space-y-2">
                          <div className="flex items-start gap-2 text-xs font-semibold text-neutral-900 leading-snug">
                            <Video className="w-3.5 h-3.5 text-naho-pink shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{enr.courseTitle}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-neutral-600 pt-1 border-t border-black/[0.04]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="truncate">{enr.courseDateDisplay}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="font-mono truncate">{enr.courseTimeDisplay}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 text-neutral-700">
                            <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <a
                              href={`mailto:${enr.buyerEmail}`}
                              className="font-mono text-neutral-600 hover:text-naho-pink hover:underline truncate"
                            >
                              {enr.buyerEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-700">
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                            <span className="font-mono text-neutral-800 font-semibold">{enr.buyerPhone}</span>
                          </div>
                        </div>

                        {/* Bottom Row: Amount paid & 1-Click Action Buttons */}
                        <div className="pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
                              Total Pagado
                            </span>
                            <span className="font-serif text-base font-bold text-neutral-900">
                              ${enr.totalPaid.toLocaleString('es-MX')} MXN
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Resend Ticket Email (#5) */}
                            <button
                              type="button"
                              onClick={() => handleResendStudentTicket(enr)}
                              className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Reenviar boleto y código de acceso al correo del alumno"
                            >
                              <Send className="w-3 h-3 text-naho-pink" />
                              <span>Reenviar</span>
                            </button>

                            {/* WhatsApp Direct Action */}
                            <a
                              href={`https://wa.me/52${enr.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `¡Hola ${enr.buyerName}! Te saluda Nahomy de Nahocraft Centro de Arte 🎨 Te escribo respecto a tu inscripción a '${enr.courseTitle}'. Tu código de acceso personal es ${enr.accessCode}. La sesión en vivo será el ${enr.courseDateDisplay} a las ${enr.courseTimeDisplay} por Google Meet. ¿Tienes alguna duda antes de la clase?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
                              title="Enviar mensaje por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Email Direct Action */}
                            <a
                              href={`mailto:${enr.buyerEmail}?subject=${encodeURIComponent(
                                `Nahocraft • Acceso a tu curso "${enr.courseTitle}"`
                              )}&body=${encodeURIComponent(
                                `Hola ${enr.buyerName},\n\nTe saluda Nahomy de Nahocraft Centro de Arte en Tampico.\n\nTe confirmo tu lugar para el curso "${enr.courseTitle}".\n\nDetalles de tu sesión:\n- Folio: ${enr.folio}\n- Código de Acceso: ${enr.accessCode}\n- Fecha: ${enr.courseDateDisplay}\n- Horario: ${enr.courseTimeDisplay}\n- Sala de Google Meet: ${enr.meetingLink}\n\nRecomendaciones:\n1. Conéctate 5 minutos antes para probar tu micrófono y cámara.\n2. Ten listos tus materiales y lienzos.\n\n¡Nos vemos en clase!\n\nNahomy • Nahocraft Centro de Arte\nTampico, Tamaulipas`
                              )}`}
                              className="px-3 py-2 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
                              title="Enviar correo personalizado"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Correo</span>
                            </a>

                            {/* Cancel / Unenroll Student (#5 & #11) */}
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  title: `¿Dar de baja a ${enr.buyerName}?`,
                                  message: `Se cancelará el boleto ${enr.folio} (${enr.accessCode}) y se liberará +1 lugar disponible en el curso "${enr.courseTitle}".`,
                                  confirmLabel: 'Sí, cancelar boleto y liberar cupo',
                                  onConfirm: () => {
                                    deleteCourseEnrollment(enr.id);
                                    showToast(`Boleto de ${enr.buyerName} cancelado y cupo liberado.`);
                                  },
                                });
                              }}
                              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Cancelar boleto y liberar lugar en el curso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 4: SOBRE MÍ
           ============================================================ */}
        {activeTab === 'sobre-mi' && (
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
                onClick={() => showToast('Sección "Sobre Mí" guardada.')}
                className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Form Editor (7 cols) */}
              <div className="xl:col-span-7 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-8">
                {/* Portrait & Secondary Image Upload Row (#9) */}
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
                        <span>Cambiar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) => {
                              updateAboutMe({ portraitImage: url });
                              showToast('Fotografía principal actualizada.');
                            })
                          }
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
                        <span>Cambiar Secundaria</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) => {
                              updateAboutMe({ secondaryImage: url });
                              showToast('Fotografía secundaria actualizada.');
                            })
                          }
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
                      onChange={(e) => updateAboutMe({ badge: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ signatureText: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ title: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ subtitle: e.target.value })}
                      className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Metric Counters (#9) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F5F2EB]/60 border border-black/[0.05]">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1">
                      Años de Experiencia
                    </label>
                    <input
                      type="text"
                      value={aboutMe.yearsExperience}
                      onChange={(e) => updateAboutMe({ yearsExperience: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ muralCountLabel: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ studentsCountLabel: e.target.value })}
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
                    onChange={(e) => updateAboutMe({ philosophyQuote: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ bioParagraph1: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ bioParagraph2: e.target.value })}
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
                      onChange={(e) => updateAboutMe({ bioParagraph3: e.target.value })}
                      className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Highlights / Pilares Editor (#9) */}
                {aboutMe.highlights && aboutMe.highlights.length > 0 && (
                  <div className="pt-4 border-t border-black/[0.06] space-y-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block">
                      Tarjetas Destacadas de Trayectoria (3 Pilares)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {aboutMe.highlights.map((hl, idx) => (
                        <div
                          key={idx}
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
                                updateAboutMe({ highlights: next });
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
                                updateAboutMe({ highlights: next });
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

              {/* Right Column: Sticky Live Visual Mockup (5 cols) */}
              <div className="xl:col-span-5 xl:sticky xl:top-28 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
                  <span className="flex items-center gap-1.5 text-naho-pink">
                    <Sparkles className="w-3.5 h-3.5" />
                    Vista Previa en Vivo en el Sitio
                  </span>
                  <span className="text-[10px] text-neutral-400">Sección Pública</span>
                </div>

                <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-xl space-y-5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-naho-pink/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/[0.04] text-neutral-700 border border-black/[0.06]">
                    <Sparkles className="w-3 h-3 text-naho-pink" />
                    {aboutMe.badge || 'Sobre Mí • Artista Visual'}
                  </div>

                  {/* Portrait Card */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-black/[0.04] shadow-xs">
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 bg-neutral-100 border border-black/10">
                      <img
                        src={aboutMe.portraitImage}
                        alt="Retrato de Nahomy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white p-0.5 shadow-xs">
                        <img src={localAssets.logo} alt="Sello" className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-naho-pink block">
                        Artista & Fundadora
                      </span>
                      <h3 className="font-serif text-xl text-neutral-900 leading-tight">
                        {aboutMe.title || 'Nahomy'}
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        {aboutMe.subtitle || 'Muralista en Tampico'}
                      </p>
                      <p className="text-[11px] font-serif italic text-neutral-600 pt-1 border-t border-black/[0.05]">
                        ✍️ {aboutMe.signatureText || 'Nahomy • Centro de Arte'}
                      </p>
                    </div>
                  </div>

                  {/* Philosophy Quote */}
                  <div className="p-4 rounded-2xl bg-white border-l-4 border-naho-pink shadow-xs">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                      Filosofía Artística
                    </span>
                    <p className="font-serif italic text-xs sm:text-sm text-neutral-800 leading-relaxed">
                      &ldquo;{aboutMe.philosophyQuote || 'Cada obra y cada mural nacen de una emoción...'}&rdquo;
                    </p>
                  </div>

                  {/* Bio Paragraphs Snippet */}
                  <div className="bg-white/80 p-4 rounded-2xl space-y-2 text-xs text-neutral-600 leading-relaxed border border-black/[0.03]">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block">
                      Extracto de Biografía
                    </span>
                    <p className="line-clamp-3">
                      {aboutMe.bioParagraph1}
                    </p>
                    {aboutMe.bioParagraph2 && (
                      <p className="line-clamp-2 text-neutral-500 pt-1 border-t border-black/[0.04]">
                        {aboutMe.bioParagraph2}
                      </p>
                    )}
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
                      <span className="block font-serif text-xs font-bold text-neutral-900 leading-tight truncate">
                        {aboutMe.yearsExperience || '+6 Años'}
                      </span>
                      <span className="block text-[8px] uppercase tracking-wider text-neutral-400 mt-0.5">
                        Trayectoria
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
                      <span className="block font-serif text-xs font-bold text-neutral-900 leading-tight truncate">
                        {aboutMe.muralCountLabel || 'Muralismo'}
                      </span>
                      <span className="block text-[8px] uppercase tracking-wider text-neutral-400 mt-0.5">
                        Obra a Medida
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
                      <span className="block font-serif text-xs font-bold text-naho-pink leading-tight truncate">
                        {aboutMe.studentsCountLabel || 'Taller de Arte'}
                      </span>
                      <span className="block text-[8px] uppercase tracking-wider text-neutral-400 mt-0.5">
                        Formación
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: HERO, TALLER FÍSICO Y CLASES PRESENCIALES
           ============================================================ */}
        {activeTab === 'hero-taller' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-naho-pink/10 text-naho-pink mb-2">
                  <Eye className="w-3.5 h-3.5" />
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
                onClick={() => showToast('Configuración del Hero y Taller guardada.')}
                className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Editor (7 cols) */}
              <div className="xl:col-span-7 space-y-8">
                {/* Hero & General Contact */}
                <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-6">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                    <div>
                      <h3 className="font-serif text-xl text-neutral-900 font-normal">
                        Textos de la Portada Principal & Contacto
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        El primer mensaje que ven tus visitantes al entrar a la web
                      </p>
                    </div>
                    <Store className="w-5 h-5 text-naho-pink" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Insignia Superior del Hero (Badge)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.heroBadge}
                        onChange={(e) => updateSiteConfig({ heroBadge: e.target.value })}
                        className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Nombre Oficial del Estudio
                      </label>
                      <input
                        type="text"
                        value={siteConfig.studioName}
                        onChange={(e) => updateSiteConfig({ studioName: e.target.value })}
                        className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Título Principal (Línea 1)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.heroTitleLine1}
                        onChange={(e) => updateSiteConfig({ heroTitleLine1: e.target.value })}
                        className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Título Destacado (Línea 2 con Gradiente)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.heroTitleHighlight}
                        onChange={(e) => updateSiteConfig({ heroTitleHighlight: e.target.value })}
                        className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none font-semibold text-naho-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                      Descripción de Portada
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.heroDescription}
                      onChange={(e) => updateSiteConfig({ heroDescription: e.target.value })}
                      className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-black/[0.05]">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Dirección del Taller Físico
                      </label>
                      <input
                        type="text"
                        value={siteConfig.studioAddress}
                        onChange={(e) => updateSiteConfig({ studioAddress: e.target.value })}
                        className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Correo Oficial de Notificaciones
                      </label>
                      <input
                        type="email"
                        value={siteConfig.adminEmail}
                        onChange={(e) => updateSiteConfig({ adminEmail: e.target.value })}
                        className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        Teléfono Visible al Público
                      </label>
                      <input
                        type="text"
                        value={siteConfig.studioPhone}
                        onChange={(e) => updateSiteConfig({ studioPhone: e.target.value })}
                        className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                        WhatsApp (con código de país, ej. 528333655622)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.studioWhatsapp}
                        onChange={(e) => updateSiteConfig({ studioWhatsapp: e.target.value })}
                        className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Social Media Handles & Links (#9) */}
                  <div className="pt-4 border-t border-black/[0.06] space-y-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 block">
                      Redes Sociales Oficiales (Usuarios y Enlaces)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-naho-pink block">
                          Instagram
                        </span>
                        <input
                          type="text"
                          placeholder="@nahocraft"
                          value={siteConfig.instagramHandle || ''}
                          onChange={(e) => updateSiteConfig({ instagramHandle: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        <input
                          type="url"
                          placeholder="https://instagram.com/nahocraft"
                          value={siteConfig.instagramUrl || ''}
                          onChange={(e) => updateSiteConfig({ instagramUrl: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 block">
                          TikTok
                        </span>
                        <input
                          type="text"
                          placeholder="@nahocraft"
                          value={siteConfig.tiktokHandle || ''}
                          onChange={(e) => updateSiteConfig({ tiktokHandle: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        <input
                          type="url"
                          placeholder="https://tiktok.com/@nahocraft"
                          value={siteConfig.tiktokUrl || ''}
                          onChange={(e) => updateSiteConfig({ tiktokUrl: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-naho-blue block">
                          Facebook
                        </span>
                        <input
                          type="text"
                          placeholder="Nahocraft Centro de Arte"
                          value={siteConfig.facebookHandle || ''}
                          onChange={(e) => updateSiteConfig({ facebookHandle: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        <input
                          type="url"
                          placeholder="https://facebook.com/nahocraft"
                          value={siteConfig.facebookUrl || ''}
                          onChange={(e) => updateSiteConfig({ facebookUrl: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                          YouTube
                        </span>
                        <input
                          type="text"
                          placeholder="Nahocraft Studio"
                          value={siteConfig.youtubeHandle || ''}
                          onChange={(e) => updateSiteConfig({ youtubeHandle: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        <input
                          type="url"
                          placeholder="https://youtube.com/@nahocraft"
                          value={siteConfig.youtubeUrl || ''}
                          onChange={(e) => updateSiteConfig({ youtubeUrl: e.target.value })}
                          className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Studio Weekly Schedule Editor (#8) */}
                <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-5">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                    <div>
                      <h3 className="font-serif text-xl text-neutral-900 font-normal">
                        Horarios del Taller Físico (Abierto / Cerrado en Tiempo Real)
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        El indicador &ldquo;Taller Abierto / Cerrado&rdquo; en la barra superior se calcula automáticamente con estos horarios
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-naho-blue" />
                  </div>

                  <div className="divide-y divide-black/[0.06]">
                    {weeklySchedule.map((dayItem, idx) => {
                      const formatHourLabel = (h: number) => {
                        if (h === 0) return '12:00 AM';
                        if (h < 12) return `${h}:00 AM`;
                        if (h === 12) return '12:00 PM';
                        return `${h - 12}:00 PM`;
                      };

                      return (
                        <div
                          key={dayItem.dayName}
                          className="py-3 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <input
                              type="checkbox"
                              checked={dayItem.isOpen}
                              onChange={(e) => {
                                const isOpen = e.target.checked;
                                const openH = dayItem.openHour ?? 15;
                                const closeH = dayItem.closeHour ?? 20;
                                const next = [...weeklySchedule];
                                next[idx] = {
                                  ...dayItem,
                                  isOpen,
                                  openHour: openH,
                                  closeHour: closeH,
                                  displayTime: isOpen
                                    ? `${formatHourLabel(openH)} – ${formatHourLabel(closeH)}`
                                    : 'Cerrado',
                                };
                                updateWeeklySchedule(next);
                              }}
                              className="accent-naho-pink w-4 h-4 rounded cursor-pointer"
                            />
                            <span className="font-serif text-sm font-semibold text-neutral-900">
                              {dayItem.dayName}
                            </span>
                          </div>

                          {dayItem.isOpen ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                                Abre:
                              </label>
                              <select
                                value={dayItem.openHour ?? 15}
                                onChange={(e) => {
                                  const openH = Number(e.target.value);
                                  const closeH = dayItem.closeHour ?? 20;
                                  const next = [...weeklySchedule];
                                  next[idx] = {
                                    ...dayItem,
                                    openHour: openH,
                                    displayTime: `${formatHourLabel(openH)} – ${formatHourLabel(closeH)}`,
                                  };
                                  updateWeeklySchedule(next);
                                }}
                                className="py-1 px-2 bg-[#F5F2EB] border border-neutral-300 text-xs font-mono"
                              >
                                {Array.from({ length: 16 }, (_, i) => i + 7).map((h) => (
                                  <option key={h} value={h}>
                                    {formatHourLabel(h)}
                                  </option>
                                ))}
                              </select>

                              <label className="text-[10px] uppercase tracking-wider text-neutral-400 ml-1">
                                Cierra:
                              </label>
                              <select
                                value={dayItem.closeHour ?? 20}
                                onChange={(e) => {
                                  const closeH = Number(e.target.value);
                                  const openH = dayItem.openHour ?? 15;
                                  const next = [...weeklySchedule];
                                  next[idx] = {
                                    ...dayItem,
                                    closeHour: closeH,
                                    displayTime: `${formatHourLabel(openH)} – ${formatHourLabel(closeH)}`,
                                  };
                                  updateWeeklySchedule(next);
                                }}
                                className="py-1 px-2 bg-[#F5F2EB] border border-neutral-300 text-xs font-mono"
                              >
                                {Array.from({ length: 16 }, (_, i) => i + 8).map((h) => (
                                  <option key={h} value={h}>
                                    {formatHourLabel(h)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                              Cerrado (Descanso)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* In-Person Classes (Niños, Adolescentes y Adultos) (#9) */}
                <div className="bg-white p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-neutral-900 font-normal">
                      Clases Presenciales en el Taller
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Programas para Niños, Adolescentes y Adultos (incluye edades, mensualidad y técnicas)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {inPersonClasses.map((cls, idx) => (
                      <div
                        key={cls.id}
                        className="p-5 bg-[#F5F2EB]/60 border border-black/[0.05] space-y-3.5"
                      >
                        <span className="inline-block px-3 py-1 bg-[#181B20] text-white text-[10px] font-semibold uppercase tracking-[0.18em]">
                          {cls.audience}
                        </span>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Rango de Edad
                          </label>
                          <input
                            type="text"
                            value={cls.ageRange}
                            onChange={(e) => {
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, ageRange: e.target.value };
                              updateInPersonClasses(next);
                            }}
                            className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Título
                          </label>
                          <input
                            type="text"
                            value={cls.title}
                            onChange={(e) => {
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, title: e.target.value };
                              updateInPersonClasses(next);
                            }}
                            className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Horarios
                          </label>
                          <input
                            type="text"
                            value={cls.scheduleSummary}
                            onChange={(e) => {
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, scheduleSummary: e.target.value };
                              updateInPersonClasses(next);
                            }}
                            className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Precio / Mensualidad
                          </label>
                          <input
                            type="text"
                            value={cls.priceInfo}
                            onChange={(e) => {
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, priceInfo: e.target.value };
                              updateInPersonClasses(next);
                            }}
                            className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Técnicas (separadas por coma)
                          </label>
                          <input
                            type="text"
                            value={cls.techniques.join(', ')}
                            onChange={(e) => {
                              const parsed = e.target.value
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean);
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, techniques: parsed };
                              updateInPersonClasses(next);
                            }}
                            className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                            Descripción
                          </label>
                          <textarea
                            rows={3}
                            value={cls.description}
                            onChange={(e) => {
                              const next = [...inPersonClasses];
                              next[idx] = { ...cls, description: e.target.value };
                              updateInPersonClasses(next);
                            }}
                            className="w-full p-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Studio Photos Gallery */}
                <div className="bg-white p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-neutral-900 font-normal">
                      Fotografías del Taller Físico ({studioPhotos.length})
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Muestra cómo se ve el estudio donde impartes clases en Tampico
                    </p>
                  </div>

                  <form
                    onSubmit={handleAddStudioPhoto}
                    className="p-6 bg-[#F5F2EB]/60 border border-black/[0.05] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
                  >
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
                        Título *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Área de caballetes"
                        value={newStudioPhoto.title}
                        onChange={(e) =>
                          setNewStudioPhoto((p) => ({ ...p, title: e.target.value }))
                        }
                        className="w-full py-2 bg-transparent border-b border-neutral-300 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
                        Descripción
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Clases vespertinas"
                        value={newStudioPhoto.caption}
                        onChange={(e) =>
                          setNewStudioPhoto((p) => ({ ...p, caption: e.target.value }))
                        }
                        className="w-full py-2 bg-transparent border-b border-neutral-300 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1.5">
                        Archivo de Imagen
                      </label>
                      <label className="w-full py-2.5 px-3 bg-white border border-neutral-300 text-[10px] font-semibold uppercase tracking-[0.16em] cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Elegir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setNewStudioPhoto((p) => ({ ...p, image: url }))
                            )
                          }
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="py-3 px-5 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer"
                    >
                      + Agregar Foto
                    </button>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {studioPhotos.map((p) => (
                      <div
                        key={p.id}
                        className="group bg-white border border-black/[0.06] overflow-hidden flex flex-col justify-between"
                      >
                        <img src={p.image} alt={p.title} className="w-full h-44 object-cover" />
                        <div className="bg-[#181B20] text-white p-4 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-serif text-sm truncate">{p.title}</p>
                            <p className="text-[10px] text-white/50 truncate">{p.caption}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                title: `¿Eliminar fotografía "${p.title}"?`,
                                message: 'Se quitará esta imagen de la galería del taller físico.',
                                confirmLabel: 'Sí, eliminar foto',
                                onConfirm: () => {
                                  deleteStudioPhoto(p.id);
                                  showToast('Foto del taller eliminada.');
                                },
                              });
                            }}
                            className="p-1.5 text-white/50 hover:text-rose-400 cursor-pointer"
                            title="Eliminar foto del taller"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Live Visual Mockup (5 cols) */}
              <div className="xl:col-span-5 xl:sticky xl:top-28 space-y-6">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
                  <span className="flex items-center gap-1.5 text-naho-pink">
                    <Sparkles className="w-3.5 h-3.5" />
                    Vista Previa de la Portada en Vivo
                  </span>
                  <span className="text-[10px] text-neutral-400">Hero Section</span>
                </div>

                {/* Hero Mockup Card */}
                <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-xl space-y-5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-naho-yellow/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-naho-pink/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/[0.04] text-neutral-700 border border-black/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-naho-pink animate-ping" />
                    {siteConfig.heroBadge || 'Centro de Arte & Muralismo • Tampico'}
                  </div>

                  {/* Title Preview */}
                  <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                      {siteConfig.heroTitleLine1 || 'Cursos de arte en vivo y'}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-yellow">
                        {siteConfig.heroTitleHighlight || 'murales que transforman espacios.'}
                      </span>
                    </h1>
                  </div>

                  {/* Description Preview */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                    {siteConfig.heroDescription ||
                      'Inscríbete a nuestros cursos mensuales con cupo limitado o cotiza un mural personalizado en Tampico, Ciudad Madero y Altamira.'}
                  </p>

                  {/* Mock CTA Buttons */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <span>Ver Cursos</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-300" />
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white text-neutral-800 text-xs font-semibold border border-black/10 shadow-2xs">
                      Cotizar Mural
                    </div>
                  </div>

                  {/* Floating Mini Mural Card */}
                  <div className="p-3 bg-white rounded-2xl border border-black/[0.05] shadow-sm flex items-center gap-3">
                    <img
                      src={localAssets.murales.dulceria}
                      alt="Mural Preview"
                      className="w-14 h-12 rounded-lg object-cover border border-black/5"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-naho-pink block">
                        Muralismo a Medida
                      </span>
                      <p className="text-xs font-bold text-neutral-900">
                        Tampico, Cd. Madero & Altamira
                      </p>
                    </div>
                  </div>
                </div>

                {/* Taller Físico Mockup Card */}
                <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                      <Store className="w-4 h-4 text-naho-pink" />
                      <span>{siteConfig.studioName || 'Nahocraft Centro de Arte'}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Horarios Activos
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5 text-neutral-700">
                      <MapPin className="w-4 h-4 text-naho-pink shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        {siteConfig.studioAddress || 'Avenida Ayuntamiento 3 - 109, Minerva, Tampico'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-700">
                      <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span className="font-mono">{siteConfig.studioPhone || '+52 833 365 5622'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-700">
                      <Mail className="w-4 h-4 text-naho-blue shrink-0" />
                      <span className="font-mono text-neutral-500">{siteConfig.adminEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/[0.05]">
              <button
                type="button"
                onClick={() => {
                  setConfirmDialog({
                    title: '¿Restaurar todos los datos a los valores iniciales?',
                    message:
                      'Se restablecerán los murales, cursos, textos y horarios originales de fábrica. Cualquier cambio o registro guardado en este navegador se reemplazará.',
                    confirmLabel: 'Sí, restaurar valores de fábrica',
                    onConfirm: () => {
                      resetAllDataToDefaults();
                      showToast('Datos restaurados a los valores por defecto.');
                    },
                  });
                }}
                className="px-5 py-2.5 border border-neutral-300 hover:border-rose-600 hover:text-rose-600 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600 inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar valores iniciales</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
          MODAL 1: NUEVA / EDITAR CATEGORÍA DE MURAL (#10)
         ============================================================ */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCategoryModal(false);
          }}
        >
          <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-lg">
                {editingCategoryId ? 'Editar Categoría de Mural' : 'Nueva Categoría de Mural'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Murales Infantiles"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  Descripción Breve
                </label>
                <input
                  type="text"
                  placeholder="Ej. Diseños para recámaras y áreas infantiles"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer"
                >
                  {editingCategoryId ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: AGREGAR / EDITAR MURAL (#10 & #15)
         ============================================================ */}
      {showMuralModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMuralModal(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-serif text-lg">
                {editingMuralId ? 'Editar Mural y Galería de Proceso' : 'Agregar Nuevo Mural'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMuralModal(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMural} className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  Título de la Obra / Mural *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mural Botánico Residencial"
                  value={muralForm.title}
                  onChange={(e) => setMuralForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={muralForm.category}
                    onChange={(e) => setMuralForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm bg-transparent focus:outline-none"
                  >
                    {muralCategories.map((c) => (
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
                    value={muralForm.dimensions}
                    onChange={(e) => setMuralForm((p) => ({ ...p, dimensions: e.target.value }))}
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
                    value={muralForm.location}
                    onChange={(e) => setMuralForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                    Técnica Utilizada (#10)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Acrílico profesional y sellador UV"
                    value={muralForm.technique}
                    onChange={(e) => setMuralForm((p) => ({ ...p, technique: e.target.value }))}
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
                    value={muralForm.curatedTag}
                    onChange={(e) => setMuralForm((p) => ({ ...p, curatedTag: e.target.value }))}
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
                    value={muralForm.tagsText}
                    onChange={(e) => setMuralForm((p) => ({ ...p, tagsText: e.target.value }))}
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
                  value={muralForm.description}
                  onChange={(e) => setMuralForm((p) => ({ ...p, description: e.target.value }))}
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
                    src={muralForm.image}
                    alt="Previsualización"
                    className="w-24 h-18 object-cover border border-black/10"
                  />
                  <label className="px-4 py-2.5 bg-[#F5F2EB] hover:bg-neutral-200 text-[10px] font-semibold uppercase tracking-[0.18em] cursor-pointer inline-flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Seleccionar Portada</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) =>
                          setMuralForm((p) => ({ ...p, image: url }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Multi-photo Gallery Manager (#15: Antes / Proceso / Detalle) */}
              <div className="p-4 bg-[#F5F2EB]/60 border border-black/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-naho-pink" />
                    Galería Adicional (Antes / Proceso / Detalles)
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {muralForm.galleryImages.length} fotos extra
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
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          setMuralForm((p) => ({
                            ...p,
                            galleryImages: [
                              ...p.galleryImages,
                              {
                                id: `slide-${Date.now()}`,
                                url,
                                label: newGallerySlideLabel,
                              },
                            ],
                          }));
                        })
                      }
                    />
                  </label>
                </div>

                {muralForm.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {muralForm.galleryImages.map((gImg, idx) => (
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
                              const next = [...muralForm.galleryImages];
                              next[idx] = { ...gImg, label: e.target.value };
                              setMuralForm((p) => ({ ...p, galleryImages: next }));
                            }}
                            className="w-full text-[10px] font-semibold text-neutral-800 border-b border-transparent focus:border-naho-pink focus:outline-none truncate"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMuralForm((p) => ({
                                ...p,
                                galleryImages: p.galleryImages.filter((_, i) => i !== idx),
                              }));
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
                  onClick={() => setShowMuralModal(false)}
                  className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer"
                >
                  {editingMuralId ? 'Guardar Cambios' : 'Publicar Mural'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: AGREGAR / EDITAR CURSO Y LINK DE CLASE (#2 & #3)
         ============================================================ */}
      {showCourseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCourseModal(false);
          }}
        >
          <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto border border-black/10">
            {/* Modal Header */}
            <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-naho-pink/20 text-naho-pink">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-tight">
                    {editingCourseId ? 'Editar Curso y Sala Virtual' : 'Crear Nuevo Curso del Mes'}
                  </h3>
                  <p className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                    Configuración de modalidad, fecha, horario, Meet y vista previa en vivo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="text-white/60 hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Smart Selectors & Meet Generator (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Title & Subtitle */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                      Título del Curso *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Masterclass: Ilustración Acrílica, Color & Composición"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full py-2.5 border-b border-neutral-300 focus:border-naho-pink text-sm font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                      Subtítulo o Enfoque del Taller
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Sesión en Vivo Paso a Paso con Nahomy"
                      value={courseForm.subtitle}
                      onChange={(e) => setCourseForm((p) => ({ ...p, subtitle: e.target.value }))}
                      className="w-full py-2 border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-600 focus:outline-none"
                    />
                  </div>

                  {/* Modality, Platform & Level (#2) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl">
                    <div>
                      <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                        Modalidad (#2)
                      </label>
                      <select
                        value={courseForm.modality}
                        onChange={(e) => {
                          const newMod = e.target.value as CourseItem['modality'];
                          const suggestedPlatform =
                            newMod === 'presencial'
                              ? 'Taller Físico Tampico (Col. Minerva)'
                              : newMod === 'hibrido'
                              ? 'Taller Tampico + Google Meet en Vivo'
                              : 'Google Meet (En Vivo)';
                          setCourseForm((p) => ({
                            ...p,
                            modality: newMod,
                            platformName: suggestedPlatform,
                          }));
                        }}
                        className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-semibold"
                      >
                        <option value="online">Online en Vivo</option>
                        <option value="presencial">Presencial en Taller</option>
                        <option value="hibrido">Híbrido (Taller + Meet)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                        Plataforma / Sede
                      </label>
                      <input
                        type="text"
                        value={courseForm.platformName}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, platformName: e.target.value }))
                        }
                        className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                        Nivel Requerido
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Principiantes / Todos los niveles"
                        value={courseForm.level}
                        onChange={(e) => setCourseForm((p) => ({ ...p, level: e.target.value }))}
                        className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink"
                      />
                    </div>
                  </div>

                  {/* Section 1: Month and Date Selection */}
                  <div className="p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-naho-pink" />
                      Fecha y Mes del Curso
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Month dropdown */}
                      <div>
                        <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                          Mes
                        </label>
                        <select
                          value={courseForm.selectedMonth}
                          onChange={(e) => {
                            const newMonth = e.target.value;
                            setCourseForm((p) => ({
                              ...p,
                              selectedMonth: newMonth,
                              monthLabel: `${newMonth} ${p.selectedYear}`,
                            }));
                          }}
                          className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-semibold"
                        >
                          {SPANISH_MONTHS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year dropdown */}
                      <div>
                        <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                          Año
                        </label>
                        <select
                          value={courseForm.selectedYear}
                          onChange={(e) => {
                            const newYear = e.target.value;
                            setCourseForm((p) => ({
                              ...p,
                              selectedYear: newYear,
                              monthLabel: `${p.selectedMonth} ${newYear}`,
                            }));
                          }}
                          className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-semibold"
                        >
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Datepicker */}
                      <div>
                        <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                          Día Específico *
                        </label>
                        <input
                          type="date"
                          required
                          value={courseForm.eventDate}
                          onChange={(e) => {
                            const newIso = e.target.value;
                            if (!newIso) return;
                            const { month, year } = getMonthAndYearFromIso(newIso);
                            const formatted = formatSpanishDateFromIso(newIso);
                            setCourseForm((p) => ({
                              ...p,
                              eventDate: newIso,
                              eventDateDisplay: formatted,
                              selectedMonth: month,
                              selectedYear: year,
                              monthLabel: `${month} ${year}`,
                              registrationDeadline: `${newIso}T${p.startTime || '16:00'}`,
                            }));
                          }}
                          className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-600 font-medium">
                      <span>Texto oficial de fecha:</span>
                      <span className="font-semibold text-neutral-900 bg-white px-2 py-0.5 rounded border border-black/5">
                        {courseForm.eventDateDisplay || 'Selecciona un día'}
                      </span>
                    </div>
                  </div>

                  {/* Section 2: Time Selection (Start & End) */}
                  <div className="p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-naho-blue" />
                        Horario de la Sesión
                      </span>
                      <span className="text-[11px] font-mono font-bold text-neutral-800">
                        {courseForm.eventTimeDisplay}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                          Hora de Inicio *
                        </label>
                        <input
                          type="time"
                          required
                          value={courseForm.startTime}
                          onChange={(e) => {
                            const newStart = e.target.value;
                            setCourseForm((p) => ({
                              ...p,
                              startTime: newStart,
                              eventTimeDisplay: `${newStart} - ${p.endTime} hrs`,
                            }));
                          }}
                          className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                          Hora de Término *
                        </label>
                        <input
                          type="time"
                          required
                          value={courseForm.endTime}
                          onChange={(e) => {
                            const newEnd = e.target.value;
                            setCourseForm((p) => ({
                              ...p,
                              endTime: newEnd,
                              eventTimeDisplay: `${p.startTime} - ${newEnd} hrs`,
                            }));
                          }}
                          className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 mr-1">
                        Preajustes:
                      </span>
                      {[
                        { label: 'Tarde (17:00 - 19:30)', s: '17:00', e: '19:30' },
                        { label: 'Mañana (10:00 - 12:30)', s: '10:00', e: '12:30' },
                        { label: 'Sábado (11:00 - 14:00)', s: '11:00', e: '14:00' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setCourseForm((p) => ({
                              ...p,
                              startTime: preset.s,
                              endTime: preset.e,
                              eventTimeDisplay: `${preset.s} - ${preset.e} hrs`,
                            }));
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-white hover:bg-neutral-100 border border-black/10 text-neutral-700 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Google Meet Generator Studio */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 border border-emerald-500/20 rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-neutral-900 block leading-tight">
                            Enlace de Acceso / Sala Virtual Google Meet
                          </span>
                          <span className="text-[9px] text-emerald-700 font-semibold">
                            Se enviará automáticamente en el pase digital de cada alumno
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Sala Lista
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          required
                          placeholder="https://meet.google.com/..."
                          value={courseForm.meetingLink}
                          onChange={(e) =>
                            setCourseForm((p) => ({ ...p, meetingLink: e.target.value }))
                          }
                          className="flex-1 py-2 px-3 bg-white border border-emerald-300 focus:border-emerald-600 text-xs font-mono text-neutral-900 rounded focus:outline-none shadow-xs"
                        />

                        {/* Copy Link button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (courseForm.meetingLink) {
                              navigator.clipboard.writeText(courseForm.meetingLink);
                              setCopiedMeetLink(true);
                              setTimeout(() => setCopiedMeetLink(false), 2500);
                              showToast('Enlace de Meet copiado al portapapeles.');
                            }
                          }}
                          className="px-3 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Copiar enlace"
                        >
                          {copiedMeetLink ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] text-emerald-600">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-neutral-500" />
                              <span className="text-[10px]">Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Generator actions row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const newMeet = generateGoogleMeetUrl();
                          setCourseForm((p) => ({ ...p, meetingLink: newMeet }));
                          showToast('¡Nueva sala de Google Meet generada!');
                        }}
                        className="px-3 py-1.5 bg-[#181B20] hover:bg-emerald-700 text-white text-[10px] font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Wand2 className="w-3 h-3 text-emerald-300" />
                        <span>✨ Generar Nueva Sala de Meet</span>
                      </button>

                      <a
                        href="https://meet.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 text-[10px] font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition-colors"
                        title="Abrir meet.new en Google"
                      >
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                        <span>Abrir meet.new</span>
                      </a>

                      {courseForm.meetingLink && (
                        <a
                          href={courseForm.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 text-emerald-700 hover:text-emerald-900 text-[10px] font-semibold underline inline-flex items-center gap-1 ml-auto"
                        >
                          <span>Probar sala</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Price, Spots, and Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        Precio ($ MXN) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={courseForm.price}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, price: Number(e.target.value) }))
                        }
                        className="w-full py-1.5 border-b border-neutral-300 focus:border-naho-pink text-sm font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        Cupo Máximo *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={courseForm.maxSpots}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, maxSpots: Number(e.target.value) }))
                        }
                        className="w-full py-1.5 border-b border-neutral-300 focus:border-naho-pink text-sm font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        Límite Inscripción *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={courseForm.registrationDeadline}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, registrationDeadline: e.target.value }))
                        }
                        className="w-full py-1.5 border-b border-neutral-300 focus:border-naho-pink text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description & Includes (#3) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        Descripción del Taller
                      </label>
                      <textarea
                        rows={3}
                        value={courseForm.description}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, description: e.target.value }))
                        }
                        placeholder="Explica qué aprenderá el alumno y de qué trata la clase..."
                        className="w-full p-2.5 bg-[#F5F2EB]/50 border border-neutral-200 text-xs text-neutral-800 rounded focus:outline-none focus:border-naho-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                        ¿Qué incluye el boleto? (1 por línea)
                      </label>
                      <textarea
                        rows={3}
                        value={courseForm.includesText}
                        onChange={(e) =>
                          setCourseForm((p) => ({ ...p, includesText: e.target.value }))
                        }
                        placeholder="Acceso en vivo por Google Meet&#10;Lista de materiales PDF&#10;Constancia de participación"
                        className="w-full p-2.5 bg-[#F5F2EB]/50 border border-neutral-200 text-xs text-neutral-800 rounded focus:outline-none focus:border-naho-pink"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Course Card Mockup (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
                    <span className="flex items-center gap-1.5 text-naho-pink">
                      <Eye className="w-3.5 h-3.5" />
                      Vista Previa de la Tarjeta
                    </span>
                    <span className="text-[10px] text-neutral-400">Catálogo Web</span>
                  </div>

                  {/* Public Card Mockup */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-lg space-y-0">
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      <img
                        src={courseForm.image}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>
                          {courseForm.modality === 'presencial'
                            ? 'Presencial en Taller'
                            : courseForm.modality === 'hibrido'
                            ? 'Híbrido (Taller + Meet)'
                            : 'Online en Vivo'}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-neutral-900 shadow-xs">
                        {courseForm.monthLabel || 'Octubre 2026'}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-naho-pink uppercase tracking-wider block">
                          {courseForm.subtitle || 'Taller en Vivo'}
                        </span>
                        <h4 className="font-serif text-base font-bold text-neutral-900 leading-snug line-clamp-2 mt-0.5">
                          {courseForm.title || 'Título del Nuevo Curso del Mes'}
                        </h4>
                      </div>

                      <div className="space-y-1.5 text-xs text-neutral-600 pt-1 border-t border-black/[0.04]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-naho-pink" />
                          <span className="font-medium text-neutral-800">
                            {courseForm.eventDateDisplay || '29 de Octubre, 2026'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-naho-blue" />
                          <span className="font-mono text-neutral-700">
                            {courseForm.eventTimeDisplay}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
                        <div>
                          <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">
                            Inversión
                          </span>
                          <span className="font-mono text-base font-black text-neutral-900">
                            ${courseForm.price} MXN
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-emerald-600 font-bold block">
                            {courseForm.maxSpots} Lugares disponibles
                          </span>
                          <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold mt-1 inline-block">
                            Inscribirme
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Cover & Visibility / Featured Checkboxes (#3) */}
                  <div className="bg-[#F5F2EB]/60 p-3.5 rounded-xl border border-black/5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-naho-pink" />
                        <span>Cambiar Portada</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setCourseForm((p) => ({ ...p, image: url }))
                            )
                          }
                        />
                      </label>

                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={courseForm.featured}
                          onChange={(e) =>
                            setCourseForm((p) => ({ ...p, featured: e.target.checked }))
                          }
                          className="accent-naho-pink w-4 h-4 rounded"
                        />
                        <span className="font-medium text-[11px]">Destacar en portada</span>
                      </label>
                    </div>

                    <div className="pt-2.5 border-t border-black/[0.06] flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={courseForm.active}
                          onChange={(e) =>
                            setCourseForm((p) => ({ ...p, active: e.target.checked }))
                          }
                          className="accent-emerald-600 w-4 h-4 rounded"
                        />
                        <span className="font-semibold text-[11px]">
                          Curso visible al público (Desmarcar para guardar como borrador)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom modal action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
                <span className="text-[11px] text-neutral-400">
                  {editingCourseId ? 'Modificando curso existente' : 'Nuevo curso del mes'}
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    {editingCourseId ? 'Guardar Cambios' : 'Publicar Curso'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 4: CONFIRMACIÓN ANTES DE BORRAR (#11)
         ============================================================ */}
      {confirmDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDialog(null);
          }}
        >
          <div className="w-full max-w-md bg-white shadow-2xl border border-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 id="confirm-dialog-title" className="font-serif text-base">
                  Confirmar Acción
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="font-serif text-lg text-neutral-900 font-bold">
                {confirmDialog.title}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {confirmDialog.message}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-xs"
                >
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
