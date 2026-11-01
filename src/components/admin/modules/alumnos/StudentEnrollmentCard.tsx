import {
  CheckCircle2,
  Ticket,
  Video,
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  Send,
  Trash2,
  Copy,
} from 'lucide-react';
import type { CourseEnrollment } from '../../../../types';

export interface StudentEnrollmentCardProps {
  enrollment: CourseEnrollment;
  onResendTicket: (enr: CourseEnrollment) => void;
  onDeleteEnrollment: (enr: CourseEnrollment) => void;
  onShowToast: (msg: string) => void;
}

export function StudentEnrollmentCard({
  enrollment: enr,
  onResendTicket,
  onDeleteEnrollment,
  onShowToast,
}: StudentEnrollmentCardProps) {
  const initials = enr.buyerName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const paymentLabel =
    enr.paymentMethod === 'tarjeta'
      ? 'Tarjeta'
      : enr.paymentMethod === 'transferencia'
      ? 'SPEI / Transferencia'
      : 'OXXO / Efectivo';

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-white/20 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-neutral-900 truncate leading-tight">
                {enr.buyerName}
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                Registrado: {enr.purchasedAt}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Confirmado</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[10px] font-mono font-bold tracking-wider">
            {enr.folio}
          </span>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-naho-pink/10 border border-naho-pink/20 text-naho-pink rounded-lg text-[10px] font-mono font-bold">
            <Ticket className="w-3 h-3" />
            <span>Clave: {enr.accessCode}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(enr.accessCode);
                onShowToast(`Clave ${enr.accessCode} copiada.`);
              }}
              className="ml-1 hover:text-neutral-900 cursor-pointer"
              title="Copiar clave de acceso"
            >
              <Copy className="w-2.5 h-2.5" />
            </button>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-black/5">
            {paymentLabel}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#F5F2EB]/60 border border-black/[0.04] space-y-2">
        <div className="flex items-start gap-2 text-xs font-semibold text-neutral-900 leading-snug">
          <Video className="w-3.5 h-3.5 text-naho-pink shrink-0 mt-0.5" />
          <span className="line-clamp-2">{enr.courseTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-neutral-600 pt-1 border-t border-black/[0.04]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="truncate">{enr.courseDateDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="font-mono truncate">{enr.courseTimeDisplay}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2 text-neutral-700">
          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <a
            href={`mailto:${enr.buyerEmail}`}
            className="font-mono text-neutral-600 hover:text-naho-pink hover:underline truncate"
          >
            {enr.buyerEmail}
          </a>
        </div>
        <div className="flex items-center gap-2 text-neutral-700">
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
          <span className="font-mono text-neutral-800 font-semibold">{enr.buyerPhone}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
            Total Pagado
          </span>
          <span className="font-serif text-base font-bold text-neutral-900">
            ${enr.totalPaid.toLocaleString('es-MX')} MXN
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onResendTicket(enr)}
            className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reenviar boleto y código de acceso al correo del alumno"
          >
            <Send className="w-3 h-3 text-naho-pink" />
            <span>Reenviar</span>
          </button>

          <a
            href={`https://wa.me/52${enr.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
              `¡Hola ${enr.buyerName}! Te saluda Nahomy de Nahocraft Centro de Arte 🎨 Te escribo respecto a tu inscripción a '${enr.courseTitle}'. Tu código de acceso personal es ${enr.accessCode}. La sesión en vivo será el ${enr.courseDateDisplay} a las ${enr.courseTimeDisplay} por Google Meet. ¿Tienes alguna duda antes de la clase?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
            title="Enviar mensaje por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`mailto:${enr.buyerEmail}?subject=${encodeURIComponent(
              `Nahocraft • Acceso a tu curso "${enr.courseTitle}"`
            )}&body=${encodeURIComponent(
              `Hola ${enr.buyerName},\n\nTe saluda Nahomy de Nahocraft Centro de Arte en Tampico.\n\nTe confirmo tu lugar para el curso "${enr.courseTitle}".\n\nDetalles de tu sesión:\n- Folio: ${enr.folio}\n- Código de Acceso: ${enr.accessCode}\n- Fecha: ${enr.courseDateDisplay}\n- Horario: ${enr.courseTimeDisplay}\n- Sala de Google Meet: ${enr.meetingLink}\n\nRecomendaciones:\n1. Conéctate 5 minutos antes para probar tu micrófono y cámara.\n2. Ten listos tus materiales y lienzos.\n\n¡Nos vemos en clase!\n\nNahomy • Nahocraft Centro de Arte\nTampico, Tamaulipas`
            )}`}
            className="px-3 py-2 bg-[#181B20] hover:bg-naho-pink text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
            title="Enviar correo personalizado"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Correo</span>
          </a>

          <button
            type="button"
            onClick={() => onDeleteEnrollment(enr)}
            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Cancelar boleto y liberar lugar en el curso"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

