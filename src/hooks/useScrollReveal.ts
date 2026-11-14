import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/**
 * Universal helper to check if an element's bounding rect physically overlaps the window viewport
 * with an optional lookahead/safety buffer in pixels.
 */
function isElementInViewportBuffer(el: HTMLElement, buffer = 80): boolean {
  if (typeof window === 'undefined') return true;
  const rect = el.getBoundingClientRect();
  const innerHeight = window.innerHeight || document.documentElement.clientHeight || 800;
  return rect.bottom > -buffer && rect.top < innerHeight + buffer;
}

/**
 * Check if an element is genuinely far outside the viewport (hysteresis buffer)
 * to avoid premature reset or boundary flickering.
 */
function isElementFarOutsideViewport(el: HTMLElement, hysteresis = 200): boolean {
  if (typeof window === 'undefined') return false;
  const rect = el.getBoundingClientRect();
  const innerHeight = window.innerHeight || document.documentElement.clientHeight || 800;
  return rect.bottom < -hysteresis || rect.top > innerHeight + hysteresis;
}

/**
 * Centralized high-performance passive scroll & resize coordinator.
 * Throttles checks using a single requestAnimationFrame across all active reveal elements.
 * Guarantees exactly one active RAF loop and automatic cleanup when elements unmount.
 */
const activeChecks = new Set<() => void>();
let scrollRafId: number | null = null;
let isGlobalListenerAttached = false;

function triggerGlobalCheck() {
  if (scrollRafId !== null) return;
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null;
    activeChecks.forEach((check) => check());
  });
}

function registerGlobalCheck(checkFn: () => void): () => void {
  activeChecks.add(checkFn);
  if (!isGlobalListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('scroll', triggerGlobalCheck, { passive: true });
    window.addEventListener('resize', triggerGlobalCheck, { passive: true });
    window.addEventListener('hashdevs-viewport-check', triggerGlobalCheck);
    isGlobalListenerAttached = true;
  }
  return () => {
    activeChecks.delete(checkFn);
    if (activeChecks.size === 0 && isGlobalListenerAttached && typeof window !== 'undefined') {
      window.removeEventListener('scroll', triggerGlobalCheck);
      window.removeEventListener('resize', triggerGlobalCheck);
      window.removeEventListener('hashdevs-viewport-check', triggerGlobalCheck);
      isGlobalListenerAttached = false;
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId);
        scrollRafId = null;
      }
    }
  };
}

/**
 * Hook to trigger bidirectional visibility state when an element scrolls into/out of the viewport.
 * Automatically reverses when scrolling away and replays when re-entering.
 * Fully respects reduced-motion preferences and preserves keyboard accessibility.
 * Universal engine with zero section-specific hacks: applies uniform mathematical lookahead (+80px)
 * and hysteresis (-200px) across all sections from Hero to Footer.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.02,
    rootMargin = '80px 0px 80px 0px',
    once = false,
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(() => prefersReducedMotion);
  const elementRef = useRef<T | null>(null);
  const isVisibleRef = useRef<boolean>(isVisible);

  useEffect(() => {
    // If reduced motion is requested, immediately mark as visible
    if (prefersReducedMotion) {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    // State setter guarded by ref to avoid redundant React dispatch calls during scroll RAF
    const setVisibility = (next: boolean) => {
      if (isVisibleRef.current !== next) {
        isVisibleRef.current = next;
        setIsVisible(next);
      }
    };

    // Core universal visibility evaluation function
    const evaluateVisibility = () => {
      if (!element) return;

      // Enter condition: element physically intersects the viewport with 80px lookahead buffer
      if (isElementInViewportBuffer(element, 80)) {
        setVisibility(true);
      } else if (!once && isElementFarOutsideViewport(element, 200)) {
        // Exit condition: element is genuinely 200px far outside and body scroll is NOT locked
        const isBodyLocked = typeof document !== 'undefined' && document.body.style.overflow === 'hidden';
        if (!isBodyLocked) {
          setVisibility(false);
        }
      }
    };

    // 1. Initial check on mount
    evaluateVisibility();

    // 2. Register with centralized high-performance RAF scroll coordinator
    const unregisterScroll = registerGlobalCheck(evaluateVisibility);

    // 3. Fallback IntersectionObserver for standard browser integration
    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setVisibility(true);
              if (once && observer) {
                observer.unobserve(element);
                observer.disconnect();
                observer = null;
              }
            } else if (!once) {
              const isBodyLocked = typeof document !== 'undefined' && document.body.style.overflow === 'hidden';
              if (isBodyLocked) return;

              // Only reset if genuinely far outside
              if (isElementFarOutsideViewport(element, 200)) {
                setVisibility(false);
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
    }

    // 4. Guaranteed Safety Timeout Fallback:
    // Guarantees that any mounted element within or near the viewport reaches isVisible: true
    // Cancelled automatically if component unmounts before 1200ms
    const safetyTimer = setTimeout(() => {
      if (element && isElementInViewportBuffer(element, 120)) {
        setVisibility(true);
      }
    }, 1200);

    return () => {
      clearTimeout(safetyTimer);
      unregisterScroll();
      if (observer) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return { ref: elementRef, isVisible };
}
