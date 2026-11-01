import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  X,
  Video,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { localAssets } from '../../../assets';
import { uploadMediaWithCompression } from '../../../utils/mediaUploader';
import {
  SPANISH_MONTHS,
  YEAR_OPTIONS,
  formatSpanishDateFromIso,
  getMonthAndYearFromIso,
  generateGoogleMeetUrl,
} from '../../../utils/courseHelpers';
import type { CourseItem } from '../../../types';
import { GoogleMeetGenerator } from './course/GoogleMeetGenerator';
import { CourseCardPreview } from './course/CourseCardPreview';

export interface CourseModalProps {
  isOpen: boolean;
  editingCourse: CourseItem | null;
  onClose: () => void;
  onSave: (course: CourseItem) => void;
  onShowToast: (msg: string) => void;
}

export function CourseModal({
  isOpen,
  editingCourse,
  onClose,
  onSave,
  onShowToast,
}: CourseModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('Curso en Vivo Paso a Paso');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-29');
  const [eventDateDisplay, setEventDateDisplay] = useState('29 de Octubre, 2026');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('19:30');
  const [eventTimeDisplay, setEventTimeDisplay] = useState('17:00 - 19:30 hrs');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-29T16:00');
  const [maxSpots, setMaxSpots] = useState(15);
  const [price, setPrice] = useState(480);
  const [modality, setModality] = useState<CourseItem['modality']>('online');
  const [level, setLevel] = useState('Todos los niveles (Sin experiencia previa necesaria)');
  const [platformName, setPlatformName] = useState('Google Meet (En Vivo)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/nah-arte-curso');
  const [selectedMonth, setSelectedMonth] = useState('Octubre');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [monthLabel, setMonthLabel] = useState('Octubre 2026');
  const [image, setImage] = useState(localAssets.murales.dulceria);
  const [includesText, setIncludesText] = useState(
    'Acceso en vivo por Google Meet\nLista de materiales en PDF\nRetroalimentación en directo con Nahomy'
  );
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title);
      setSubtitle(editingCourse.subtitle);
      setDescription(editingCourse.description);
      setEventDate(editingCourse.eventDate);
      setEventDateDisplay(editingCourse.eventDateDisplay);

      const timeParts = editingCourse.eventTimeDisplay.split(' - ');
      setStartTime(timeParts[0] || '17:00');
      setEndTime(timeParts[1]?.replace(' hrs', '') || '19:30');
      setEventTimeDisplay(editingCourse.eventTimeDisplay);

      setRegistrationDeadline(editingCourse.registrationDeadline);
      setMaxSpots(editingCourse.maxSpots);
      setPrice(editingCourse.price);
      setModality(editingCourse.modality || 'online');
      setLevel(editingCourse.level);
      setPlatformName(editingCourse.platformName);
      setMeetingLink(editingCourse.meetingLink);

      const { month, year } = getMonthAndYearFromIso(editingCourse.eventDate);
      setSelectedMonth(month);
      setSelectedYear(year);
      setMonthLabel(editingCourse.monthLabel || `${month} ${year}`);

      setImage(editingCourse.image);
      setIncludesText(editingCourse.includes.join('\n'));
      setFeatured(Boolean(editingCourse.featured));
      setActive(editingCourse.active !== false);
    } else {
      setTitle('');
      setSubtitle('Curso en Vivo Paso a Paso');
      setDescription('');
      setEventDate('2026-10-29');
      setEventDateDisplay('29 de Octubre, 2026');
      setStartTime('17:00');
      setEndTime('19:30');
      setEventTimeDisplay('17:00 - 19:30 hrs');
      setRegistrationDeadline('2026-10-29T16:00');
      setMaxSpots(15);
      setPrice(480);
      setModality('online');
      setLevel('Todos los niveles (Sin experiencia previa necesaria)');
      setPlatformName('Google Meet (En Vivo)');
      setMeetingLink(generateGoogleMeetUrl());
      setSelectedMonth('Octubre');
      setSelectedYear('2026');
      setMonthLabel('Octubre 2026');
      setImage(localAssets.murales.dulceria);
      setIncludesText(
        'Acceso en vivo por Google Meet\nLista de materiales en PDF\nRetroalimentación en directo con Nahomy'
      );
      setFeatured(false);
      setActive(true);
    }
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaWithCompression(file, 'cursos');
      setImage(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedIncludes = includesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const courseData: CourseItem = {
      id: editingCourse?.id || `course-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Curso en Vivo Paso a Paso',
      description: description.trim(),
      eventDate,
      eventDateDisplay,
      eventTimeDisplay,
      registrationDeadline,
      maxSpots,
      enrolledCount: editingCourse?.enrolledCount || 0,
      price,
      modality,
      platformName: platformName.trim() || 'Google Meet (En Vivo)',
      meetingLink: meetingLink.trim(),
      image,
      monthLabel,
      level: level.trim() || 'Todos los niveles',
      includes: parsedIncludes.length ? parsedIncludes : ['Acceso a sesión en vivo'],
      featured,
      active,
    };

    onSave(courseData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto border border-black/10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-naho-pink/20 text-naho-pink">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg leading-tight">
                {editingCourse ? 'Editar Curso y Sala Virtual' : 'Crear Nuevo Curso del Mes'}
              </h3>
              <p className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                Configuración de modalidad, fecha, horario, Meet y vista previa en vivo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Masterclass: Ilustración Acrílica, Color & Composición"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full py-2 border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-600 focus:outline-none"
                />
              </div>

              {/* Modality, Platform & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl">
                <div>
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                    Modalidad
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => {
                      const newMod = e.target.value as CourseItem['modality'];
                      const suggestedPlatform =
                        newMod === 'presencial'
                          ? 'Taller Físico Tampico (Col. Minerva)'
                          : newMod === 'hibrido'
                          ? 'Taller Tampico + Google Meet en Vivo'
                          : 'Google Meet (En Vivo)';
                      setModality(newMod);
                      setPlatformName(suggestedPlatform);
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
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
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
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink"
                  />
                </div>
              </div>

              {/* Month and Date */}
              <div className="p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-naho-pink" />
                  Fecha y Mes del Curso
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                      Mes
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => {
                        const newMonth = e.target.value;
                        setSelectedMonth(newMonth);
                        setMonthLabel(`${newMonth} ${selectedYear}`);
                      }}
                      className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-semibold"
                    >
                      {SPANISH_MONTHS.map((m: string) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                      Año
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        setSelectedYear(newYear);
                        setMonthLabel(`${selectedMonth} ${newYear}`);
                      }}
                      className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-semibold"
                    >
                      {YEAR_OPTIONS.map((y: string) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500 mb-1">
                      Día Específico *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => {
                        const newIso = e.target.value;
                        if (!newIso) return;
                        const { month, year } = getMonthAndYearFromIso(newIso);
                        const formatted = formatSpanishDateFromIso(newIso);
                        setEventDate(newIso);
                        setEventDateDisplay(formatted);
                        setSelectedMonth(month);
                        setSelectedYear(year);
                        setMonthLabel(`${month} ${year}`);
                        setRegistrationDeadline(`${newIso}T${startTime || '16:00'}`);
                      }}
                      className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-600 font-medium">
                  <span>Texto oficial de fecha:</span>
                  <span className="font-semibold text-neutral-900 bg-white px-2 py-0.5 rounded border border-black/5">
                    {eventDateDisplay || 'Selecciona un día'}
                  </span>
                </div>
              </div>

              {/* Time Selection */}
              <div className="p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-naho-blue" />
                    Horario de la Sesión
                  </span>
                  <span className="text-[11px] font-mono font-bold text-neutral-800">
                    {eventTimeDisplay}
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
                      value={startTime}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartTime(newStart);
                        setEventTimeDisplay(`${newStart} - ${endTime} hrs`);
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
                      value={endTime}
                      onChange={(e) => {
                        const newEnd = e.target.value;
                        setEndTime(newEnd);
                        setEventTimeDisplay(`${startTime} - ${newEnd} hrs`);
                      }}
                      className="w-full py-1.5 px-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-naho-pink font-mono"
                    />
                  </div>
                </div>

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
                        setStartTime(preset.s);
                        setEndTime(preset.e);
                        setEventTimeDisplay(`${preset.s} - ${preset.e} hrs`);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-white hover:bg-neutral-100 border border-black/10 text-neutral-700 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submódulo Google Meet */}
              <GoogleMeetGenerator
                meetingLink={meetingLink}
                onChangeMeetingLink={setMeetingLink}
                onShowToast={onShowToast}
              />

              {/* Price, Spots, Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                    Precio ($ MXN) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
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
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
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
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full py-1.5 border-b border-neutral-300 focus:border-naho-pink text-[11px] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Description & Includes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                    Descripción del Taller
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    value={includesText}
                    onChange={(e) => setIncludesText(e.target.value)}
                    placeholder="Acceso en vivo por Google Meet&#10;Lista de materiales PDF&#10;Constancia de participación"
                    className="w-full p-2.5 bg-[#F5F2EB]/50 border border-neutral-200 text-xs text-neutral-800 rounded focus:outline-none focus:border-naho-pink"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Mockup Card (5 cols) */}
            <CourseCardPreview
              title={title}
              subtitle={subtitle}
              image={image}
              modality={modality}
              monthLabel={monthLabel}
              eventDateDisplay={eventDateDisplay}
              eventTimeDisplay={eventTimeDisplay}
              price={price}
              maxSpots={maxSpots}
              featured={featured}
              active={active}
              isUploading={isUploading}
              onUploadImage={handleUploadImage}
              onChangeFeatured={setFeatured}
              onChangeActive={setActive}
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
            <span className="text-[11px] text-neutral-400">
              {editingCourse ? 'Modificando curso existente' : 'Nuevo curso del mes'}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-3 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                {editingCourse ? 'Guardar Cambios' : 'Publicar Curso'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
