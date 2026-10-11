import { useState, useEffect } from 'react';
import { isStudioOpenNow } from '../../data/scheduleData';
import { Clock } from 'lucide-react';

interface ScheduleStatusBadgeProps {
  compact?: boolean;
  className?: string;
}

export function ScheduleStatusBadge({ compact = false, className = '' }: ScheduleStatusBadgeProps) {
  const [status, setStatus] = useState(() => isStudioOpenNow());

  useEffect(() => {
    // Check every 30 seconds to keep live status accurate
    const interval = setInterval(() => {
      setStatus(isStudioOpenNow());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium tracking-tight backdrop-blur-xl transition-all duration-300 border select-none ${
          status.isOpen
            ? 'bg-emerald-500/[0.08] text-emerald-800 border-emerald-500/20 hover:bg-emerald-500/[0.12]'
            : 'bg-black/[0.03] text-neutral-600 border-black/[0.06] hover:bg-black/[0.06]'
        } ${className}`}
        title={`Hora en Tampico: ${status.currentTimeTampico} | ${status.nextScheduleInfo}`}
      >
        <span className="relative flex h-2 w-2">
          {status.isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status.isOpen ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-neutral-400'
            }`}
          ></span>
        </span>
        <span className="font-semibold text-neutral-900">
          {status.isOpen ? 'Abierto' : 'Cerrado'}
        </span>
        <span className="text-neutral-400 text-[11px] font-normal hidden sm:inline">•</span>
        <span className="text-neutral-500 text-[11px] hidden sm:inline font-mono">
          {status.currentTimeTampico} Tampico
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        status.isOpen
          ? 'bg-white/80 border-emerald-500/20 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.12)]'
          : 'bg-white/80 border-black/[0.06] shadow-sm'
      } ${className}`}
    >
      <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
        {status.isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            status.isOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'bg-neutral-400'
          }`}
        ></span>
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[12px] tracking-tight text-neutral-900">
            {status.isOpen ? 'Taller Abierto en Tampico' : 'Taller Cerrado por Ahora'}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            {status.currentTimeTampico}
          </span>
        </div>
        <p className="text-[12px] text-neutral-500 mt-0.5 tracking-normal">
          {status.message}
        </p>
      </div>
    </div>
  );
}
