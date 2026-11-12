import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Capture previously active element to restore focus upon closing
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // 2. Direct focus to the dialog close action once mounted
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // 3. Robust background isolation: capture exact original state of #root attributes before mutating
    const appRoot = document.getElementById('root');
    const hadInert = appRoot ? appRoot.hasAttribute('inert') : false;
    const originalInertValue = appRoot && hadInert ? appRoot.getAttribute('inert') : null;
    const originalAriaHidden = appRoot ? appRoot.getAttribute('aria-hidden') : null;

    if (appRoot) {
      appRoot.setAttribute('inert', '');
      appRoot.setAttribute('aria-hidden', 'true');
    }

    // 4. Trap keyboard focus inside modal & listen for Escape
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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);

      // Restore exact background attributes
      if (appRoot) {
        if (hadInert) {
          appRoot.setAttribute('inert', originalInertValue ?? '');
        } else {
          appRoot.removeAttribute('inert');
        }

        if (originalAriaHidden !== null) {
          appRoot.setAttribute('aria-hidden', originalAriaHidden);
        } else {
          appRoot.removeAttribute('aria-hidden');
        }
      }

      // Restore focus to triggering element
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  const modalContent = (
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

  return createPortal(modalContent, modalRoot);
};
