import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface SignalEqualiserProps {
  readonly className?: string;
  readonly pointerX?: number; // Normalized -1 to 1
}

/**
 * Pixel-Dot Signal Equaliser
 * High-performance canvas-based data signal equaliser featuring
 * multi-harmonic wave oscillations, outward ripple from central core,
 * and integer-aligned square pixel rendering.
 */
// Pre-allocated RGBA color cache to eliminate runtime string allocations and garbage collection pauses
const COLOR_CACHE = new Map<string, string>();
function getCachedRgba(r: number, g: number, b: number, a: number): string {
  const aBucket = Math.round(a * 20) / 20; // 20 discrete alpha buckets (0.05 steps)
  const key = `${r},${g},${b},${aBucket}`;
  let color = COLOR_CACHE.get(key);
  if (!color) {
    color = `rgba(${r}, ${g}, ${b}, ${aBucket})`;
    COLOR_CACHE.set(key, color);
  }
  return color;
}

export const SignalEqualiser: React.FC<SignalEqualiserProps> = ({
  className,
  pointerX = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerXRef = useRef(pointerX);

  // Keep pointerX in a ref so pointer motion doesn't tear down and reconstruct the rAF loop
  useEffect(() => {
    pointerXRef.current = pointerX;
  }, [pointerX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isReducedMotion = false;
    let isVisible = true;
    let isTabVisible = true;
    let lastRenderTime = 0;
    let isScrolling = false;
    let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

    // Mobile scroll listener: when user actively scrolls, throttle canvas to free up main thread
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let currentWidth = 0;
    let currentHeight = 0;
    let currentDpr = 1;

    const resize = () => {
      // Cap DPR at 1.25 on mobile to save GPU cycles and battery, max 2 on desktop
      const isMobile = window.innerWidth < 768;
      currentDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
      currentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      currentHeight = canvas.parentElement?.clientHeight || 600;

      canvas.width = Math.floor(currentWidth * currentDpr);
      canvas.height = Math.floor(currentHeight * currentDpr);
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(currentDpr, currentDpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // IntersectionObserver to pause when hero is scrolled out of viewport
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId && !isReducedMotion) {
              animationFrameId = requestAnimationFrame(renderFrame);
            }
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(canvas);
    }

    // Page visibility listener to pause when user switches browser tabs
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible && isVisible && !animationFrameId && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cache theme check to avoid reading DOM attributes on every frame
    let cachedIsLight = document.documentElement.getAttribute('data-theme') === 'light';
    const themeObserver = new MutationObserver(() => {
      cachedIsLight = document.documentElement.getAttribute('data-theme') === 'light';
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const renderFrame = (now: number) => {
      animationFrameId = null;

      // Stop loop if hero is off-screen, tab is hidden, or scrolled past
      if (!isVisible || !isTabVisible || window.scrollY > currentHeight + 80) {
        return;
      }

      // Frame interval throttle: 30fps during mobile scrolling, ~60fps normally
      const minInterval = isMobileDevice && isScrolling ? 32 : 16;
      if (now - lastRenderTime < minInterval) {
        if (!isReducedMotion) {
          animationFrameId = requestAnimationFrame(renderFrame);
        }
        return;
      }
      lastRenderTime = now;

      const width = currentWidth;
      const height = currentHeight;

      ctx.clearRect(0, 0, width, height);

      const elapsed = isReducedMotion ? 1.2 : now * 0.001;

      // Equaliser Grid Geometry
      const dotSize = width < 640 ? 3 : 4;
      const gap = width < 640 ? 5 : 5;
      const colStep = dotSize + gap;
      const numCols = Math.floor(width / colStep);
      const startX = Math.floor((width - numCols * colStep) / 2);

      const maxDots = Math.floor((height * 0.72) / colStep);
      const horizonY = height - 16;
      const currentPointerX = pointerXRef.current;

      const isLight = cachedIsLight;
      const baseR = isLight ? 22 : 53;
      const baseG = isLight ? 139 : 232;
      const baseB = isLight ? 57 : 91;

      for (let c = 0; c < numCols; c++) {
        const x = startX + c * colStep;
        const normCol = c / Math.max(numCols - 1, 1);

        // Center envelope: Gaussian bell curve centered around 0.5 + subtle pointer bias
        const centerShift = 0.5 + currentPointerX * 0.08;
        const distFromCenter = Math.abs(normCol - centerShift) * 2;
        const bell = Math.exp(-distFromCenter * distFromCenter * 2.2);

        // Multi-frequency harmonic wave superposition
        const w1 = Math.sin(elapsed * 1.8 + c * 0.22) * 0.32;
        const w2 = Math.sin(elapsed * 0.95 - c * 0.14) * 0.24;
        const w3 = Math.cos(elapsed * 2.6 + c * 0.38) * 0.16;
        const ripple = Math.sin(elapsed * 2.8 - Math.abs(c - numCols / 2) * 0.32) * 0.22;

        const combined = Math.max(0.04, bell * (0.58 + w1 + w2 + w3 + ripple));
        const activeDots = Math.min(maxDots, Math.floor(combined * maxDots));
        const edgeFade = Math.sin(normCol * Math.PI);

        for (let r = 0; r < activeDots; r++) {
          const y = horizonY - r * colStep;
          const heightRatio = r / Math.max(activeDots - 1, 1);

          let rVal = baseR;
          let gVal = baseG;
          let bVal = baseB;
          const alpha = Math.min(
            isLight ? 0.85 : 1,
            (1 - heightRatio * 0.75) * edgeFade * (isLight ? 0.85 : 0.9),
          );

          if (heightRatio > 0.6) {
            const peakRatio = (heightRatio - 0.6) * 2.5;
            if (isLight) {
              rVal = Math.floor(22 + 53 * peakRatio);
              gVal = Math.floor(139 - 54 * peakRatio);
              bVal = Math.floor(57 + 20 * peakRatio);
            } else {
              rVal = Math.floor(53 + 121.2 * peakRatio);
              gVal = Math.floor(232 + 9.2 * peakRatio);
              bVal = Math.floor(91 + 98.4 * peakRatio);
            }
          }

          ctx.fillStyle = getCachedRgba(rVal, gVal, bVal, alpha);
          ctx.fillRect(Math.floor(x), Math.floor(y), dotSize, dotSize);
        }
      }

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intersectionObserver) intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 pointer-events-none select-none w-full h-full z-[2]',
        className,
      )}
      aria-hidden="true"
    />
  );
};

