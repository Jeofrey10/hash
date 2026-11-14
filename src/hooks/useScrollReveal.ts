import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/**
 * Universal helper to check if an element's bounding rect physically overlaps the window viewport.
 */
function isElementPhysicallyInViewport(el: HTMLElement): boolean {
  if (typeof window === 'undefined') return true;
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

/**
 * Hook to trigger bidirectional visibility state when an element scrolls into/out of the viewport.
 * Automatically reverses when scrolling away and replays when re-entering.
 * Fully respects reduced-motion preferences and preserves keyboard accessibility.
 * Robust against body scroll locking (e.g. mobile navigation drawers or modals) and theme transitions.
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

    // 1. Check immediate physical visibility on mount or layout change
    let rafMountId: number | null = requestAnimationFrame(() => {
      if (!element) return;
      if (isElementPhysicallyInViewport(element)) {
        setIsVisible(true);
        if (once && observer) {
          observer.unobserve(element);
          observer.disconnect();
          observer = null;
        }
      }
    });

    // 2. IntersectionObserver for bidirectional reveals
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
            // Guard against false non-intersections:
            // a) If body scroll is locked (e.g. mobile drawer/modal open), do NOT falsely hide underlying elements.
            const isBodyLocked = typeof document !== 'undefined' && document.body.style.overflow === 'hidden';
            if (isBodyLocked) {
              return;
            }

            // b) If the element is still physically within viewport bounds, do NOT hide it.
            const inViewport = isElementPhysicallyInViewport(element);
            if (!inViewport) {
              setIsVisible(false);
            }
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // 3. Global viewport sync listener (for drawer close, modal close, theme changes, or window resizes)
    const handleRecheck = () => {
      if (!element) return;
      if (isElementPhysicallyInViewport(element)) {
        setIsVisible(true);
      }
    };

    window.addEventListener('resize', handleRecheck, { passive: true });
    window.addEventListener('hashdevs-viewport-check', handleRecheck);

    return () => {
      if (rafMountId) cancelAnimationFrame(rafMountId);
      window.removeEventListener('resize', handleRecheck);
      window.removeEventListener('hashdevs-viewport-check', handleRecheck);
      if (observer) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return { ref: elementRef, isVisible };
}
