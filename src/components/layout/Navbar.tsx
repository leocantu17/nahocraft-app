import { useState, useEffect } from 'react';
import { localAssets } from '../../assets';
import { useSiteData } from '../../context/SiteDataContext';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { Menu, X, ArrowUpRight, Ticket } from 'lucide-react';

export function Navbar() {
  const { currentPath, navigateTo } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Cursos del Mes', href: '#cursos', hash: 'cursos' },
    { label: 'Murales', href: '#galeria', hash: 'galeria' },
    { label: 'Pedir Mural', href: '#cotizador', hash: 'cotizador' },
    { label: 'Sobre Mí', href: '#sobre-mi', hash: 'sobre-mi' },
    { label: 'El Taller & Clases', href: '#estudio', hash: 'estudio' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash?: string) => {
    if (currentPath !== '/' && currentPath !== '') {
      e.preventDefault();
      navigateTo('/', hash);
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (currentPath !== '/' && currentPath !== '') {
      e.preventDefault();
      navigateTo('/');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.03)] py-3'
          : 'bg-white/65 backdrop-blur-xl border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-naho-pink rounded-2xl p-1 transition-opacity hover:opacity-90"
          >
            <div className="relative">
              <img
                src={localAssets.logo}
                alt="Logo Nahocraft Centro de Arte"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm ring-1 ring-black/10 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] tracking-tight text-neutral-900 leading-none">
                Nahocraft
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase mt-1">
                Centro de Arte • Tampico
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-black/[0.04]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.hash)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-950 hover:bg-white rounded-full transition-all duration-200 hover:shadow-xs"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Status Badge & CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <ScheduleStatusBadge compact />
            <a
              href="#cursos"
              onClick={(e) => handleLinkClick(e, 'cursos')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold tracking-tight text-white bg-naho-pink hover:bg-rose-600 rounded-full transition-all duration-200 shadow-sm active:scale-95"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Cursos</span>
            </a>
            <a
              href="#cotizador"
              onClick={(e) => handleLinkClick(e, 'cotizador')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold tracking-tight text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all duration-200 shadow-sm active:scale-95"
            >
              <span>Cotizar Mural</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>

          {/* Mobile Status badge & Hamburger toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ScheduleStatusBadge compact />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-700 hover:bg-black/[0.05] rounded-full transition-colors focus:outline-none"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 p-4 border border-black/[0.06] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.hash)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-100 rounded-2xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-black/[0.06] grid grid-cols-2 gap-2">
                <a
                  href="#cursos"
                  onClick={(e) => handleLinkClick(e, 'cursos')}
                  className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-white bg-naho-pink hover:bg-rose-600 rounded-2xl shadow-sm"
                >
                  Ver Cursos
                </a>
                <a
                  href="#cotizador"
                  onClick={(e) => handleLinkClick(e, 'cotizador')}
                  className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-800 rounded-2xl shadow-sm"
                >
                  Pedir Mural
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
