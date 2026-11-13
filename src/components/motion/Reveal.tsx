import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type RevealVariant = 'fade-up' | 'card' | 'fade-in' | 'slide-left' | 'slide-right' | 'editorial';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  staggerIndex?: number; // 1-based index for automated staggering (e.g. 1..5)
  staggerStep?: number; // ms per index, default 110ms
  as?: React.ElementType;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fade-up',
  delay,
  duration = 650,
  staggerIndex,
  staggerStep = 110,
  as: Component = 'div',
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
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

  // Calculate delay: staggerIndex takes precedence if provided
  const computedDelay =
    staggerIndex !== undefined ? (staggerIndex - 1) * staggerStep : (delay ?? 0);

  const getVariantInitialClasses = (v: RevealVariant) => {
    if (prefersReduced) return 'opacity-0';
    switch (v) {
      case 'fade-up':
        return 'opacity-0 translate-y-6';
      case 'card':
        // Card reveal: subtle upward movement with scale settling from 0.97 to 1, no bounce
        return 'opacity-0 translate-y-5 scale-[0.97]';
      case 'editorial':
        return 'opacity-0 translate-y-4';
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
      ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
      : getVariantInitialClasses(variant);

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-[opacity,transform]',
        !isVisible && 'will-change-[transform,opacity]',
        'focus-within:opacity-100 focus-within:transform-none',
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
