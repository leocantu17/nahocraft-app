export const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const YEAR_OPTIONS = ['2026', '2027'];

export function formatSpanishDateFromIso(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = SPANISH_MONTHS[monthIdx] || parts[1];
  return `${day} de ${monthName}, ${year}`;
}

export function getMonthAndYearFromIso(isoDate: string): { month: string; year: string } {
  if (!isoDate) return { month: 'Octubre', year: '2026' };
  const parts = isoDate.split('-');
  if (parts.length < 3) return { month: 'Octubre', year: '2026' };
  const year = parts[0] || '2026';
  const monthIdx = parseInt(parts[1], 10) - 1;
  const month = SPANISH_MONTHS[monthIdx] || 'Octubre';
  return { month, year };
}

export function generateGoogleMeetUrl(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const rPart = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/nah-${rPart(4)}-${rPart(3)}`;
}

