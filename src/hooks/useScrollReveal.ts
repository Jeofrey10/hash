import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook to trigger bidirectional visibility state when an element scrolls into/out of the viewport.
 * Automatically reverses when scrolling away and replays when re-entering.
 * Fully respects reduced-motion preferences and preserves keyboard accessibility.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    once = false,
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(() => prefersReducedMotion);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    // If reduced motion is requested, immediately mark as visible
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Fallback if IntersectionObserver is unsupported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    // Check immediate visibility on mount (e.g. Hero section or hash navigation)
    // Run inside requestAnimationFrame to batch layout reads and avoid forced synchronous layout
    let rafMountId: number | null = requestAnimationFrame(() => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const isCurrentlyInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isCurrentlyInViewport) {
        setIsVisible(true);
        if (once && observer) {
          observer.unobserve(element);
          observer.disconnect();
          observer = null;
        }
      }
    });

    let observer: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && observer) {
              observer.unobserve(element);
              observer.disconnect();
              observer = null;
            }
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (rafMountId) cancelAnimationFrame(rafMountId);
      if (observer) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return { ref: elementRef, isVisible };
}
