import React from 'react';
import { cn } from '@/lib/utils';

export interface CinematicNoiseProps {
  readonly className?: string;
  readonly opacity?: number;
}

/**
 * Cinematic Monochromatic Noise Overlay
 * Generates an ultra-lightweight, high-fidelity film grain texture
 * across the hero environment with an organic, subtle stepped position shift.
 */
export const CinematicNoise: React.FC<CinematicNoiseProps> = ({
  className,
  opacity = 0.07,
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="absolute -inset-[50%] w-[200%] h-[200%] will-change-transform motion-reduce:animate-none"
        style={{
          opacity: opacity ?? 'var(--noise-opacity, 0.075)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
          animation: 'cinematic-noise-shift 1.2s steps(4) infinite',
        }}
      />
    </div>
  );
};

