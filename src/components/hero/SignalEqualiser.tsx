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
export const SignalEqualiser: React.FC<SignalEqualiserProps> = ({
  className,
  pointerX = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();
    let isReducedMotion = false;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || 600;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const renderFrame = (now: number) => {
      const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, width, height);

      const elapsed = isReducedMotion ? 1200 : (now - startTime) / 1000;

      // Equaliser Grid Geometry
      const dotSize = width < 640 ? 3 : 4;
      const gap = width < 640 ? 4 : 5;
      const colStep = dotSize + gap;
      const numCols = Math.floor(width / colStep);
      const startX = Math.floor((width - numCols * colStep) / 2);

      const maxDots = Math.floor((height * 0.72) / colStep);
      const horizonY = height - 16;

      for (let c = 0; c < numCols; c++) {
        const x = startX + c * colStep;
        const normCol = c / Math.max(numCols - 1, 1); // 0 to 1

        // Center envelope: Gaussian bell curve centered around 0.5 + subtle pointer bias
        const centerShift = 0.5 + pointerX * 0.08;
        const distFromCenter = Math.abs(normCol - centerShift) * 2;
        const bell = Math.exp(-distFromCenter * distFromCenter * 2.2);

        // Multi-frequency harmonic wave superposition
        const w1 = Math.sin(elapsed * 1.8 + c * 0.22) * 0.32;
        const w2 = Math.sin(elapsed * 0.95 - c * 0.14) * 0.24;
        const w3 = Math.cos(elapsed * 2.6 + c * 0.38) * 0.16;

        // Outward ripple radiating from center
        const ripple = Math.sin(elapsed * 2.8 - Math.abs(c - numCols / 2) * 0.32) * 0.22;

        // Combined height factor (0.05 to 1.0)
        const combined = Math.max(0.04, bell * (0.58 + w1 + w2 + w3 + ripple));
        const activeDots = Math.min(maxDots, Math.floor(combined * maxDots));

        // Edge fade factor
        const edgeFade = Math.sin(normCol * Math.PI); // 0 at edges, 1 at center

        const isLight =
          typeof document !== 'undefined' &&
          document.documentElement.getAttribute('data-theme') === 'light';

        for (let r = 0; r < activeDots; r++) {
          const y = horizonY - r * colStep;
          const heightRatio = r / Math.max(activeDots - 1, 1); // 0 (bottom) to 1 (top)

          let rVal = isLight ? 22 : 53;
          let gVal = isLight ? 139 : 232;
          let bVal = isLight ? 57 : 91;
          let alpha = Math.min(
            isLight ? 0.85 : 1,
            (1 - heightRatio * 0.75) * edgeFade * (isLight ? 0.85 : 0.9),
          );

          if (heightRatio > 0.6) {
            const peakRatio = (heightRatio - 0.6) / 0.4;
            if (isLight) {
              rVal = Math.floor(22 + (75 - 22) * peakRatio);
              gVal = Math.floor(139 + (85 - 139) * peakRatio);
              bVal = Math.floor(57 + (77 - 57) * peakRatio);
            } else {
              rVal = Math.floor(53 + (255 - 53) * peakRatio * 0.6);
              gVal = Math.floor(232 + (255 - 232) * peakRatio * 0.4);
              bVal = Math.floor(91 + (255 - 91) * peakRatio * 0.6);
            }
          }

          ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha.toFixed(3)})`;
          ctx.fillRect(Math.floor(x), Math.floor(y), dotSize, dotSize);
        }
      }

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [pointerX]);

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

