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
 * Calculates whether the studio in Tampico (America/Monterrey timezone) is currently open or closed.
 */
export function isStudioOpenNow(date: Date = new Date()): StudioStatus {
  // Get current time in Tampico / America/Monterrey timezone
  const tampicoDateString = date.toLocaleString('en-US', { timeZone: 'America/Monterrey' });
  const tampicoDate = new Date(tampicoDateString);

  const currentDayIndex = tampicoDate.getDay() as DayOfWeek;
  const currentHours = tampicoDate.getHours();
  const currentMinutes = tampicoDate.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  const todaySchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === currentDayIndex) || WEEKLY_SCHEDULE[0];

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

  if (todaySchedule.isOpen && todaySchedule.openHour !== undefined && todaySchedule.closeHour !== undefined) {
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
      // Already closed for today, check next opening day
      const nextDayIndex = ((currentDayIndex + 1) % 7) as DayOfWeek;
      const nextSchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === nextDayIndex);
      if (nextSchedule && nextSchedule.isOpen) {
        message = `Cerrado por hoy • Abrimos mañana ${nextSchedule.dayName} a las ${nextSchedule.openHour}:00 hrs`;
        nextScheduleInfo = `Mañana ${nextSchedule.dayName} de ${nextSchedule.displayTime}`;
      } else {
        // e.g. Saturday closing -> Sunday is closed -> Monday opens
        const mondaySchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === 1)!;
        message = `Cerrado • Abrimos el Lunes a las ${mondaySchedule.openHour}:00 hrs`;
        nextScheduleInfo = `Lunes de ${mondaySchedule.displayTime}`;
      }
    }
  } else {
    // Sunday (Cerrado)
    const mondaySchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === 1)!;
    isOpen = false;
    message = `Cerrado hoy Domingo • Abrimos el Lunes a las ${mondaySchedule.openHour}:00 hrs`;
    nextScheduleInfo = `Próxima apertura: Lunes a las 11:00 AM`;
  }

  return {
    isOpen,
    currentDay: todaySchedule.dayName,
    currentTimeTampico: currentTimeFormatted,
    message,
    nextScheduleInfo,
  };
}
