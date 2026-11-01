import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Video,
  Copy,
  Check,
  Users,
} from 'lucide-react';
import type { CourseItem, CourseEnrollment } from '../../../../types';

export interface CursosTabProps {
  courses: CourseItem[];
  courseEnrollments: CourseEnrollment[];
  onOpenNewCourseModal: () => void;
  onOpenEditCourseModal: (course: CourseItem) => void;
  onUpdateCourse: (course: CourseItem) => void;
  onDeleteCourse: (course: CourseItem) => void;
  onNavigateToAlumnos: () => void;
  onShowToast: (msg: string) => void;
}

export function CursosTab({
  courses,
  courseEnrollments,
  onOpenNewCourseModal,
  onOpenEditCourseModal,
  onUpdateCourse,
  onDeleteCourse,
  onNavigateToAlumnos,
  onShowToast,
}: CursosTabProps) {
  const [copiedLinkCourseId, setCopiedLinkCourseId] = useState<string | null>(null);

  const handleCopyMeet = (course: CourseItem) => {
    if (!course.meetingLink) return;
    navigator.clipboard.writeText(course.meetingLink);
    setCopiedLinkCourseId(course.id);
    setTimeout(() => setCopiedLinkCourseId(null), 2500);
    onShowToast(`Enlace de Meet para "${course.title}" copiado.`);
  };

  return (
    <div className="space-y-12">
      {/* Top Metric / Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 bg-[#181B20] text-white border-b-2 border-naho-pink shadow-md">
          <span className="block font-serif text-3xl font-normal leading-none">
            {courses.length}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 text-white/70">
            Cursos Publicados
          </span>
        </div>

        <div
          onClick={onNavigateToAlumnos}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateToAlumnos();
          }}
          className="p-6 bg-white text-neutral-900 border-b-2 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer transition-all"
        >
          <span className="block font-serif text-3xl font-normal leading-none">
            {courseEnrollments.length}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 text-neutral-400">
            Alumnos Inscritos →
          </span>
        </div>
      </div>

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
            onClick={onOpenNewCourseModal}
            className="px-6 py-3.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
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
                className={`group bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between transition-opacity border border-black/[0.04] ${
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
                          onUpdateCourse({ ...course, active: !isCourseActive });
                          onShowToast(
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
                        onClick={() => onOpenEditCourseModal(course)}
                        className="p-2 bg-white/95 hover:bg-white text-neutral-900 shadow-sm cursor-pointer"
                        title="Editar curso y link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCourse(course)}
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
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        ${course.price} MXN
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-neutral-900 font-normal leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Google Meet Link Row */}
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate min-w-0">
                        <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-mono text-[11px]">
                          {course.meetingLink || 'Sin enlace configurado'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyMeet(course)}
                        className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer shrink-0"
                        title="Copiar link de Meet"
                      >
                        {copiedLinkCourseId === course.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.enrolledCount} / {course.maxSpots} inscritos</span>
                  </span>
                  <span>{course.platformName}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
