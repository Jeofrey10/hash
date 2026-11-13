import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface HorizontalSlatRevealProps extends React.HTMLAttributes<HTMLElement> {
  readonly children: React.ReactNode;
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
  readonly slatCount?: number;
  readonly duration?: number; // ms
  readonly slatStagger?: number; // ms
  readonly delay?: number; // ms
  readonly threshold?: number;
  readonly rootMargin?: string;
  readonly once?: boolean;
  readonly slatBg?: string;
}

/**
 * HASH.DEVS Signature Horizontal Slat Mask Reveal.
 * Simulates a physical architectural shutter opening with staggered horizontal slats
 * and subtle vertical movement between adjacent slats. Fully bidirectional.
 */
export const HorizontalSlatReveal: React.FC<HorizontalSlatRevealProps> = ({
  children,
  as: Component = 'h2',
  slatCount = 6,
  duration = 900,
  slatStagger = 65,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  once = false,
  slatBg = 'bg-[var(--bg-primary)]',
  className,
  style,
  ...props
}) => {
  const prefersReduced = useReducedMotion();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  });

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn('relative block overflow-hidden', className)}
      style={style}
      {...props}
    >
      {/* Underlying Content with Subtle Upward Settling */}
      <div
        className={cn(
          'transition-all will-change-[transform,opacity]',
          prefersReduced
            ? 'opacity-100 transform-none transition-none'
            : isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        )}
        style={{
          transitionDuration: prefersReduced ? '0ms' : `${Math.round(duration * 0.55)}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: prefersReduced
            ? '0ms'
            : `${delay + Math.round(slatCount * slatStagger * 0.35)}ms`,
        }}
      >
        {children}
      </div>

      {/* Signature Architectural Horizontal Slat Mask Overlay */}
      {!prefersReduced && (
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10"
          aria-hidden="true"
        >
          {Array.from({ length: slatCount }).map((_, index) => {
            const isEven = index % 2 === 0;
            const slatDelay = delay + index * slatStagger;
            const slatHeight = 100 / slatCount;
            const slatTop = index * slatHeight;

            return (
              <div
                key={index}
                className={cn(
                  'absolute left-0 right-0',
                  slatBg,
                  'border-b border-[var(--border-subtle)]/40',
                  'transition-all will-change-transform'
                )}
                style={{
                  top: `${slatTop}%`,
                  height: `calc(${slatHeight}% + 1px)`,
                  transformOrigin: isEven ? 'right center' : 'left center',
                  transform: isVisible
                    ? isEven
                      ? 'scaleX(0) translateY(-2px)'
                      : 'scaleX(0) translateY(2px)'
                    : 'scaleX(1) translateY(0)',
                  transitionDuration: `${duration}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isVisible
                    ? `${slatDelay}ms`
                    : `${(slatCount - 1 - index) * Math.round(slatStagger * 0.5)}ms`,
                  opacity: isVisible ? 0 : 1,
                }}
              />
            );
          })}
        </div>
      )}
    </Component>
  );
};

