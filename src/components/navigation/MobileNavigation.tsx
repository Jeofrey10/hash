import React, { useEffect } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/components/navigation/Navigation';

export interface MobileNavigationProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly items: readonly NavItem[];
  readonly ctaText: string;
  readonly onCtaClick?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  items,
  ctaText,
  onCtaClick,
}) => {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className={cn(
        'fixed inset-0 z-[150] lg:hidden',
        'bg-[var(--brand-obsidian)]/95 backdrop-blur-xl',
        'flex flex-col justify-between p-6 sm:p-8',
        'animate-in fade-in duration-200',
      )}
    >
      {/* Top Header inside Drawer */}
      <div className="flex items-center justify-between">
        <a
          href="/"
          onClick={onClose}
          className="font-semibold text-xl tracking-tight text-[var(--brand-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
        >
          HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-6 my-auto py-8" aria-label="Mobile Navigation Links">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={onClose}
            className="text-2xl font-medium text-white/90 hover:text-[var(--brand-neon-green)] transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom CTA & Meta */}
      <div className="space-y-4 pt-6 border-t border-white/[0.08]">
        <PrimaryButton
          fullWidth
          size="lg"
          onClick={() => {
            onClose();
            onCtaClick?.();
          }}
        >
          {ctaText}
        </PrimaryButton>
        <p className="text-xs text-center font-mono text-white/40 uppercase tracking-widest">
          Build with purpose. Grow with clarity.
        </p>
      </div>
    </div>
  );
};
