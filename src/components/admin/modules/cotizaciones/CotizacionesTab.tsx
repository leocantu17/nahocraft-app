import { useState } from 'react';
import {
  MapPin,
  Calendar,
  MessageCircle,
  Mail,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { QuoteTicket } from '../../../../types';

export interface CotizacionesTabProps {
  quoteTickets: QuoteTicket[];
  onSelectQuote?: (ticket: QuoteTicket) => void;
  onUpdateStatus: (folio: string, status: QuoteTicket['status']) => void;
  onUpdateDetails: (
    folio: string,
    partial: Partial<Pick<QuoteTicket, 'status' | 'quotedAmount' | 'adminNotes'>>
  ) => void;
  onDeleteQuote: (ticket: QuoteTicket) => void;
}

export function CotizacionesTab({
  quoteTickets,
  onSelectQuote,
  onUpdateStatus,
  onUpdateDetails,
  onDeleteQuote,
}: CotizacionesTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    'todas' | 'nuevo' | 'en_revision' | 'propuesta_enviada' | 'aprobado'
  >('todas');

  const filteredQuotes =
    selectedFilter === 'todas'
      ? quoteTickets
      : quoteTickets.filter((q) => q.status === selectedFilter);

  const statusFilters = [
    { id: 'todas' as const, label: 'Todas', count: quoteTickets.length },
    {
      id: 'nuevo' as const,
      label: 'Nuevas',
      count: quoteTickets.filter((q) => q.status === 'nuevo').length,
    },
    {
      id: 'en_revision' as const,
      label: 'En Revisión',
      count: quoteTickets.filter((q) => q.status === 'en_revision').length,
    },
    {
      id: 'propuesta_enviada' as const,
      label: 'Propuesta Enviada',
      count: quoteTickets.filter((q) => q.status === 'propuesta_enviada').length,
    },
    {
      id: 'aprobado' as const,
      label: 'Aprobadas',
      count: quoteTickets.filter((q) => q.status === 'aprobado').length,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusFilters.map((st) => {
          const isSelected = selectedFilter === st.id;
          return (
            <div
              key={st.id}
              onClick={() => setSelectedFilter(st.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedFilter(st.id);
              }}
              className={`p-6 text-left transition-all cursor-pointer border-b-2 ${
                isSelected
                  ? 'bg-[#181B20] text-white border-naho-pink shadow-md'
                  : 'bg-white text-neutral-900 border-transparent hover:border-neutral-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
              }`}
            >
              <span className="block font-serif text-3xl font-normal leading-none">
                {st.count}
              </span>
              <span
                className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mt-2 ${
                  isSelected ? 'text-white/70' : 'text-neutral-400'
                }`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            Cotizaciones de Murales
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Solicitudes exclusivas de Tampico, Ciudad Madero y Altamira
          </p>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="bg-white p-14 text-center border border-black/[0.05]">
            <p className="font-serif text-lg text-neutral-600">
              No hay cotizaciones en este estado.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map((ticket) => (
              <article
                key={ticket.folio}
                className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04] space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-naho-pink">
                      {ticket.folio}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="font-serif text-lg font-bold text-neutral-900">
                      {ticket.formData.clientName}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {ticket.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        onUpdateStatus(ticket.folio, e.target.value as QuoteTicket['status'])
                      }
                      className="py-1.5 px-3 bg-[#F5F2EB] border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-800 focus:outline-none focus:border-naho-pink"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="propuesta_enviada">Propuesta Enviada</option>
                      <option value="aprobado">Aprobado</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onDeleteQuote(ticket)}
                      className="p-2 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Eliminar cotización"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
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
                        <p className="text-neutral-500 mt-0.5">
                          {ticket.formData.dimensions}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                          Ciudad y Fecha
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
                          className="font-mono text-emerald-700 hover:text-emerald-800 hover:underline mt-1 flex items-center gap-1 font-semibold"
                          title="Abrir WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                          <span>{ticket.formData.clientPhone}</span>
                        </a>
                        <a
                          href={`mailto:${ticket.formData.clientEmail}`}
                          className="font-mono text-neutral-500 hover:text-neutral-900 hover:underline truncate mt-0.5 flex items-center gap-1"
                          title="Enviar correo"
                        >
                          <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{ticket.formData.clientEmail}</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-5 bg-[#F5F2EB]/60 border-l-2 border-[#181B20] space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                        Idea descrita por el cliente
                      </span>
                      <p className="text-sm text-neutral-800 leading-relaxed">
                        &ldquo;{ticket.formData.themeAndDetails}&rdquo;
                      </p>
                    </div>

                    {/* Presupuesto y Notas */}
                    <div className="p-4 bg-white border border-black/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-4">
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
                            className="w-full pl-7 pr-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-8">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                          Notas Internas / Seguimiento de Nahomy (Privado)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Se acordó visita técnica el viernes a las 4pm, requiere andamio..."
                          value={ticket.adminNotes ?? ''}
                          onChange={(e) =>
                            onUpdateDetails(ticket.folio, {
                              adminNotes: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {/* WhatsApp Direct Action */}
                      <a
                        href={`https://wa.me/52${ticket.formData.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hola ${ticket.formData.clientName}! Te saluda Nahomy de Nahocraft Centro de Arte en Tampico 🎨 Te escribo respecto a tu solicitud de cotización (${ticket.folio}) para tu proyecto de ${ticket.formData.muralCategory || 'mural'} en ${ticket.formData.cityZone || 'Tampico'}. Me encantó tu idea y me gustaría platicar los detalles y medidas (${ticket.formData.dimensions}). ¿Cómo estás?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Mandar WhatsApp</span>
                      </a>

                      {/* Email Direct Action */}
                      <a
                        href={`mailto:${ticket.formData.clientEmail}?subject=${encodeURIComponent(
                          `Cotización de Mural ${ticket.folio} • Nahocraft Centro de Arte`
                        )}&body=${encodeURIComponent(
                          `Hola ${ticket.formData.clientName},\n\nGracias por comunicarte con Nahocraft Centro de Arte en Tampico. Recibí con mucho gusto tu solicitud para la cotización de tu mural (${ticket.folio}) en ${ticket.formData.cityZone || 'Tampico'}.\n\nMe encantaría afinar los detalles de tu espacio, medidas (${ticket.formData.dimensions}) y tu idea para prepararte una propuesta visual a la medida.\n\nQuedo a tus órdenes,\nNahomy • Nahocraft Centro de Arte\n+52 833 365 5622\nTampico, Tamaulipas`
                        )}`}
                        className="px-5 py-2.5 bg-[#181B20] hover:bg-naho-pink text-white text-[11px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Responder por Correo</span>
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    {ticket.formData.referenceImagePreview ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 block">
                          Referencia adjunta
                        </span>
                        <div
                          className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/[0.06] cursor-pointer group relative"
                          onClick={() => onSelectQuote?.(ticket)}
                        >
                          <img
                            src={ticket.formData.referenceImagePreview}
                            alt="Referencia del cliente"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider gap-1">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Ver detalle</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[140px] border border-dashed border-neutral-300 flex items-center justify-center p-4 text-center text-xs text-neutral-400">
                        Sin imagen de referencia adjunta
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
