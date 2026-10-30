import { DailySchedule, StudioStatus, DayOfWeek } from '../types';

export const WEEKLY_SCHEDULE: DailySchedule[] = [
  { dayName: 'Domingo', dayIndex: 0, isOpen: false, displayTime: 'Cerrado' },
  { dayName: 'Lunes', dayIndex: 1, isOpen: true, openHour: 11, closeHour: 21, displayTime: '11:00 - 21:00 hrs' },
  { dayName: 'Martes', dayIndex: 2, isOpen: true, openHour: 11, closeHour: 19, displayTime: '11:00 - 19:00 hrs' },
  { dayName: 'Miércoles', dayIndex: 3, isOpen: true, openHour: 11, closeHour: 19, displayTime: '11:00 - 19:00 hrs' },
  { dayName: 'Jueves', dayIndex: 4, isOpen: true, openHour: 15, closeHour: 21, displayTime: '15:00 - 21:00 hrs' },
  { dayName: 'Viernes', dayIndex: 5, isOpen: true, openHour: 15, closeHour: 21, displayTime: '15:00 - 21:00 hrs' },
  { dayName: 'Sábado', dayIndex: 6, isOpen: true, openHour: 11, closeHour: 21, displayTime: '11:00 - 21:00 hrs' },
];

/**
 * Calculates whether the studio in Tampico (America/Monterrey timezone) is currently open or closed,
 * reading from the dynamic schedule passed from SiteDataContext (or WEEKLY_SCHEDULE fallback).
 */
export function isStudioOpenNow(
  date: Date = new Date(),
  scheduleList: DailySchedule[] = WEEKLY_SCHEDULE
): StudioStatus {
  const activeSchedule = scheduleList.length > 0 ? scheduleList : WEEKLY_SCHEDULE;

  // Get current time in Tampico / America/Monterrey timezone
  const tampicoDateString = date.toLocaleString('en-US', { timeZone: 'America/Monterrey' });
  const tampicoDate = new Date(tampicoDateString);

  const currentDayIndex = tampicoDate.getDay() as DayOfWeek;
  const currentHours = tampicoDate.getHours();
  const currentMinutes = tampicoDate.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  const todaySchedule =
    activeSchedule.find((s) => s.dayIndex === currentDayIndex) || activeSchedule[0];

  let isOpen = false;
  let message = '';
  let nextScheduleInfo = '';

  const formatTime12h = (hour: number, minute: number = 0) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayH = hour % 12 === 0 ? 12 : hour % 12;
    const displayM = minute.toString().padStart(2, '0');
    return `${displayH}:${displayM} ${period}`;
  };

  const currentTimeFormatted = tampicoDate.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const findNextOpenSchedule = (fromDayIdx: number): DailySchedule | undefined => {
    for (let offset = 1; offset <= 7; offset++) {
      const idx = ((fromDayIdx + offset) % 7) as DayOfWeek;
      const candidate = activeSchedule.find((s) => s.dayIndex === idx);
      if (candidate && candidate.isOpen && candidate.openHour !== undefined) {
        return candidate;
      }
    }
    return undefined;
  };

  if (
    todaySchedule.isOpen &&
    todaySchedule.openHour !== undefined &&
    todaySchedule.closeHour !== undefined
  ) {
    const openMinutes = todaySchedule.openHour * 60;
    const closeMinutes = todaySchedule.closeHour * 60;

    if (currentTotalMinutes >= openMinutes && currentTotalMinutes < closeMinutes) {
      isOpen = true;
      message = `¡Taller Abierto! Cerramos a las ${todaySchedule.closeHour}:00 hrs (${formatTime12h(todaySchedule.closeHour)})`;
      nextScheduleInfo = `Horario de hoy: ${todaySchedule.displayTime}`;
    } else if (currentTotalMinutes < openMinutes) {
      isOpen = false;
      message = `Cerrado por ahora • Abrimos hoy a las ${todaySchedule.openHour}:00 hrs`;
      nextScheduleInfo = `Apertura estimada: ${formatTime12h(todaySchedule.openHour)}`;
    } else {
      isOpen = false;
      const nextOpen = findNextOpenSchedule(currentDayIndex);
      if (nextOpen) {
        const isTomorrow = nextOpen.dayIndex === ((currentDayIndex + 1) % 7);
        const dayPrefix = isTomorrow ? `mañana ${nextOpen.dayName}` : `el ${nextOpen.dayName}`;
        message = `Cerrado por hoy • Abrimos ${dayPrefix} a las ${nextOpen.openHour}:00 hrs`;
        nextScheduleInfo = `${nextOpen.dayName} de ${nextOpen.displayTime}`;
      } else {
        message = 'Cerrado temporalmente';
        nextScheduleInfo = 'Consulta horarios por WhatsApp';
      }
    }
  } else {
    isOpen = false;
    const nextOpen = findNextOpenSchedule(currentDayIndex);
    if (nextOpen) {
      message = `Cerrado hoy ${todaySchedule.dayName} • Abrimos el ${nextOpen.dayName} a las ${nextOpen.openHour}:00 hrs`;
      nextScheduleInfo = `Próxima apertura: ${nextOpen.dayName} (${formatTime12h(nextOpen.openHour ?? 11)})`;
    } else {
      message = `Cerrado hoy ${todaySchedule.dayName}`;
      nextScheduleInfo = 'Consulta disponibilidad';
    }
  }

  return {
    isOpen,
    currentDay: todaySchedule.dayName,
    currentTimeTampico: currentTimeFormatted,
    message,
    nextScheduleInfo,
  };
}
