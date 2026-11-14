import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface TextRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Component = 'h2',
  delay = 0,
  duration = 500,
  threshold = 0.02,
  rootMargin = '80px 0px 80px 0px',
  once = false,
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

  const accessibleLabel = typeof children === 'string' ? children : undefined;

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      aria-label={accessibleLabel}
      className={cn('block focus-within:opacity-100', className)}
      style={style}
      {...props}
    >
      <span className="block overflow-hidden pb-[0.08em]">
        <span
          className={cn(
            'block transition-[opacity,transform]',
            !isVisible && 'will-change-[transform,opacity]',
            prefersReduced
              ? 'opacity-100 transform-none transition-none'
              : isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-full'
          )}
          style={{
            transitionDuration: prefersReduced ? '0ms' : `${duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: prefersReduced ? '0ms' : `${delay}ms`,
          }}
        >
          {children}
        </span>
      </span>
    </Component>
  );
};
