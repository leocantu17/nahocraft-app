import { useState } from 'react';
import {
  Video,
  Copy,
  Check,
  Wand2,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { generateGoogleMeetUrl } from '../../../../utils/courseHelpers';

export interface GoogleMeetGeneratorProps {
  meetingLink: string;
  onChangeMeetingLink: (url: string) => void;
  onShowToast: (msg: string) => void;
}

export function GoogleMeetGenerator({
  meetingLink,
  onChangeMeetingLink,
  onShowToast,
}: GoogleMeetGeneratorProps) {
  const [copiedMeetLink, setCopiedMeetLink] = useState(false);

  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 border border-emerald-500/20 rounded-xl space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            <Video className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-900 block leading-tight">
              Enlace de Acceso / Sala Virtual Google Meet
            </span>
            <span className="text-[9px] text-emerald-700 font-semibold">
              Se enviará automáticamente en el pase digital de cada alumno
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Sala Lista
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="url"
          required
          placeholder="https://meet.google.com/..."
          value={meetingLink}
          onChange={(e) => onChangeMeetingLink(e.target.value)}
          className="flex-1 py-2 px-3 bg-white border border-emerald-300 focus:border-emerald-600 text-xs font-mono text-neutral-900 rounded focus:outline-none shadow-xs"
        />

        <button
          type="button"
          onClick={() => {
            if (meetingLink) {
              navigator.clipboard.writeText(meetingLink);
              setCopiedMeetLink(true);
              setTimeout(() => setCopiedMeetLink(false), 2500);
              onShowToast('Enlace de Meet copiado al portapapeles.');
            }
          }}
          className="px-3 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Copiar enlace"
        >
          {copiedMeetLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] text-emerald-600">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[10px]">Copiar</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            const newMeet = generateGoogleMeetUrl();
            onChangeMeetingLink(newMeet);
            onShowToast('¡Nueva sala de Google Meet generada!');
          }}
          className="px-3 py-1.5 bg-[#181B20] hover:bg-emerald-700 text-white text-[10px] font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Wand2 className="w-3 h-3 text-emerald-300" />
          <span>🪄 Generar Nueva Sala de Meet</span>
        </button>

        <a
          href="https://meet.new"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 text-[10px] font-semibold uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition-colors"
          title="Abrir meet.new en Google"
        >
          <ExternalLink className="w-3 h-3 text-neutral-500" />
          <span>Abrir meet.new</span>
        </a>

        {meetingLink && (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 text-emerald-700 hover:text-emerald-900 text-[10px] font-semibold underline inline-flex items-center gap-1 ml-auto"
          >
            <span>Probar sala</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

