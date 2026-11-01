import { Store } from 'lucide-react';
import type { SiteGeneralConfig } from '../../../../types';

export interface HeroConfigFormProps {
  siteConfig: SiteGeneralConfig;
  onUpdateSiteConfig: (partial: Partial<SiteGeneralConfig>) => void;
}

export function HeroConfigForm({
  siteConfig,
  onUpdateSiteConfig,
}: HeroConfigFormProps) {
  return (
    <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-6">
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h3 className="font-serif text-xl text-neutral-900 font-normal">
            Textos de la Portada Principal & Contacto
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            El primer mensaje que ven tus visitantes al entrar a la web
          </p>
        </div>
        <Store className="w-5 h-5 text-naho-pink" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Insignia Superior del Hero (Badge)
          </label>
          <input
            type="text"
            value={siteConfig.heroBadge}
            onChange={(e) => onUpdateSiteConfig({ heroBadge: e.target.value })}
            className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Nombre Oficial del Estudio
          </label>
          <input
            type="text"
            value={siteConfig.studioName}
            onChange={(e) => onUpdateSiteConfig({ studioName: e.target.value })}
            className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Título Principal (Línea 1)
          </label>
          <input
            type="text"
            value={siteConfig.heroTitleLine1}
            onChange={(e) => onUpdateSiteConfig({ heroTitleLine1: e.target.value })}
            className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Título Destacado (Línea 2 con Gradiente)
          </label>
          <input
            type="text"
            value={siteConfig.heroTitleHighlight}
            onChange={(e) => onUpdateSiteConfig({ heroTitleHighlight: e.target.value })}
            className="w-full py-2.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
          Descripción del Hero
        </label>
        <textarea
          rows={2}
          value={siteConfig.heroDescription}
          onChange={(e) => onUpdateSiteConfig({ heroDescription: e.target.value })}
          className="w-full p-3 bg-[#F5F2EB]/50 border border-neutral-200 focus:border-naho-pink text-sm text-neutral-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-black/[0.06]">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Dirección del Taller en Tampico
          </label>
          <input
            type="text"
            value={siteConfig.studioAddress}
            onChange={(e) => onUpdateSiteConfig({ studioAddress: e.target.value })}
            className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Correo Electrónico de Contacto
          </label>
          <input
            type="email"
            value={siteConfig.adminEmail}
            onChange={(e) => onUpdateSiteConfig({ adminEmail: e.target.value })}
            className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Teléfono del Taller
          </label>
          <input
            type="text"
            value={siteConfig.studioPhone}
            onChange={(e) => onUpdateSiteConfig({ studioPhone: e.target.value })}
            className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
            WhatsApp (con código de país, ej. 528333655622)
          </label>
          <input
            type="text"
            value={siteConfig.studioWhatsapp}
            onChange={(e) => onUpdateSiteConfig({ studioWhatsapp: e.target.value })}
            className="w-full py-2 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="pt-4 border-t border-black/[0.06] space-y-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 block">
          Redes Sociales Oficiales
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-naho-pink block">
              Instagram
            </span>
            <input
              type="text"
              placeholder="@nahocraft"
              value={siteConfig.instagramHandle || ''}
              onChange={(e) => onUpdateSiteConfig({ instagramHandle: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
            />
            <input
              type="url"
              placeholder="https://instagram.com/nahocraft"
              value={siteConfig.instagramUrl || ''}
              onChange={(e) => onUpdateSiteConfig({ instagramUrl: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 block">
              TikTok
            </span>
            <input
              type="text"
              placeholder="@nahocraft"
              value={siteConfig.tiktokHandle || ''}
              onChange={(e) => onUpdateSiteConfig({ tiktokHandle: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
            />
            <input
              type="url"
              placeholder="https://tiktok.com/@nahocraft"
              value={siteConfig.tiktokUrl || ''}
              onChange={(e) => onUpdateSiteConfig({ tiktokUrl: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-naho-blue block">
              Facebook
            </span>
            <input
              type="text"
              placeholder="Nahocraft Centro de Arte"
              value={siteConfig.facebookHandle || ''}
              onChange={(e) => onUpdateSiteConfig({ facebookHandle: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
            />
            <input
              type="url"
              placeholder="https://facebook.com/nahocraft"
              value={siteConfig.facebookUrl || ''}
              onChange={(e) => onUpdateSiteConfig({ facebookUrl: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#F5F2EB]/50 border border-black/[0.05] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              YouTube
            </span>
            <input
              type="text"
              placeholder="Nahocraft Studio"
              value={siteConfig.youtubeHandle || ''}
              onChange={(e) => onUpdateSiteConfig({ youtubeHandle: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
            />
            <input
              type="url"
              placeholder="https://youtube.com/@nahocraft"
              value={siteConfig.youtubeUrl || ''}
              onChange={(e) => onUpdateSiteConfig({ youtubeUrl: e.target.value })}
              className="w-full py-1 px-2 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

