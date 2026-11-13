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
          backgroundImage: 'url("/noise.webp")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          animation: 'cinematic-noise-shift 1.2s steps(4) infinite',
        }}
      />
    </div>
  );
};

