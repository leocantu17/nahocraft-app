import { useState, useEffect, type ReactNode } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { isNahoAuthenticated, setNahoAuthenticated } from './NahoLoginPage';
import {
  Palette,
  Video,
  FileText,
  User,
  Users,
  Store,
  LogOut,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import type {
  PortfolioItem,
  MuralCategory,
  CourseItem,
  QuoteTicket,
} from '../../types';

// Modales desacoplados
import { ConfirmDialog } from './modals/ConfirmDialog';
import { CategoryModal } from './modals/CategoryModal';
import { MuralModal } from './modals/MuralModal';
import { CourseModal } from './modals/CourseModal';
import { QuoteDetailModal } from './modals/QuoteDetailModal';

// Módulos temáticos de administración
import { MuralesTab } from './modules/murales/MuralesTab';
import { CursosTab } from './modules/cursos/CursosTab';
import { AlumnosTab } from './modules/alumnos/AlumnosTab';
import { CotizacionesTab } from './modules/cotizaciones/CotizacionesTab';
import { SobreMiTab } from './modules/sobre-mi/SobreMiTab';
import { HeroTallerTab } from './modules/hero-taller/HeroTallerTab';

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

  // Verificación de Autenticación
  useEffect(() => {
    if (!isNahoAuthenticated()) {
      navigateTo('/naho');
    }
  }, [navigateTo]);

  const [activeTab, setActiveTab] = useState<AdminTab>('murales');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Estados de Modales
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MuralCategory | null>(null);

  const [showMuralModal, setShowMuralModal] = useState(false);
  const [editingMural, setEditingMural] = useState<PortfolioItem | null>(null);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuoteTicket | null>(null);

  const [selectedMuralCatId, setSelectedMuralCatId] = useState<string>(
    muralCategories[0]?.id || 'all'
  );

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleLogout = () => {
    setNahoAuthenticated(false);
    navigateTo('/naho');
  };

  const navTabs: { id: AdminTab; label: string; icon: ReactNode; badge?: number }[] = [
    {
      id: 'murales',
      label: 'Murales',
      icon: <Palette className="w-4 h-4" />,
      badge: muralItems.length,
    },
    {
      id: 'cursos',
      label: 'Cursos',
      icon: <Video className="w-4 h-4" />,
      badge: courses.length,
    },
    {
      id: 'alumnos',
      label: 'Alumnos',
      icon: <Users className="w-4 h-4" />,
      badge: courseEnrollments.length,
    },
    {
      id: 'cotizaciones',
      label: 'Cotizaciones',
      icon: <FileText className="w-4 h-4" />,
      badge: quoteTickets.filter((q) => q.status === 'nuevo').length || undefined,
    },
    {
      id: 'sobre-mi',
      label: 'Sobre Mí',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'hero-taller',
      label: 'Portada & Taller',
      icon: <Store className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#181B20] flex flex-col font-sans">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181B20] text-white px-5 py-3.5 shadow-2xl flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 border-l-4 border-naho-pink">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-[#181B20] text-white px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/10 shrink-0 sticky top-0 z-40 backdrop-blur-md bg-[#181B20]/95">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-naho-pink animate-pulse" />
          <div>
            <h1 className="font-serif text-lg tracking-wider font-light">
              NAHOCRAFT <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-white/50 ml-2">Panel de Control</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Sitio Web</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-1.5 border border-white/20 hover:border-rose-400 hover:text-rose-400 text-xs uppercase tracking-wider text-white/80 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-black/[0.06] px-6 sm:px-12 overflow-x-auto scrollbar-none sticky top-[69px] z-30">
        <div className="flex items-center gap-1 sm:gap-4 min-w-max">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 sm:px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-naho-pink text-[#181B20] bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-naho-pink text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10">
        {activeTab === 'murales' && (
          <MuralesTab
            muralCategories={muralCategories}
            muralItems={muralItems}
            selectedMuralCatId={selectedMuralCatId}
            onSelectCategory={setSelectedMuralCatId}
            onOpenNewCategoryModal={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            onOpenEditCategoryModal={(cat) => {
              setEditingCategory(cat);
              setShowCategoryModal(true);
            }}
            onDeleteCategory={(cat) => {
              setConfirmDialog({
                title: `¿Eliminar categoría "${cat.label}"?`,
                message: 'Se quitará esta categoría del filtro. Los murales existentes seguirán disponibles.',
                confirmLabel: 'Sí, eliminar categoría',
                onConfirm: () => {
                  deleteMuralCategory(cat.id);
                  showToast(`Categoría "${cat.label}" eliminada.`);
                },
              });
            }}
            onOpenNewMuralModal={() => {
              setEditingMural(null);
              setShowMuralModal(true);
            }}
            onOpenEditMuralModal={(item) => {
              setEditingMural(item);
              setShowMuralModal(true);
            }}
            onDeleteMural={(item) => {
              setConfirmDialog({
                title: `¿Eliminar mural "${item.title}"?`,
                message: 'Esta acción no se puede deshacer.',
                confirmLabel: 'Sí, eliminar mural',
                onConfirm: () => {
                  deleteMuralItem(item.id);
                  showToast('Mural eliminado.');
                },
              });
            }}
          />
        )}

        {activeTab === 'cursos' && (
          <CursosTab
            courses={courses}
            courseEnrollments={courseEnrollments}
            onOpenNewCourseModal={() => {
              setEditingCourse(null);
              setShowCourseModal(true);
            }}
            onOpenEditCourseModal={(course) => {
              setEditingCourse(course);
              setShowCourseModal(true);
            }}
            onUpdateCourse={updateCourse}
            onDeleteCourse={(course) => {
              setConfirmDialog({
                title: `¿Eliminar curso "${course.title}"?`,
                message: 'Se quitará del catálogo. Si solo deseas ocultarlo temporalmente, puedes pausarlo con el botón de ojo.',
                confirmLabel: 'Sí, eliminar curso',
                onConfirm: () => {
                  deleteCourse(course.id);
                  showToast('Curso eliminado.');
                },
              });
            }}
            onNavigateToAlumnos={() => setActiveTab('alumnos')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'alumnos' && (
          <AlumnosTab
            courses={courses}
            courseEnrollments={courseEnrollments}
            siteConfig={siteConfig}
            onDeleteEnrollment={(enr) => {
              setConfirmDialog({
                title: `¿Dar de baja a ${enr.buyerName}?`,
                message: `Se cancelará el boleto ${enr.folio} (${enr.accessCode}) y se liberará +1 lugar disponible en el curso "${enr.courseTitle}".`,
                confirmLabel: 'Sí, cancelar boleto y liberar cupo',
                onConfirm: () => {
                  deleteCourseEnrollment(enr.id);
                  showToast(`Boleto de ${enr.buyerName} cancelado.`);
                },
              });
            }}
            onNavigateToCursos={() => setActiveTab('cursos')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'cotizaciones' && (
          <CotizacionesTab
            quoteTickets={quoteTickets}
            onSelectQuote={(ticket) => setSelectedQuoteDetail(ticket)}
            onUpdateStatus={updateQuoteTicketStatus}
            onUpdateDetails={updateQuoteTicketDetails}
            onDeleteQuote={(ticket) => {
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
          />
        )}

        {activeTab === 'sobre-mi' && (
          <SobreMiTab
            aboutMe={aboutMe}
            onUpdateAboutMe={updateAboutMe}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'hero-taller' && (
          <HeroTallerTab
            siteConfig={siteConfig}
            weeklySchedule={weeklySchedule}
            inPersonClasses={inPersonClasses}
            studioPhotos={studioPhotos}
            onUpdateSiteConfig={updateSiteConfig}
            onUpdateWeeklySchedule={updateWeeklySchedule}
            onUpdateInPersonClasses={updateInPersonClasses}
            onAddStudioPhoto={addStudioPhoto}
            onDeleteStudioPhoto={(id, title) => {
              setConfirmDialog({
                title: `¿Eliminar fotografía "${title}"?`,
                message: 'Se quitará esta imagen de la galería del taller físico.',
                confirmLabel: 'Sí, eliminar foto',
                onConfirm: () => {
                  deleteStudioPhoto(id);
                  showToast('Foto del taller eliminada.');
                },
              });
            }}
            onResetDefaults={() => {
              setConfirmDialog({
                title: '¿Restaurar todos los datos a los valores iniciales?',
                message: 'Se restablecerán los murales, cursos, textos y horarios originales de fábrica.',
                confirmLabel: 'Sí, restaurar fábrica',
                onConfirm: () => {
                  resetAllDataToDefaults();
                  showToast('Datos restaurados a valores de fábrica.');
                },
              });
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modales Desacoplados */}
      <ConfirmDialog
        isOpen={Boolean(confirmDialog)}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        confirmLabel={confirmDialog?.confirmLabel || 'Confirmar'}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        editingCategory={editingCategory}
        onClose={() => setShowCategoryModal(false)}
        onSave={(catData) => {
          if (catData.id) {
            updateMuralCategory({
              id: catData.id,
              label: catData.label,
              description: catData.description || 'Categoría de mural personalizado',
            });
            showToast(`Categoría "${catData.label}" actualizada.`);
          } else {
            const slug = catData.label
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-');
            const newCat: MuralCategory = {
              id: slug || `cat-${Date.now()}`,
              label: catData.label,
              description: catData.description || 'Categoría de mural personalizado',
            };
            addMuralCategory(newCat);
            setSelectedMuralCatId(newCat.id);
            showToast(`Categoría "${newCat.label}" creada.`);
          }
          setShowCategoryModal(false);
        }}
      />

      <MuralModal
        isOpen={showMuralModal}
        editingMural={editingMural}
        categories={muralCategories}
        defaultCategoryId={selectedMuralCatId}
        onClose={() => setShowMuralModal(false)}
        onSave={(mural) => {
          if (editingMural) {
            updateMuralItem(mural);
            showToast(`Mural "${mural.title}" actualizado.`);
          } else {
            addMuralItem(mural);
            showToast(`Mural "${mural.title}" publicado con éxito.`);
          }
          setShowMuralModal(false);
        }}
      />

      <CourseModal
        isOpen={showCourseModal}
        editingCourse={editingCourse}
        onClose={() => setShowCourseModal(false)}
        onSave={(course) => {
          if (editingCourse) {
            updateCourse(course);
            showToast(`Curso "${course.title}" actualizado.`);
          } else {
            addCourse(course);
            showToast(`Curso "${course.title}" publicado con éxito.`);
          }
          setShowCourseModal(false);
        }}
        onShowToast={showToast}
      />

      <QuoteDetailModal
        isOpen={Boolean(selectedQuoteDetail)}
        ticket={selectedQuoteDetail}
        onClose={() => setSelectedQuoteDetail(null)}
        onUpdateStatus={(folio, status) => {
          updateQuoteTicketStatus(folio, status);
          if (selectedQuoteDetail) {
            setSelectedQuoteDetail({ ...selectedQuoteDetail, status });
          }
          showToast(`Estado de ${folio} actualizado a ${status}.`);
        }}
        onUpdateDetails={(folio, partial) => {
          updateQuoteTicketDetails(folio, partial);
          if (selectedQuoteDetail) {
            setSelectedQuoteDetail({ ...selectedQuoteDetail, ...partial });
          }
        }}
        onDelete={(folio) => {
          deleteQuoteTicket(folio);
          showToast(`Cotización ${folio} eliminada.`);
        }}
      />
    </div>
  );
}
