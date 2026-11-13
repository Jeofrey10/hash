import React from 'react';
import { FooterLinkGroup, type FooterLink } from '@/components/ui/FooterLinkGroup';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HashFullLogo } from '@/components/ui/HashFullLogo';
import { Reveal } from '@/components/motion';
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
        'w-full bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] text-[var(--text-primary)]',
        'pt-16 pb-12 px-5 sm:px-8 lg:px-12',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <Reveal variant="fade-up" delay={50} className="lg:col-span-6 space-y-4">
            <a
              href="/"
              aria-label="HASH.DEVS Homepage"
              className="inline-flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
            >
              <HashFullLogo
                className="h-8 w-auto text-[var(--text-primary)]"
                aria-hidden="true"
              />
              <span className="sr-only">HASH.DEVS</span>
            </a>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md leading-relaxed">
              Connected digital experiences that help businesses get discovered, communicate their value and convert visitors into customers.
            </p>
            <div className="pt-2">
              <StatusBadge
                status="active"
                label="Digital Experience Studio"
              />
            </div>
          </Reveal>

          {/* Link Groups */}
          <Reveal variant="fade-up" delay={140} className="lg:col-span-3">
            <FooterLinkGroup
              title="Digital Services"
              links={SERVICES_LINKS}
            />
          </Reveal>

          <Reveal variant="fade-up" delay={220} className="lg:col-span-3">
            <FooterLinkGroup
              title="Company & Contact"
              links={COMPANY_LINKS}
            />
          </Reveal>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <Reveal variant="fade-in" delay={280}>
          <div className="pt-8 border-t border-[var(--divider-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
            <p>© {currentYear} HASH.DEVS. All rights reserved.</p>
            <p className="tracking-widest uppercase">
              Build with purpose. Grow with clarity.
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

