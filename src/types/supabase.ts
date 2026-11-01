import type {
  MuralGalleryImage,
  QuoteFormData,
  AboutMeHighlight,
  DayOfWeek,
} from './index';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface PortfolioItemDetailsJson {
  dimensions?: string;
  technique?: string;
  location?: string;
  curatedTag?: string;
}

export interface Database {
  public: {
    Tables: {
      site_config: {
        Row: {
          id: string;
          hero_badge: string;
          hero_title_line1: string;
          hero_title_highlight: string;
          hero_description: string;
          studio_name: string;
          studio_address: string;
          studio_phone: string;
          studio_whatsapp: string;
          admin_email: string;
          instagram_handle: string | null;
          instagram_url: string | null;
          tiktok_handle: string | null;
          tiktok_url: string | null;
          facebook_handle: string | null;
          facebook_url: string | null;
          youtube_handle: string | null;
          youtube_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_badge: string;
          hero_title_line1: string;
          hero_title_highlight: string;
          hero_description: string;
          studio_name: string;
          studio_address: string;
          studio_phone: string;
          studio_whatsapp: string;
          admin_email: string;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          tiktok_handle?: string | null;
          tiktok_url?: string | null;
          facebook_handle?: string | null;
          facebook_url?: string | null;
          youtube_handle?: string | null;
          youtube_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_badge?: string;
          hero_title_line1?: string;
          hero_title_highlight?: string;
          hero_description?: string;
          studio_name?: string;
          studio_address?: string;
          studio_phone?: string;
          studio_whatsapp?: string;
          admin_email?: string;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          tiktok_handle?: string | null;
          tiktok_url?: string | null;
          facebook_handle?: string | null;
          facebook_url?: string | null;
          youtube_handle?: string | null;
          youtube_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      mural_categories: {
        Row: {
          id: string;
          label: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          label: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          id: string;
          title: string;
          category: string;
          category_label: string;
          image: string;
          description: string;
          tags: string[];
          details: PortfolioItemDetailsJson | null;
          gallery_images: MuralGalleryImage[] | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          category: string;
          category_label: string;
          image: string;
          description: string;
          tags?: string[];
          details?: PortfolioItemDetailsJson | null;
          gallery_images?: MuralGalleryImage[] | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          category_label?: string;
          image?: string;
          description?: string;
          tags?: string[];
          details?: PortfolioItemDetailsJson | null;
          gallery_images?: MuralGalleryImage[] | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          subtitle: string;
          description: string;
          event_date: string;
          event_date_display: string;
          event_time_display: string;
          registration_deadline: string;
          max_spots: number;
          enrolled_count: number;
          price: number;
          modality: 'online' | 'presencial' | 'hibrido';
          platform_name: string;
          meeting_link: string;
          image: string;
          month_label: string;
          level: string;
          includes: string[];
          featured: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          subtitle: string;
          description: string;
          event_date: string;
          event_date_display: string;
          event_time_display: string;
          registration_deadline: string;
          max_spots: number;
          enrolled_count?: number;
          price: number;
          modality: 'online' | 'presencial' | 'hibrido';
          platform_name: string;
          meeting_link: string;
          image: string;
          month_label: string;
          level: string;
          includes?: string[];
          featured?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string;
          description?: string;
          event_date?: string;
          event_date_display?: string;
          event_time_display?: string;
          registration_deadline?: string;
          max_spots?: number;
          enrolled_count?: number;
          price?: number;
          modality?: 'online' | 'presencial' | 'hibrido';
          platform_name?: string;
          meeting_link?: string;
          image?: string;
          month_label?: string;
          level?: string;
          includes?: string[];
          featured?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          id: string;
          folio: string;
          access_code: string;
          locked_session_id: string | null;
          course_id: string;
          course_title: string;
          course_date_display: string;
          course_time_display: string;
          meeting_link: string;
          platform_name: string;
          buyer_name: string;
          buyer_email: string;
          buyer_phone: string;
          tickets_count: number;
          total_paid: number;
          payment_method: 'tarjeta' | 'transferencia' | 'oxxo_spei';
          purchased_at: string;
          email_sent_to_buyer: boolean;
          email_sent_to_naho: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          folio: string;
          access_code: string;
          locked_session_id?: string | null;
          course_id: string;
          course_title: string;
          course_date_display: string;
          course_time_display: string;
          meeting_link: string;
          platform_name: string;
          buyer_name: string;
          buyer_email: string;
          buyer_phone: string;
          tickets_count?: number;
          total_paid: number;
          payment_method: 'tarjeta' | 'transferencia' | 'oxxo_spei';
          purchased_at: string;
          email_sent_to_buyer?: boolean;
          email_sent_to_naho?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          folio?: string;
          access_code?: string;
          locked_session_id?: string | null;
          course_id?: string;
          course_title?: string;
          course_date_display?: string;
          course_time_display?: string;
          meeting_link?: string;
          platform_name?: string;
          buyer_name?: string;
          buyer_email?: string;
          buyer_phone?: string;
          tickets_count?: number;
          total_paid?: number;
          payment_method?: 'tarjeta' | 'transferencia' | 'oxxo_spei';
          purchased_at?: string;
          email_sent_to_buyer?: boolean;
          email_sent_to_naho?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      quote_tickets: {
        Row: {
          folio: string;
          created_at_display: string;
          status: 'nuevo' | 'en_revision' | 'propuesta_enviada' | 'aprobado';
          form_data: QuoteFormData;
          reference_art_title: string | null;
          quoted_amount: number | null;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: {
          folio: string;
          created_at_display: string;
          status?: 'nuevo' | 'en_revision' | 'propuesta_enviada' | 'aprobado';
          form_data: QuoteFormData;
          reference_art_title?: string | null;
          quoted_amount?: number | null;
          admin_notes?: string | null;
          created_at?: string;
        };
        Update: {
          folio?: string;
          created_at_display?: string;
          status?: 'nuevo' | 'en_revision' | 'propuesta_enviada' | 'aprobado';
          form_data?: QuoteFormData;
          reference_art_title?: string | null;
          quoted_amount?: number | null;
          admin_notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      about_me_content: {
        Row: {
          id: string;
          badge: string;
          title: string;
          subtitle: string;
          philosophy_quote: string;
          bio_paragraph1: string;
          bio_paragraph2: string;
          bio_paragraph3: string;
          portrait_image: string;
          secondary_image: string;
          years_experience: string;
          mural_count_label: string;
          students_count_label: string;
          signature_text: string;
          highlights: AboutMeHighlight[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          badge: string;
          title: string;
          subtitle: string;
          philosophy_quote: string;
          bio_paragraph1: string;
          bio_paragraph2: string;
          bio_paragraph3: string;
          portrait_image: string;
          secondary_image: string;
          years_experience: string;
          mural_count_label: string;
          students_count_label: string;
          signature_text: string;
          highlights?: AboutMeHighlight[];
          updated_at?: string;
        };
        Update: {
          id?: string;
          badge?: string;
          title?: string;
          subtitle?: string;
          philosophy_quote?: string;
          bio_paragraph1?: string;
          bio_paragraph2?: string;
          bio_paragraph3?: string;
          portrait_image?: string;
          secondary_image?: string;
          years_experience?: string;
          mural_count_label?: string;
          students_count_label?: string;
          signature_text?: string;
          highlights?: AboutMeHighlight[];
          updated_at?: string;
        };
        Relationships: [];
      };
      in_person_classes: {
        Row: {
          id: string;
          audience: string;
          age_range: string;
          title: string;
          description: string;
          schedule_summary: string;
          techniques: string[];
          price_info: string;
          badge: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          audience: string;
          age_range: string;
          title: string;
          description: string;
          schedule_summary: string;
          techniques?: string[];
          price_info: string;
          badge: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          audience?: string;
          age_range?: string;
          title?: string;
          description?: string;
          schedule_summary?: string;
          techniques?: string[];
          price_info?: string;
          badge?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      studio_photos: {
        Row: {
          id: string;
          title: string;
          caption: string;
          image: string;
          tag: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          caption: string;
          image: string;
          tag: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          caption?: string;
          image?: string;
          tag?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      weekly_schedule: {
        Row: {
          day_index: DayOfWeek;
          day_name: string;
          is_open: boolean;
          open_hour: number | null;
          close_hour: number | null;
          display_time: string;
          updated_at: string;
        };
        Insert: {
          day_index: DayOfWeek;
          day_name: string;
          is_open: boolean;
          open_hour?: number | null;
          close_hour?: number | null;
          display_time: string;
          updated_at?: string;
        };
        Update: {
          day_index?: DayOfWeek;
          day_name?: string;
          is_open?: boolean;
          open_hour?: number | null;
          close_hour?: number | null;
          display_time?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      register_course_enrollment: {
        Args: {
          p_id: string;
          p_folio: string;
          p_access_code: string;
          p_course_id: string;
          p_course_title: string;
          p_course_date_display: string;
          p_course_time_display: string;
          p_meeting_link: string;
          p_platform_name: string;
          p_buyer_name: string;
          p_buyer_email: string;
          p_buyer_phone: string;
          p_total_paid: number;
          p_payment_method: string;
          p_purchased_at: string;
          p_email_sent_to_buyer: boolean;
          p_email_sent_to_naho: boolean;
        };
        Returns: boolean;
      };
      delete_course_enrollment: {
        Args: {
          p_enrollment_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

