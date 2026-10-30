import { ExternalLink } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface SocialLinksProps {
  layout?: 'grid' | 'row';
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.35a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 1 0 6.34 6.34V8.41a8.28 8.28 0 0 0 4.84 1.55v-3.27h-.07z" />
    </svg>
  );
}

export function SocialLinks({ layout = 'grid' }: SocialLinksProps) {
  const { siteConfig } = useSiteData();

  const networks = [
    {
      name: 'Instagram',
      handle: siteConfig.instagramHandle || '@nahocraft',
      url:
        siteConfig.instagramUrl ||
        'https://www.instagram.com/nahocraft?igshid=NzZlODBkYWE4Ng%3D%3D&utm_source=qr',
      icon: InstagramIcon,
      description: 'Procesos de pintura en reels y fotos exclusivas',
    },
    {
      name: 'TikTok',
      handle: siteConfig.tiktokHandle || '@nahocraft1',
      url: siteConfig.tiktokUrl || 'https://www.tiktok.com/@nahocraft1',
      icon: TikTokIcon,
      description: 'Tutoriales rápidos, timelapses y detrás de cámaras',
    },
    {
      name: 'Facebook',
      handle: siteConfig.facebookHandle || 'Nahocraft Tampico',
      url: siteConfig.facebookUrl || 'https://www.facebook.com/nahocraft?mibextid=LQQJ4d',
      icon: FacebookIcon,
      description: 'Publicaciones de la comunidad, eventos y talleres',
    },
    {
      name: 'YouTube',
      handle: siteConfig.youtubeHandle || '@nahocraft',
      url: siteConfig.youtubeUrl || 'https://www.youtube.com/@nahocraft',
      icon: YoutubeIcon,
      description: 'Videos largos de proyectos murales y técnicas',
    },
  ].filter((net) => Boolean(net.url));

  if (layout === 'row') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {networks.map((net) => {
          const Icon = net.icon;
          return (
            <a
              key={net.name}
              href={net.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all hover:scale-105 active:scale-95"
              aria-label={`Seguir en ${net.name}`}
              title={`${net.name}: ${net.handle}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {networks.map((net) => {
        const Icon = net.icon;
        return (
          <a
            key={net.name}
            href={net.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-neutral-50/70 hover:bg-white border border-black/[0.04] hover:border-black/[0.08] shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-neutral-800 shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-[13px] leading-tight">
                    {net.name}
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {net.handle}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
            </div>
            <p className="text-[11px] text-neutral-500 mt-2.5 line-clamp-1">
              {net.description}
            </p>
          </a>
        );
      })}
    </div>
  );
}
