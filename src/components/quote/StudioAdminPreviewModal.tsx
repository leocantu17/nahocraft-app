import { useState } from 'react';
import { QuoteTicket, PreferredContactMethod } from '../../types';
import {
  X,
  Sparkles,
  Inbox,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';

interface StudioAdminPreviewModalProps {
  currentTicket: QuoteTicket;
  onClose: () => void;
}

export function StudioAdminPreviewModal({
  currentTicket,
  onClose,
}: StudioAdminPreviewModalProps) {
  const [ticketStatus, setTicketStatus] = useState<QuoteTicket['status']>(currentTicket.status);

  // Mock list of recent studio tickets to make the panel feel alive
  const sampleTickets: {
    folio: string;
    client: string;
    type: string;
    date: string;
    status: QuoteTicket['status'];
    contact: string;
  }[] = [
    {
      folio: currentTicket.folio,
      client: currentTicket.formData.clientName || 'Cliente Actual',
      type: currentTicket.formData.projectType.toUpperCase(),
      date: 'Hoy, Hace un momento',
      status: ticketStatus,
      contact: currentTicket.formData.preferredContact,
    },
    {
      folio: '#NC-2026-081',
      client: 'Restaurante El Puerto',
      type: 'MURAL',
      date: 'Ayer, 16:40',
      status: 'propuesta_enviada',
      contact: 'email',
    },
    {
      folio: '#NC-2026-079',
      client: 'Sofía Cantú',
      type: 'ROPA',
      date: '9 Oct 2026',
      status: 'aprobado',
      contact: 'whatsapp',
    },
  ];

  const getStatusBadge = (status: QuoteTicket['status']) => {
    switch (status) {
      case 'nuevo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3" />
            Nueva Solicitud
          </span>
        );
      case 'en_revision':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" />
            En Revisión en Taller
          </span>
        );
      case 'propuesta_enviada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
            <Send className="w-3 h-3" />
            Propuesta Enviada
          </span>
        );
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Aprobado para Iniciar
          </span>
        );
    }
  };

  const getContactBadge = (method: PreferredContactMethod) => {
    switch (method) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            Preferencia: WhatsApp
          </span>
        );
      case 'email':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
            <Mail className="w-3 h-3 text-blue-600" />
            Preferencia: Correo Electrónico
          </span>
        );
      case 'call':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 font-mono">
            <Phone className="w-3 h-3 text-purple-600" />
            Preferencia: Llamada Directa
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.45)] border border-black/[0.08] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Apple Studio Dashboard Header */}
        <div className="bg-neutral-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-naho-pink via-naho-orange to-naho-blue flex items-center justify-center text-white shadow-sm">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[15px] tracking-tight">
                  Panel de Estudio • Nahocraft
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-neutral-200">
                  Vista Previa de Producción
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Así gestionará Nahomy cada solicitud entrante enviada desde la web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Cerrar vista previa del panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Content Grid: Left sidebar (tickets list) + Right view (Ticket details) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
          {/* Left Column: Recent tickets list (4 cols) */}
          <div className="md:col-span-4 p-5 bg-neutral-50/70 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Bandeja de Proyectos
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                3 proyectos
              </span>
            </div>

            <div className="space-y-2.5">
              {sampleTickets.map((t, idx) => {
                const isSelected = idx === 0;
                return (
                  <div
                    key={t.folio}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/10'
                        : 'bg-white/60 border-black/[0.04] hover:bg-white text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-bold text-neutral-900">
                        {t.folio}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{t.date}</span>
                    </div>
                    <p className="font-extrabold text-[13px] text-neutral-900 leading-tight">
                      {t.client}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                        {t.type}
                      </span>
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notification sync status banner */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-neutral-900 font-bold text-xs">
                <Mail className="w-3.5 h-3.5 text-naho-pink" />
                <span>Rutas de Notificación:</span>
              </div>
              <ul className="text-[11px] text-neutral-500 space-y-1.5 leading-relaxed">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Correo oficial: <strong>nahomy@nahocraft.com</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Base de datos del estudio en tiempo real</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Notificación móvil push / webhook</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Active Ticket Inspector (8 cols) */}
          <div className="md:col-span-8 p-6 sm:p-8 bg-white overflow-y-auto space-y-6">
            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-black/[0.06]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-xl font-black text-neutral-900 tracking-tight">
                    {currentTicket.formData.clientName || 'Cliente sin nombre'}
                  </h4>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                    {currentTicket.folio}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Registrado el {currentTicket.createdAt}
                </p>
              </div>

              {/* Status Selector dropdown/buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">Estado:</span>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value as QuoteTicket['status'])}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-black/[0.1] bg-neutral-50 text-neutral-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="propuesta_enviada">Propuesta Enviada</option>
                  <option value="aprobado">Aprobado</option>
                </select>
              </div>
            </div>

            {/* Client Contact Details Box */}
            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Correo Electrónico
                </span>
                <a
                  href={`mailto:${currentTicket.formData.clientEmail}`}
                  className="font-bold text-neutral-900 hover:text-naho-pink hover:underline break-all mt-1 block"
                >
                  {currentTicket.formData.clientEmail || 'No especificado'}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Teléfono / WhatsApp
                </span>
                <a
                  href={`tel:${currentTicket.formData.clientPhone}`}
                  className="font-bold text-neutral-900 hover:text-naho-pink hover:underline font-mono mt-1 block"
                >
                  {currentTicket.formData.clientPhone || 'No especificado'}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Canal de Contacto
                </span>
                <div className="mt-1">
                  {getContactBadge(currentTicket.formData.preferredContact)}
                </div>
              </div>
            </div>

            {/* Project Technical Specifications */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-naho-pink" />
                Especificaciones Artísticas de la Obra
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-black/[0.05] bg-white">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Disciplina
                  </span>
                  <p className="font-extrabold text-neutral-900 text-[13px] mt-0.5">
                    {currentTicket.formData.projectType.toUpperCase()}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-black/[0.05] bg-white">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Formato & Medidas
                  </span>
                  <p className="font-semibold text-neutral-800 text-[13px] mt-0.5">
                    {currentTicket.formData.dimensions}
                    {currentTicket.formData.customDimensions && (
                      <span className="block text-[11px] text-neutral-500 font-mono">
                        ({currentTicket.formData.customDimensions})
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-black/[0.05] bg-white">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Soporte / Superficie
                  </span>
                  <p className="font-semibold text-neutral-800 mt-0.5">
                    {currentTicket.formData.surfaceOrMaterial || 'Por coordinar'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-black/[0.05] bg-white">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Paleta o Vibra Cromática
                  </span>
                  <p className="font-semibold text-neutral-800 mt-0.5">
                    {currentTicket.formData.colorPalette || 'Elección libre por Nahomy'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-black/[0.05] bg-white sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Ubicación / Zona
                  </span>
                  <p className="font-semibold text-neutral-800 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {currentTicket.formData.clientLocation || 'Tampico, Tamps.'}
                  </p>
                </div>
              </div>

              {/* Concept description */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05]">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-1">
                  Idea / Visión del Cliente:
                </span>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium italic">
                  "{currentTicket.formData.themeAndDetails || 'Sin detalles especificados'}"
                </p>
              </div>

              {/* Attached Reference Image (if any) */}
              {currentTicket.formData.referenceImagePreview && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-2">
                    Foto de Referencia Adjunta por el Cliente:
                  </span>
                  <div className="flex items-center gap-4">
                    <img
                      src={currentTicket.formData.referenceImagePreview}
                      alt="Referencia de obra"
                      className="w-24 h-24 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-neutral-900">
                        {currentTicket.formData.referenceImageName || 'Imagen adjunta'}
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5 leading-relaxed">
                        Nahomy puede inspeccionar esta imagen para estimar horas de pintado, capas y materiales requeridos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Artist Actions for Nahomy */}
            <div className="pt-4 border-t border-black/[0.06] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono block">
                Acciones de Nahomy para este Proyecto:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={`mailto:${currentTicket.formData.clientEmail}?subject=Presupuesto%20Nahocraft%20-${encodeURIComponent(
                    currentTicket.folio
                  )}`}
                  className="py-3 px-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Enviar Presupuesto</span>
                </a>

                <a
                  href={`https://wa.me/52${currentTicket.formData.clientPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                    currentTicket.formData.clientName
                  )}%2C%20soy%20Nahomy%20de%20Nahocraft.%20Recib%C3%AD%20tu%20solicitud%20${currentTicket.folio}...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>Chat en WhatsApp</span>
                </a>

                <a
                  href={`tel:${currentTicket.formData.clientPhone}`}
                  className="py-3 px-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Llamar al Cliente</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-neutral-50 px-6 sm:px-8 py-3.5 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-neutral-500">
          <span>
            Nahocraft Studio Management System • Tampico, Tamaulipas
          </span>
          <button
            onClick={onClose}
            className="text-neutral-900 font-bold hover:underline cursor-pointer"
          >
            Entendido, volver a la web
          </button>
        </div>
      </div>
    </div>
  );
}
