import { Clock } from 'lucide-react';
import type { DailySchedule } from '../../../../types';

export interface WeeklyScheduleEditorProps {
  weeklySchedule: DailySchedule[];
  onUpdateWeeklySchedule: (schedule: DailySchedule[]) => void;
}

export function WeeklyScheduleEditor({
  weeklySchedule,
  onUpdateWeeklySchedule,
}: WeeklyScheduleEditorProps) {
  return (
    <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-5">
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h3 className="font-serif text-xl text-neutral-900 font-normal">
            Horario de Atención Semanal del Taller
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Define qué días y horas abre el taller físico en Tampico
          </p>
        </div>
        <Clock className="w-5 h-5 text-naho-blue" />
      </div>

      <div className="space-y-3">
        {weeklySchedule.map((day, idx) => (
          <div
            key={day.dayIndex}
            className="p-3.5 bg-[#F5F2EB]/50 border border-black/[0.04] flex flex-wrap items-center justify-between gap-3 rounded-lg"
          >
            <div className="w-28 font-medium text-xs text-neutral-900">
              {day.dayName}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={(e) => {
                  const next = [...weeklySchedule];
                  next[idx] = {
                    ...day,
                    isOpen: e.target.checked,
                    displayTime: e.target.checked
                      ? day.openHour
                        ? `${day.openHour} - ${day.closeHour}`
                        : 'Abierto'
                      : 'Cerrado',
                  };
                  onUpdateWeeklySchedule(next);
                }}
                className="accent-emerald-600 w-4 h-4 rounded"
              />
              <span className={day.isOpen ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}>
                {day.isOpen ? 'Abierto' : 'Cerrado'}
              </span>
            </label>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <input
                type="text"
                placeholder="Ej. 10:00 - 19:00 hrs"
                value={day.displayTime}
                disabled={!day.isOpen}
                onChange={(e) => {
                  const next = [...weeklySchedule];
                  next[idx] = { ...day, displayTime: e.target.value };
                  onUpdateWeeklySchedule(next);
                }}
                className="py-1 px-2 bg-white border border-neutral-300 text-xs text-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 rounded w-48 text-right font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

