export type CategoryId = 'all' | 'murales' | 'ropa' | 'totebags';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'murales' | 'ropa' | 'totebags';
  categoryLabel: string;
  image: string;
  description: string;
  tags: string[];
  details?: {
    dimensions?: string;
    technique?: string;
    curatedTag?: string;
  };
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

export type ProjectType = 'mural' | 'ropa' | 'totebag' | 'otro';

export type PreferredContactMethod = 'whatsapp' | 'email' | 'call';

export interface QuoteFormData {
  projectType: ProjectType;
  dimensions: string;
  customDimensions: string;
  surfaceOrMaterial: string;
  colorPalette?: string;
  themeAndDetails: string;
  deadlineDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredContact: PreferredContactMethod;
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
