import React from 'react';
import { SiteHeader } from '@/layouts/SiteHeader';
import { SiteFooter } from '@/layouts/SiteFooter';
import { cn } from '@/lib/utils';

export interface SiteLayoutProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  children,
  className,
  onCtaClick,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-obsidian)] text-[var(--brand-pure-white)] antialiased selection:bg-[var(--brand-neon-green)] selection:text-[var(--brand-obsidian)]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[200] px-4 py-2 rounded-lg bg-[var(--brand-neon-green)] text-[var(--brand-obsidian)] font-medium text-sm shadow-lg outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* Persistent Global Header */}
      <SiteHeader onCtaClick={onCtaClick} />

      {/* Main Content Region — Ready to receive sections in Stage 05 */}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn('flex-1 flex flex-col w-full outline-none pt-[74px]', className)}
      >
        {children}
      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
};

