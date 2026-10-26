import { localAssets } from '../../assets';
import { useSiteData } from '../../context/SiteDataContext';
import { SocialLinks } from '../studio/SocialLinks';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { MapPin, Phone, Sparkles, Mail, Lock } from 'lucide-react';

export function Footer() {
  const { siteConfig, navigateTo } = useSiteData();

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 relative overflow-hidden">
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
                  Centro de Arte • Tampico, Madero y Altamira
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Centro de Arte fundado por Nahomy en Tampico, Tamaulipas. Cursos mensuales de pintura en línea en vivo, clases presenciales para niños, adolescentes y adultos, y muralismo personalizado en Tampico, Ciudad Madero y Altamira.
            </p>

            <ScheduleStatusBadge className="bg-slate-900 text-slate-200 border-slate-800" />
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-naho-pink" />
              Secciones
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#cursos" className="hover:text-naho-pink transition-colors">
                  Cursos Mensuales Online
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-naho-pink transition-colors">
                  Galería de Murales por Categoría
                </a>
              </li>
              <li>
                <a href="#cotizador" className="hover:text-naho-pink transition-colors">
                  Cotizar Mural (Tampico, Madero y Altamira)
                </a>
              </li>
              <li>
                <a href="#sobre-mi" className="hover:text-naho-pink transition-colors">
                  Sobre Mí (Nahomy)
                </a>
              </li>
              <li>
                <a href="#estudio" className="hover:text-naho-pink transition-colors">
                  Taller Físico & Clases Presenciales
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
                <span>{siteConfig.studioAddress}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-naho-orange shrink-0" />
                <a
                  href={`mailto:${siteConfig.adminEmail}`}
                  className="hover:text-white transition-colors font-mono text-xs"
                >
                  {siteConfig.adminEmail}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-naho-blue shrink-0" />
                <span>{siteConfig.studioPhone}</span>
              </p>
              <div className="pt-2">
                <SocialLinks layout="row" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Discreet Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Nahocraft - Centro de Arte ({siteConfig.adminEmail}). Todos los derechos reservados.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/naho')}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Acceso Naho (/naho)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
