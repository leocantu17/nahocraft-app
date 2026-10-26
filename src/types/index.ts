export type CategoryId = string; // 'all' or any MuralCategory['id']

export interface MuralCategory {
  id: string;
  label: string;
  description?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string; // matches MuralCategory.id
  categoryLabel: string;
  image: string;
  description: string;
  tags: string[];
  details?: {
    dimensions?: string;
    technique?: string;
    location?: string;
    curatedTag?: string;
  };
}

export interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  eventDate: string; // YYYY-MM-DD (e.g. "2026-10-29")
  eventDateDisplay: string; // "29 de Octubre, 2026"
  eventTimeDisplay: string; // "17:00 - 19:30 hrs"
  registrationDeadline: string; // ISO datetime string e.g. "2026-10-29T16:00:00"
  maxSpots: number;
  enrolledCount: number;
  price: number; // MXN
  modality: 'online' | 'presencial' | 'hibrido';
  platformName: string; // e.g., "Google Meet"
  meetingLink: string; // e.g., "https://meet.google.com/nah-arte-oct29"
  image: string;
  monthLabel: string; // e.g., "Octubre 2026"
  level: string;
  includes: string[];
  featured?: boolean;
  active: boolean;
}

export interface CourseEnrollment {
  id: string;
  folio: string;
  accessCode: string; // Código único intransferible ligado al correo
  lockedSessionId?: string; // ID de sesión del dispositivo del titular para evitar compartir
  courseId: string;
  courseTitle: string;
  courseDateDisplay: string;
  courseTimeDisplay: string;
  meetingLink: string;
  platformName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ticketsCount: 1; // Estrictamente 1 boleto por persona/cuenta
  totalPaid: number;
  paymentMethod: 'tarjeta' | 'transferencia' | 'oxxo_spei';
  purchasedAt: string;
  emailSentToBuyer: boolean;
  emailSentToNaho: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

export interface DailySchedule {
  dayName: string;
  dayIndex: DayOfWeek;
  isOpen: boolean;
  openHour?: number; // 24-hr format (e.g. 11)
  closeHour?: number; // 24-hr format (e.g. 21)
  displayTime: string; // "11:00 - 21:00" o "Cerrado"
}

export interface StudioStatus {
  isOpen: boolean;
  currentDay: string;
  currentTimeTampico: string;
  message: string;
  nextScheduleInfo: string;
}

export type ProjectType = 'mural' | 'comercial' | 'residencial' | 'decoracion' | 'otro';

export type MuralCityZone = 'Tampico' | 'Ciudad Madero' | 'Altamira';

export type PreferredContactMethod = 'whatsapp' | 'email' | 'call';

export interface QuoteFormData {
  projectType: ProjectType;
  muralCategory: string;
  customMuralType?: string; // Cuando elige "Otro tipo de mural"
  dimensions: string;
  customDimensions: string;
  surfaceOrMaterial: string;
  colorPalette?: string;
  themeAndDetails: string;
  datePreferenceType: 'especifica' | 'flexible';
  deadlineDate: string;
  cityZone: MuralCityZone;
  neighborhoodOrAddress: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredContact?: PreferredContactMethod;
  clientLocation: string;
  clientNotes: string;
  referenceImagePreview?: string;
  referenceImageName?: string;
}

export interface QuoteTicket {
  folio: string;
  createdAt: string;
  status: 'nuevo' | 'en_revision' | 'propuesta_enviada' | 'aprobado';
  formData: QuoteFormData;
  referenceArtTitle?: string;
}

export interface AboutMeHighlight {
  id: string;
  title: string;
  description: string;
}

export interface AboutMeContent {
  badge: string;
  title: string;
  subtitle: string;
  philosophyQuote: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  portraitImage: string;
  secondaryImage: string;
  yearsExperience: string;
  muralCountLabel: string;
  studentsCountLabel: string;
  signatureText: string;
  highlights: AboutMeHighlight[];
}

export interface StudioGalleryPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
  tag: string;
}

export interface InPersonClassProgram {
  id: string;
  audience: string; // "Niños" | "Adolescentes" | "Adultos"
  ageRange: string;
  title: string;
  description: string;
  scheduleSummary: string;
  techniques: string[];
  priceInfo: string;
  badge: string;
}

export interface SiteGeneralConfig {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  studioName: string;
  studioAddress: string;
  studioPhone: string;
  studioWhatsapp: string;
  adminEmail: string;
}
