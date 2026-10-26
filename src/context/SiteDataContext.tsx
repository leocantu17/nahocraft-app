import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioItem,
  MuralCategory,
  CourseItem,
  CourseEnrollment,
  AboutMeContent,
  StudioGalleryPhoto,
  InPersonClassProgram,
  QuoteTicket,
  DailySchedule,
  SiteGeneralConfig,
} from '../types';
import {
  INITIAL_SITE_CONFIG,
  INITIAL_MURAL_CATEGORIES,
  PORTFOLIO_ITEMS,
  INITIAL_COURSES,
  INITIAL_ABOUT_ME,
  INITIAL_IN_PERSON_CLASSES,
  INITIAL_STUDIO_PHOTOS,
  INITIAL_QUOTE_TICKETS,
  INITIAL_COURSE_ENROLLMENTS,
} from '../data/portfolioData';
import { WEEKLY_SCHEDULE } from '../data/scheduleData';

const STORAGE_KEYS = {
  siteConfig: 'nahocraft_v2_site_config',
  muralCategories: 'nahocraft_v2_mural_categories',
  muralItems: 'nahocraft_v2_mural_items',
  courses: 'nahocraft_v2_courses',
  courseEnrollments: 'nahocraft_v2_course_enrollments',
  quoteTickets: 'nahocraft_v2_quote_tickets',
  aboutMe: 'nahocraft_v2_about_me',
  inPersonClasses: 'nahocraft_v2_in_person_classes',
  studioPhotos: 'nahocraft_v2_studio_photos',
  weeklySchedule: 'nahocraft_v2_weekly_schedule',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

interface SiteDataContextValue {
  currentPath: string;
  navigateTo: (path: string, hash?: string) => void;

  siteConfig: SiteGeneralConfig;
  updateSiteConfig: (partial: Partial<SiteGeneralConfig>) => void;

  muralCategories: MuralCategory[];
  addMuralCategory: (cat: MuralCategory) => void;
  deleteMuralCategory: (id: string) => void;

  muralItems: PortfolioItem[];
  addMuralItem: (item: PortfolioItem) => void;
  updateMuralItem: (item: PortfolioItem) => void;
  deleteMuralItem: (id: string) => void;

  courses: CourseItem[];
  addCourse: (course: CourseItem) => void;
  updateCourse: (course: CourseItem) => void;
  deleteCourse: (id: string) => void;

  courseEnrollments: CourseEnrollment[];
  registerCourseEnrollment: (enrollment: CourseEnrollment) => void;
  bindEnrollmentSession: (enrollmentId: string, sessionId: string) => void;

  quoteTickets: QuoteTicket[];
  addQuoteTicket: (ticket: QuoteTicket) => void;
  updateQuoteTicketStatus: (folio: string, status: QuoteTicket['status']) => void;
  deleteQuoteTicket: (folio: string) => void;

  aboutMe: AboutMeContent;
  updateAboutMe: (partial: Partial<AboutMeContent>) => void;

  inPersonClasses: InPersonClassProgram[];
  updateInPersonClasses: (classes: InPersonClassProgram[]) => void;

  studioPhotos: StudioGalleryPhoto[];
  addStudioPhoto: (photo: StudioGalleryPhoto) => void;
  deleteStudioPhoto: (id: string) => void;

  weeklySchedule: DailySchedule[];
  updateWeeklySchedule: (schedule: DailySchedule[]) => void;

  resetAllDataToDefaults: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname.replace(/\/+$/, '');
    return p || '/';
  });

  const [siteConfig, setSiteConfig] = useState<SiteGeneralConfig>(() =>
    loadFromStorage(STORAGE_KEYS.siteConfig, INITIAL_SITE_CONFIG)
  );
  const [muralCategories, setMuralCategories] = useState<MuralCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.muralCategories, INITIAL_MURAL_CATEGORIES)
  );
  const [muralItems, setMuralItems] = useState<PortfolioItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.muralItems, PORTFOLIO_ITEMS)
  );
  const [courses, setCourses] = useState<CourseItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.courses, INITIAL_COURSES)
  );
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>(() =>
    loadFromStorage(STORAGE_KEYS.courseEnrollments, INITIAL_COURSE_ENROLLMENTS)
  );
  const [quoteTickets, setQuoteTickets] = useState<QuoteTicket[]>(() =>
    loadFromStorage(STORAGE_KEYS.quoteTickets, INITIAL_QUOTE_TICKETS)
  );
  const [aboutMe, setAboutMe] = useState<AboutMeContent>(() =>
    loadFromStorage(STORAGE_KEYS.aboutMe, INITIAL_ABOUT_ME)
  );
  const [inPersonClasses, setInPersonClasses] = useState<InPersonClassProgram[]>(() =>
    loadFromStorage(STORAGE_KEYS.inPersonClasses, INITIAL_IN_PERSON_CLASSES)
  );
  const [studioPhotos, setStudioPhotos] = useState<StudioGalleryPhoto[]>(() =>
    loadFromStorage(STORAGE_KEYS.studioPhotos, INITIAL_STUDIO_PHOTOS)
  );
  const [weeklySchedule, setWeeklySchedule] = useState<DailySchedule[]>(() =>
    loadFromStorage(STORAGE_KEYS.weeklySchedule, WEEKLY_SCHEDULE)
  );

  // Sync popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.replace(/\/+$/, '');
      setCurrentPath(p || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync across tabs if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      setSiteConfig(loadFromStorage(STORAGE_KEYS.siteConfig, INITIAL_SITE_CONFIG));
      setMuralCategories(loadFromStorage(STORAGE_KEYS.muralCategories, INITIAL_MURAL_CATEGORIES));
      setMuralItems(loadFromStorage(STORAGE_KEYS.muralItems, PORTFOLIO_ITEMS));
      setCourses(loadFromStorage(STORAGE_KEYS.courses, INITIAL_COURSES));
      setCourseEnrollments(loadFromStorage(STORAGE_KEYS.courseEnrollments, INITIAL_COURSE_ENROLLMENTS));
      setQuoteTickets(loadFromStorage(STORAGE_KEYS.quoteTickets, INITIAL_QUOTE_TICKETS));
      setAboutMe(loadFromStorage(STORAGE_KEYS.aboutMe, INITIAL_ABOUT_ME));
      setInPersonClasses(loadFromStorage(STORAGE_KEYS.inPersonClasses, INITIAL_IN_PERSON_CLASSES));
      setStudioPhotos(loadFromStorage(STORAGE_KEYS.studioPhotos, INITIAL_STUDIO_PHOTOS));
      setWeeklySchedule(loadFromStorage(STORAGE_KEYS.weeklySchedule, WEEKLY_SCHEDULE));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navigateTo = useCallback((path: string, hash?: string) => {
    const cleanPath = path.replace(/\/+$/, '') || '/';
    const url = hash ? `${cleanPath}${hash.startsWith('#') ? hash : `#${hash}`}` : cleanPath;
    window.history.pushState({}, '', url);
    setCurrentPath(cleanPath);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace(/^#/, ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const updateSiteConfig = useCallback((partial: Partial<SiteGeneralConfig>) => {
    setSiteConfig((prev) => {
      const next = { ...prev, ...partial };
      saveToStorage(STORAGE_KEYS.siteConfig, next);
      return next;
    });
  }, []);

  const addMuralCategory = useCallback((cat: MuralCategory) => {
    setMuralCategories((prev) => {
      const next = [...prev.filter((c) => c.id !== cat.id), cat];
      saveToStorage(STORAGE_KEYS.muralCategories, next);
      return next;
    });
  }, []);

  const deleteMuralCategory = useCallback((id: string) => {
    setMuralCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage(STORAGE_KEYS.muralCategories, next);
      return next;
    });
  }, []);

  const addMuralItem = useCallback((item: PortfolioItem) => {
    setMuralItems((prev) => {
      const next = [item, ...prev];
      saveToStorage(STORAGE_KEYS.muralItems, next);
      return next;
    });
  }, []);

  const updateMuralItem = useCallback((item: PortfolioItem) => {
    setMuralItems((prev) => {
      const next = prev.map((m) => (m.id === item.id ? item : m));
      saveToStorage(STORAGE_KEYS.muralItems, next);
      return next;
    });
  }, []);

  const deleteMuralItem = useCallback((id: string) => {
    setMuralItems((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveToStorage(STORAGE_KEYS.muralItems, next);
      return next;
    });
  }, []);

  const addCourse = useCallback((course: CourseItem) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      saveToStorage(STORAGE_KEYS.courses, next);
      return next;
    });
  }, []);

  const updateCourse = useCallback((course: CourseItem) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === course.id ? course : c));
      saveToStorage(STORAGE_KEYS.courses, next);
      return next;
    });
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage(STORAGE_KEYS.courses, next);
      return next;
    });
  }, []);

  const registerCourseEnrollment = useCallback((enrollment: CourseEnrollment) => {
    setCourseEnrollments((prev) => {
      const next = [enrollment, ...prev];
      saveToStorage(STORAGE_KEYS.courseEnrollments, next);
      return next;
    });
    setCourses((prev) => {
      const next = prev.map((c) =>
        c.id === enrollment.courseId
          ? { ...c, enrolledCount: Math.min(c.maxSpots, c.enrolledCount + 1) }
          : c
      );
      saveToStorage(STORAGE_KEYS.courses, next);
      return next;
    });
  }, []);

  const bindEnrollmentSession = useCallback((enrollmentId: string, sessionId: string) => {
    setCourseEnrollments((prev) => {
      const next = prev.map((e) =>
        e.id === enrollmentId ? { ...e, lockedSessionId: sessionId } : e
      );
      saveToStorage(STORAGE_KEYS.courseEnrollments, next);
      return next;
    });
  }, []);

  const addQuoteTicket = useCallback((ticket: QuoteTicket) => {
    setQuoteTickets((prev) => {
      const next = [ticket, ...prev];
      saveToStorage(STORAGE_KEYS.quoteTickets, next);
      return next;
    });
  }, []);

  const updateQuoteTicketStatus = useCallback((folio: string, status: QuoteTicket['status']) => {
    setQuoteTickets((prev) => {
      const next = prev.map((t) => (t.folio === folio ? { ...t, status } : t));
      saveToStorage(STORAGE_KEYS.quoteTickets, next);
      return next;
    });
  }, []);

  const deleteQuoteTicket = useCallback((folio: string) => {
    setQuoteTickets((prev) => {
      const next = prev.filter((t) => t.folio !== folio);
      saveToStorage(STORAGE_KEYS.quoteTickets, next);
      return next;
    });
  }, []);

  const updateAboutMe = useCallback((partial: Partial<AboutMeContent>) => {
    setAboutMe((prev) => {
      const next = { ...prev, ...partial };
      saveToStorage(STORAGE_KEYS.aboutMe, next);
      return next;
    });
  }, []);

  const updateInPersonClasses = useCallback((classes: InPersonClassProgram[]) => {
    setInPersonClasses(classes);
    saveToStorage(STORAGE_KEYS.inPersonClasses, classes);
  }, []);

  const addStudioPhoto = useCallback((photo: StudioGalleryPhoto) => {
    setStudioPhotos((prev) => {
      const next = [photo, ...prev];
      saveToStorage(STORAGE_KEYS.studioPhotos, next);
      return next;
    });
  }, []);

  const deleteStudioPhoto = useCallback((id: string) => {
    setStudioPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage(STORAGE_KEYS.studioPhotos, next);
      return next;
    });
  }, []);

  const updateWeeklySchedule = useCallback((schedule: DailySchedule[]) => {
    setWeeklySchedule(schedule);
    saveToStorage(STORAGE_KEYS.weeklySchedule, schedule);
  }, []);

  const resetAllDataToDefaults = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setSiteConfig(INITIAL_SITE_CONFIG);
    setMuralCategories(INITIAL_MURAL_CATEGORIES);
    setMuralItems(PORTFOLIO_ITEMS);
    setCourses(INITIAL_COURSES);
    setCourseEnrollments(INITIAL_COURSE_ENROLLMENTS);
    setQuoteTickets(INITIAL_QUOTE_TICKETS);
    setAboutMe(INITIAL_ABOUT_ME);
    setInPersonClasses(INITIAL_IN_PERSON_CLASSES);
    setStudioPhotos(INITIAL_STUDIO_PHOTOS);
    setWeeklySchedule(WEEKLY_SCHEDULE);
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        currentPath,
        navigateTo,
        siteConfig,
        updateSiteConfig,
        muralCategories,
        addMuralCategory,
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
        registerCourseEnrollment,
        bindEnrollmentSession,
        quoteTickets,
        addQuoteTicket,
        updateQuoteTicketStatus,
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
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return ctx;
}
