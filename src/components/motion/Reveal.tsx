import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type RevealVariant = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  staggerIndex?: number; // 1-based index for automated staggering (e.g. 1..5)
  as?: React.ElementType;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fade-up',
  delay,
  duration = 600,
  staggerIndex,
  as: Component = 'div',
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  once = true,
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

  // Calculate delay: staggerIndex takes precedence if provided (100ms per index)
  const computedDelay = staggerIndex !== undefined ? (staggerIndex - 1) * 100 : (delay ?? 0);

  const getVariantInitialClasses = (v: RevealVariant) => {
    if (prefersReduced) return 'opacity-0';
    switch (v) {
      case 'fade-up':
        return 'opacity-0 translate-y-6';
      case 'fade-in':
        return 'opacity-0';
      case 'slide-left':
        return 'opacity-0 -translate-x-6';
      case 'slide-right':
        return 'opacity-0 translate-x-6';
      default:
        return 'opacity-0 translate-y-6';
    }
  };

  const activeClasses = prefersReduced
    ? 'opacity-100 transform-none transition-none'
    : isVisible
    ? 'opacity-100 translate-x-0 translate-y-0'
    : getVariantInitialClasses(variant);

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-all will-change-[transform,opacity]',
        activeClasses,
        className
      )}
      style={{
        transitionDuration: prefersReduced ? '0ms' : `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: prefersReduced ? '0ms' : `${computedDelay}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

