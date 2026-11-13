import React, { useEffect, useRef } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/components/navigation/Navigation';

export interface MobileNavigationProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly items: readonly NavItem[];
  readonly ctaText: string;
  readonly onCtaClick?: () => void;
  readonly triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  items,
  ctaText,
  onCtaClick,
  triggerRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus close button on open
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle Escape key and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className={cn(
        'fixed inset-0 z-[150] lg:hidden',
        'bg-[var(--bg-primary)]/96 backdrop-blur-2xl',
        'flex flex-col justify-between p-6 sm:p-8',
        'animate-drawer-slide text-[var(--text-primary)]',
      )}
    >
      {/* Top Header inside Drawer */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
        <a
          href="/"
          onClick={() => {
            onClose();
            triggerRef?.current?.focus();
          }}
          className="font-semibold text-xl tracking-tight text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
        >
          HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
        </a>
        <div className="flex items-center gap-2">
          <ThemeSwitcher id="drawer-theme-switcher" size="md" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => {
              onClose();
              triggerRef?.current?.focus();
            }}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--tag-bg)] border border-[var(--border-medium)] text-[var(--text-primary)] hover:border-[var(--border-active)] hover:bg-[var(--state-hover-glass)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Middle Navigation Links */}
      <nav className="flex flex-col space-y-3 my-auto py-6" aria-label="Mobile Navigation Links">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={() => {
              onClose();
            }}
            className="group flex items-baseline justify-between py-3 border-b border-[var(--border-subtle)] text-2xl sm:text-3xl font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded px-2"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-accent)] font-semibold">
                0{idx + 1} //
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </span>
            </div>
            <span
              className="font-mono text-sm text-[var(--text-muted)] group-hover:text-[var(--text-accent)] group-hover:translate-x-0.5 transition-all duration-200"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        ))}
      </nav>

      {/* Bottom CTA & Meta */}
      <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
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
        <p className="text-xs text-center font-mono text-[var(--text-muted)] uppercase tracking-widest">
          Build with purpose. Grow with clarity.
        </p>
      </div>
    </div>
  );
};
