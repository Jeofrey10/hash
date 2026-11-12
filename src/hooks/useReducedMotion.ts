import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user has requested reduced motion.
 * Dynamically reacts to system preferences changes.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateMotionPreference);
      return () => {
        mediaQueryList.removeEventListener('change', updateMotionPreference);
      };
    } else {
      const legacyMql = mediaQueryList as unknown as {
        addListener?: (cb: (e: MediaQueryListEvent) => void) => void;
        removeListener?: (cb: (e: MediaQueryListEvent) => void) => void;
      };
      legacyMql.addListener?.(updateMotionPreference);
      return () => {
        legacyMql.removeListener?.(updateMotionPreference);
      };
    }
  }, []);

  return prefersReducedMotion;
}
