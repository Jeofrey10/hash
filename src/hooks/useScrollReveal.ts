import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  fallbackTimeout?: number;
}

/**
 * Hook to trigger visibility state when an element scrolls into the viewport.
 * Automatically respects reduced-motion preferences and provides fallback handling.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    fallbackTimeout = 2000,
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

    // Guaranteed fallback: never leave content permanently hidden
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, fallbackTimeout);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin, once, prefersReducedMotion, fallbackTimeout]);

  return { ref: elementRef, isVisible };
}
