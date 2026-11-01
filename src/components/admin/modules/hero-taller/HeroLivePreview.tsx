import {
  Sparkles,
  Store,
  MapPin,
  MessageCircle,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { localAssets } from '../../../../assets';
import type { SiteGeneralConfig } from '../../../../types';

export interface HeroLivePreviewProps {
  siteConfig: SiteGeneralConfig;
}

export function HeroLivePreview({ siteConfig }: HeroLivePreviewProps) {
  return (
    <div className="xl:col-span-5 xl:sticky xl:top-28 space-y-6">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 px-1">
        <span className="flex items-center gap-1.5 text-naho-pink">
          <Sparkles className="w-3.5 h-3.5" />
          Vista Previa de la Portada en Vivo
        </span>
        <span className="text-[10px] text-neutral-400">Hero Section</span>
      </div>

      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-xl space-y-5 overflow-hidden relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/[0.04] text-neutral-700 border border-black/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-naho-pink animate-ping" />
          {siteConfig.heroBadge}
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight">
            {siteConfig.heroTitleLine1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naho-pink via-naho-orange to-naho-yellow">
              {siteConfig.heroTitleHighlight}
            </span>
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
          {siteConfig.heroDescription}
        </p>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span>Ver Cursos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
          </div>
          <div className="px-4 py-2 rounded-full bg-white text-neutral-800 text-xs font-semibold border border-black/10 shadow-2xs">
            Cotizar Mural
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-black/[0.05] shadow-sm flex items-center gap-3">
          <img
            src={localAssets.murales.dulceria}
            alt="Mural Preview"
            className="w-14 h-12 rounded-lg object-cover border border-black/5"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-naho-pink block">
              Muralismo a Medida
            </span>
            <p className="text-xs font-bold text-neutral-900">
              Tampico, Cd. Madero & Altamira
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <Store className="w-4 h-4 text-naho-pink" />
            <span>{siteConfig.studioName}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Horarios Activos
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5 text-neutral-700">
            <MapPin className="w-4 h-4 text-naho-pink shrink-0 mt-0.5" />
            <span className="leading-snug">{siteConfig.studioAddress}</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
            <span className="font-mono">{siteConfig.studioPhone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-700">
            <Mail className="w-4 h-4 text-naho-blue shrink-0" />
            <span className="font-mono text-neutral-500">{siteConfig.adminEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

