import React from 'react';
import { FooterLinkGroup, type FooterLink } from '@/components/ui/FooterLinkGroup';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

export interface SiteFooterProps {
  readonly className?: string;
}

const SERVICES_LINKS: readonly FooterLink[] = [
  { label: 'Website Development', href: '#services' },
  { label: 'Application Development', href: '#services' },
  { label: 'SEO Optimization', href: '#services' },
  { label: 'Meta Advertising', href: '#services' },
  { label: 'Creative Design & Video', href: '#services' },
];

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: 'About Hash.Devs', href: '#approach' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Start a Project', href: '#contact' },
];

export const SiteFooter: React.FC<SiteFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={cn(
        'w-full bg-[var(--brand-obsidian)] border-t border-white/[0.08] text-white',
        'pt-16 pb-12 px-5 sm:px-8 lg:px-12',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-6 space-y-4">
            <a
              href="/"
              className="inline-block font-semibold text-2xl tracking-tight text-[var(--brand-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
            >
              HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
            </a>
            <p className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
              Connected digital experiences that help businesses get discovered, communicate their value and convert visitors into customers.
            </p>
            <div className="pt-2">
              <StatusBadge
                status="active"
                label="Digital Experience Studio"
              />
            </div>
          </div>

          {/* Link Groups */}
          <div className="lg:col-span-3">
            <FooterLinkGroup
              title="Digital Services"
              links={SERVICES_LINKS}
            />
          </div>

          <div className="lg:col-span-3">
            <FooterLinkGroup
              title="Company & Contact"
              links={COMPANY_LINKS}
            />
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <p>© {currentYear} HASH.DEVS. All rights reserved.</p>
          <p className="tracking-widest uppercase">
            Build with purpose. Grow with clarity.
          </p>
        </div>
      </div>
    </footer>
  );
};

