import { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Video,
  Filter,
  Search,
} from 'lucide-react';
import { sendStudentTicketEmail } from '../../../../emails';
import type { CourseEnrollment, CourseItem, SiteGeneralConfig } from '../../../../types';
import { StudentEnrollmentCard } from './StudentEnrollmentCard';

export interface AlumnosTabProps {
  courses: CourseItem[];
  courseEnrollments: CourseEnrollment[];
  siteConfig: SiteGeneralConfig;
  onDeleteEnrollment: (enrollment: CourseEnrollment) => void;
  onNavigateToCursos: () => void;
  onShowToast: (msg: string) => void;
}

export function AlumnosTab({
  courses,
  courseEnrollments,
  siteConfig,
  onDeleteEnrollment,
  onNavigateToCursos,
  onShowToast,
}: AlumnosTabProps) {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedEmails, setCopiedEmails] = useState(false);

  const filteredEnrollments = courseEnrollments.filter((e) => {
    const matchesCourse =
      selectedCourseFilter === 'all' || e.courseId === selectedCourseFilter;
    if (!matchesCourse) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      e.buyerName.toLowerCase().includes(q) ||
      e.buyerEmail.toLowerCase().includes(q) ||
      e.buyerPhone.includes(q) ||
      e.folio.toLowerCase().includes(q) ||
      e.accessCode.toLowerCase().includes(q) ||
      e.courseTitle.toLowerCase().includes(q)
    );
  });

  const activeFilteredCourseObj = courses.find((c) => c.id === selectedCourseFilter);

  const filteredCourseRevenue = filteredEnrollments.reduce(
    (sum, e) => sum + (Number(e.totalPaid) || 0),
    0
  );

  const handleExportCsv = (list: CourseEnrollment[]) => {
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
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename =
      selectedCourseFilter === 'all'
        ? `nahocraft-alumnos-todos-${Date.now()}.csv`
        : `nahocraft-alumnos-${activeFilteredCourseObj?.title.slice(0, 20) || 'curso'}-${Date.now()}.csv`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`Archivo CSV exportado exitosamente (${list.length} alumnos).`);
  };

  const handleResendTicket = (enr: CourseEnrollment) => {
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
        onShowToast(`Boleto reenviado a ${enr.buyerEmail}.`);
      })
      .catch(() => {
        onShowToast(`No se pudo reenviar el correo a ${enr.buyerEmail}.`);
      });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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
                onClick={() => handleExportCsv(filteredEnrollments)}
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
                  setCopiedEmails(true);
                  setTimeout(() => setCopiedEmails(false), 2500);
                  onShowToast(
                    selectedCourseFilter === 'all'
                      ? 'Todos los correos copiados al portapapeles.'
                      : `Correos del curso "${activeFilteredCourseObj?.title || 'seleccionado'}" copiados.`
                  );
                }}
                className="px-5 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
                title="Copiar correos de la lista actual para invitaciones en Google Meet"
              >
                {copiedEmails ? (
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
            onClick={onNavigateToCursos}
            className="px-4 py-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-neutral-500" />
            <span>Gestionar Cursos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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
            {selectedCourseFilter === 'all' ? 'Sin filtro de curso' : 'Filtrados por curso'}
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

      {/* Filter Ribbon & Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-naho-pink" />
            Filtrar por Curso Específico
          </span>
          {selectedCourseFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCourseFilter('all')}
              className="text-[10px] font-semibold uppercase tracking-wider text-naho-pink hover:underline cursor-pointer"
            >
              Ver todos los cursos ({courseEnrollments.length})
            </button>
          )}
        </div>

        {/* Course Selector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setSelectedCourseFilter('all')}
            className={`p-4 text-left border transition-all cursor-pointer rounded-xl flex items-center justify-between ${
              selectedCourseFilter === 'all'
                ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                : 'bg-white text-neutral-900 border-black/[0.08] hover:border-black/20 shadow-xs'
            }`}
          >
            <div>
              <span className="font-serif text-lg font-bold block leading-tight">
                Todos los Cursos
              </span>
              <span className="text-[10px] uppercase tracking-wider opacity-60 block mt-0.5">
                Vista general completa
              </span>
            </div>
            <span className="text-xl font-serif font-bold">
              {courseEnrollments.length}
            </span>
          </button>

          {courses.map((course) => {
            const count = courseEnrollments.filter((e) => e.courseId === course.id).length;
            const isSelected = selectedCourseFilter === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseFilter(course.id)}
                className={`p-4 text-left border transition-all cursor-pointer rounded-xl flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                    : 'bg-white text-neutral-900 border-black/[0.08] hover:border-black/20 shadow-xs'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="font-serif text-sm font-bold block leading-tight truncate">
                    {course.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block mt-0.5 truncate">
                    {course.eventDateDisplay}
                  </span>
                </div>
                <span className="text-lg font-serif font-bold shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar alumno por nombre, correo, teléfono, folio o clave de acceso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-naho-pink shadow-xs"
          />
        </div>
      </div>

      {/* Student Cards List */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white p-14 text-center border border-black/[0.05] rounded-2xl">
          <p className="font-serif text-lg text-neutral-600">
            No se encontraron alumnos con los criterios seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enr) => (
            <StudentEnrollmentCard
              key={enr.id}
              enrollment={enr}
              onResendTicket={handleResendTicket}
              onDeleteEnrollment={onDeleteEnrollment}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
