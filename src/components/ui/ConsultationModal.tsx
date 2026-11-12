import React, { useEffect, useRef } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { cn } from '@/lib/utils';

export interface ConsultationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly serviceTitle?: string | null;
  readonly className?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Save previous focus target to restore upon closing dialog
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // 2. Direct focus to the dialog close action
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // 3. Trap keyboard focus inside modal & listen for Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
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

    // 4. Mark background content aria-hidden while dialog is open
    const mainEl = document.querySelector('main');
    const headerEl = document.querySelector('header');
    const footerEl = document.querySelector('footer');

    if (mainEl) mainEl.setAttribute('aria-hidden', 'true');
    if (headerEl) headerEl.setAttribute('aria-hidden', 'true');
    if (footerEl) footerEl.setAttribute('aria-hidden', 'true');

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);

      if (mainEl) mainEl.removeAttribute('aria-hidden');
      if (headerEl) headerEl.removeAttribute('aria-hidden');
      if (footerEl) footerEl.removeAttribute('aria-hidden');

      // Restore focus to triggering element
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project Consultation Inbound"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <GlassPanel
        ref={dialogRef}
        variant="elevated"
        padding="lg"
        rounded="2xl"
        className={cn(
          'max-w-md w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200 relative',
          className,
        )}
      >
        {/* Top-Right Dismiss Icon Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close consultation dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <StatusBadge
          status="active"
          label={serviceTitle ? `Inquiry // ${serviceTitle}` : 'Inbound Channel Active'}
        />

        <div className="space-y-2">
          <h3 id="consultation-dialog-title" className="text-2xl font-semibold text-white">
            {serviceTitle ? `Inquire: ${serviceTitle}` : 'Start a Project'}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {serviceTitle
              ? `You selected ${serviceTitle}. The full dedicated interactive contact section will be connected in upcoming stages.`
              : 'Hero and Services sections are active. The full dedicated interactive contact section will be connected in upcoming stages.'}
          </p>
        </div>

        <PrimaryButton
          ref={closeButtonRef as unknown as React.Ref<HTMLButtonElement>}
          fullWidth
          onClick={onClose}
        >
          Close Dialog
        </PrimaryButton>
      </GlassPanel>
    </div>
  );
};
