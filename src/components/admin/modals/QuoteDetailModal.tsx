import {
  X,
  MapPin,
  Calendar,
  MessageCircle,
  Mail,
  Trash2,
} from 'lucide-react';
import type { QuoteTicket } from '../../../types';

export interface QuoteDetailModalProps {
  isOpen: boolean;
  ticket: QuoteTicket | null;
  onClose: () => void;
  onUpdateStatus: (folio: string, status: QuoteTicket['status']) => void;
  onUpdateDetails: (
    folio: string,
    partial: Partial<Pick<QuoteTicket, 'status' | 'quotedAmount' | 'adminNotes'>>
  ) => void;
  onDelete: (folio: string) => void;
}

export function QuoteDetailModal({
  isOpen,
  ticket,
  onClose,
  onUpdateStatus,
  onUpdateDetails,
  onDelete,
}: QuoteDetailModalProps) {
  if (!isOpen || !ticket) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-black/10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#181B20] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-naho-pink">
              {ticket.folio}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs text-white/80 font-medium">
              {ticket.formData.clientName}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[11px] text-white/50">{ticket.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onDelete(ticket.folio);
                onClose();
              }}
              className="p-1.5 text-rose-400 hover:text-rose-200 cursor-pointer"
              title="Eliminar cotización"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Select */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F5F2EB]/70 border border-black/[0.05] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600">
              Estado de la Solicitud:
            </span>
            <select
              value={ticket.status}
              onChange={(e) =>
                onUpdateStatus(ticket.folio, e.target.value as QuoteTicket['status'])
              }
              className="py-1.5 px-3 bg-white border border-neutral-300 rounded text-xs font-semibold text-neutral-800 focus:outline-none focus:border-naho-pink"
            >
              <option value="nuevo">Nuevo</option>
              <option value="en_revision">En Revisión</option>
              <option value="propuesta_enviada">Propuesta Enviada</option>
              <option value="aprobado">Aprobado</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                Tipo de Mural
              </span>
              <p className="font-semibold text-neutral-900 mt-1">
                {ticket.formData.muralCategory === 'Otro tipo de mural' &&
                ticket.formData.customMuralType
                  ? `Otro: ${ticket.formData.customMuralType}`
                  : ticket.formData.muralCategory || 'Mural Personalizado'}
              </p>
              <p className="text-neutral-500 mt-0.5">{ticket.formData.dimensions}</p>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                Ciudad y Zona
              </span>
              <p className="font-semibold text-neutral-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-naho-pink" />
                {ticket.formData.cityZone || ticket.formData.clientLocation}
              </p>
              <p className="text-neutral-500 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {ticket.formData.deadlineDate || 'Fecha flexible'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                Contacto Directo
              </span>
              <a
                href={`https://wa.me/52${ticket.formData.clientPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-700 hover:underline mt-1 flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>{ticket.formData.clientPhone}</span>
              </a>
              <a
                href={`mailto:${ticket.formData.clientEmail}`}
                className="font-mono text-neutral-500 hover:text-neutral-900 hover:underline truncate mt-0.5 flex items-center gap-1"
              >
                <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="truncate">{ticket.formData.clientEmail}</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 bg-[#F5F2EB]/60 border-l-2 border-[#181B20] space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
              Idea descrita por el cliente
            </span>
            <p className="text-sm text-neutral-800 leading-relaxed">
              &ldquo;{ticket.formData.themeAndDetails}&rdquo;
            </p>
          </div>

          {/* Budget & Notes */}
          <div className="p-4 bg-white border border-black/[0.08] rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                Presupuesto Cotizado ($ MXN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="Ej. 8500"
                  value={ticket.quotedAmount ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    onUpdateDetails(ticket.folio, {
                      quotedAmount: raw === '' ? undefined : Number(raw),
                    });
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none rounded"
                />
              </div>
            </div>

            <div className="sm:col-span-8">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                Notas Internas / Seguimiento de Nahomy
              </label>
              <input
                type="text"
                placeholder="Ej. Se acordó visita técnica el viernes a las 4pm..."
                value={ticket.adminNotes ?? ''}
                onChange={(e) =>
                  onUpdateDetails(ticket.folio, {
                    adminNotes: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none rounded"
              />
            </div>
          </div>

          {/* Reference Image */}
          {ticket.formData.referenceImagePreview && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                Referencia Adjunta por el Cliente
              </span>
              <div className="aspect-[16/9] max-h-80 bg-neutral-100 overflow-hidden border border-black/[0.06] rounded-xl flex items-center justify-center">
                <img
                  src={ticket.formData.referenceImagePreview}
                  alt="Referencia"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/[0.06]">
            <a
              href={`https://wa.me/52${ticket.formData.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hola ${ticket.formData.clientName}! Te saluda Nahomy de Nahocraft Centro de Arte en Tampico 🎨 Te escribo respecto a tu solicitud de cotización (${ticket.folio}) para tu proyecto de ${ticket.formData.muralCategory || 'mural'} en ${ticket.formData.cityZone || 'Tampico'}. Me encantó tu idea y me gustaría platicar los detalles y medidas (${ticket.formData.dimensions}). ¿Cómo estás?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 rounded"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Mandar WhatsApp</span>
            </a>

            <a
              href={`mailto:${ticket.formData.clientEmail}?subject=${encodeURIComponent(
                `Cotización de Mural ${ticket.folio} • Nahocraft Centro de Arte`
              )}&body=${encodeURIComponent(
                `Hola ${ticket.formData.clientName},\n\nGracias por comunicarte con Nahocraft Centro de Arte en Tampico. Recibí con mucho gusto tu solicitud para la cotización de tu mural (${ticket.folio}) en ${ticket.formData.cityZone || 'Tampico'}.\n\nMe encantaría afinar los detalles de tu espacio, medidas (${ticket.formData.dimensions}) y tu idea para prepararte una propuesta visual a la medida.\n\nQuedo a tus órdenes,\nNahomy • Nahocraft Centro de Arte\n+52 833 365 5622\nTampico, Tamaulipas`
              )}`}
              className="px-5 py-2.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 rounded"
            >
              <Mail className="w-4 h-4" />
              <span>Responder por Correo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
