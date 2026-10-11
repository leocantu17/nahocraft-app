import { localAssets } from '../../assets';
import { SocialLinks } from '../studio/SocialLinks';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { MapPin, Phone, MessageCircle, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-gradient-to-r from-naho-pink/10 via-naho-blue/10 to-naho-orange/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={localAssets.logo}
                alt="Logo Nahocraft Centro de Arte"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-naho-pink/40"
              />
              <div>
                <span className="font-black text-2xl tracking-tight text-white block">
                  Nahocraft
                </span>
                <span className="text-xs uppercase tracking-widest text-naho-pink font-bold -mt-1 block">
                  Centro de Arte • Tampico
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Espacio artístico fundado por Nahomy dedicado al muralismo arquitectónico, intervención textil artesanal y creación de piezas de autor con identidad viva en Tampico, Tamaulipas.
            </p>

            <ScheduleStatusBadge className="bg-slate-900 text-slate-200 border-slate-800" />
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-naho-pink" />
              Navegación Rápida
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#galeria" className="hover:text-naho-pink transition-colors">
                  Galería de Obras Reales
                </a>
              </li>
              <li>
                <a href="#cotizador" className="hover:text-naho-pink transition-colors">
                  Cotizador Interactivo
                </a>
              </li>
              <li>
                <a href="#estudio" className="hover:text-naho-pink transition-colors">
                  Conoce el Taller
                </a>
              </li>
              <li>
                <a href="#horarios" className="hover:text-naho-pink transition-colors">
                  Horarios de Atención
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-naho-pink transition-colors">
                  Ubicación & Mapas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-naho-orange" />
              Contacto Directo
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-naho-pink shrink-0 mt-0.5" />
                <span>
                  Avenida Ayuntamiento 3 - 109, Minerva, 89120 Tampico, Tamps., México
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-naho-blue shrink-0" />
                <span>+52 833 365 5622</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/528333655622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Chat directo de WhatsApp
                </a>
              </p>
              <div className="pt-2">
                <SocialLinks layout="row" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Nahocraft - Centro de Arte. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
