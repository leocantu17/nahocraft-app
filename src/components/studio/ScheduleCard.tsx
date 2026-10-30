import { useState, useEffect } from 'react';
import { isStudioOpenNow } from '../../data/scheduleData';
import { useSiteData } from '../../context/SiteDataContext';
import { ScheduleStatusBadge } from '../layout/ScheduleStatusBadge';
import { Clock, Calendar, XCircle } from 'lucide-react';

export function ScheduleCard() {
  const { weeklySchedule } = useSiteData();
  const [status, setStatus] = useState(() => isStudioOpenNow(new Date(), weeklySchedule));

  useEffect(() => {
    setStatus(isStudioOpenNow(new Date(), weeklySchedule));
    const timer = setInterval(() => {
      setStatus(isStudioOpenNow(new Date(), weeklySchedule));
    }, 30000);
    return () => clearInterval(timer);
  }, [weeklySchedule]);

  return (
    <div id="horarios" className="apple-card rounded-[2.5rem] p-7 sm:p-9">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.05]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-black/[0.04] text-neutral-800">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xl text-neutral-900 tracking-tight">
              Horarios del Taller Físico
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            Clases presenciales y atención en Col. Minerva, Tampico
          </p>
        </div>

        <ScheduleStatusBadge />
      </div>

      {/* Schedule Table */}
      <div className="mt-6 divide-y divide-black/[0.04]">
        {weeklySchedule.map((item) => {
          const isToday = item.dayName.toLowerCase() === status.currentDay.toLowerCase();

          return (
            <div
              key={item.dayIndex}
              className={`py-3.5 px-4 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                isToday
                  ? 'bg-neutral-950 text-white font-semibold shadow-xs'
                  : 'hover:bg-neutral-50/80 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isToday
                      ? 'bg-naho-pink ring-2 ring-white/30'
                      : item.isOpen
                      ? 'bg-emerald-500'
                      : 'bg-neutral-300'
                  }`}
                />
                <span className={`text-[13px] ${isToday ? 'text-white font-bold' : 'text-neutral-800'}`}>
                  {item.dayName}
                  {isToday && (
                    <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                      Hoy
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.isOpen ? (
                  <span
                    className={`text-[13px] font-mono ${
                      isToday ? 'text-neutral-200 font-semibold' : 'text-neutral-600'
                    }`}
                  >
                    {item.displayTime}
                  </span>
                ) : (
                  <span className={`text-xs font-semibold flex items-center gap-1 ${isToday ? 'text-rose-300' : 'text-neutral-400'}`}>
                    <XCircle className="w-3.5 h-3.5" />
                    Cerrado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-neutral-50/80 border border-black/[0.04] text-xs text-neutral-500 flex items-start gap-3">
        <Calendar className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-neutral-800">¿Deseas inscribirte a clases presenciales o visitar el taller?</strong> Puedes acudir directamente en nuestros horarios de atención o escribirnos al correo oficial para niños, adolescentes o adultos.
        </p>
      </div>
    </div>
  );
}
