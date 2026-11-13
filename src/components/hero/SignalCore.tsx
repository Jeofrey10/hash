import React from 'react';
import { cn } from '@/lib/utils';
import { HashSymbol } from '@/components/hero/HashSymbol';

export interface SignalCoreProps {
  readonly className?: string;
  readonly pointerOffset?: { x: number; y: number };
}

/**
 * Hash Signal Core
 * Precision-engineered geometric signal sculpture representing the nexus
 * of digital engineering, design systems, and creative technology.
 */
export const SignalCore: React.FC<SignalCoreProps> = ({
  className,
  pointerOffset = { x: 0, y: 0 },
}) => {
  // Controlled 3D parallax tilt (max 10 degrees)
  const tiltX = -pointerOffset.y * 12;
  const tiltY = pointerOffset.x * 12;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none pointer-events-none',
        'w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]',
        className,
      )}
      style={{
        perspective: '1000px',
      }}
      aria-hidden="true"
    >
      {/* 3D Tilted Gimbal Container */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Core Ambient Emerald Corona */}
        <div
          className="absolute inset-0 rounded-full blur-[80px] opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(53, 232, 91, 0.45) 0%, rgba(23, 26, 24, 0.2) 60%, transparent 80%)',
          }}
        />

        {/* 1. Outer Precision Instrumentation Ring */}
        <div
          className="absolute inset-4 sm:inset-6 rounded-full border border-white/[0.09] motion-reduce:animate-none"
          style={{
            animation: 'spin-slower 40s linear infinite',
          }}
        >
          {/* Degree Ticks at 4 cardinal points */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />

          {/* Orbital Satellite Node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-neon-green)] shadow-[0_0_12px_rgba(53,232,91,0.9)]" />
            <span className="absolute w-4 h-4 rounded-full border border-[var(--brand-neon-green)]/40 animate-ping" />
          </div>
        </div>

        {/* 2. Secondary Reverse-Rotating Segmented Tech Arc */}
        <div
          className="absolute inset-10 sm:inset-14 rounded-full border-2 border-dashed border-[var(--brand-neon-green)]/20 motion-reduce:animate-none"
          style={{
            animation: 'spin-reverse-slower 30s linear infinite',
          }}
        >
          {/* Accent Arc Node */}
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-[var(--brand-neon-green)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--brand-neon-green)]">
              SIG // 84.6%
            </span>
          </div>
        </div>

        {/* 3. Concentric Dimension Calibration Ring */}
        <div className="absolute inset-16 sm:inset-20 rounded-full border border-white/[0.06] flex items-center justify-center">
          <div className="w-full h-[1px] bg-white/[0.04] absolute" />
          <div className="h-full w-[1px] bg-white/[0.04] absolute" />
        </div>

        {/* 4. Central Solid Graphite Monolith Core Disk */}
        <div
          className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full flex items-center justify-center border border-white/[0.16] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(53,232,91,0.15)]"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, #222824 0%, #171A18 55%, #050505 100%)',
          }}
        >
          {/* Subtle Inner Bevel Rim */}
          <div className="absolute inset-1.5 rounded-full border border-white/[0.08] pointer-events-none" />

          {/* Central Illuminated Hash Digital Glyph Matrix */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Official HASH.DEVS Brand Symbol */}
            <HashSymbol
              className="w-14 h-11 sm:w-18 sm:h-14 lg:w-22 lg:h-17 drop-shadow-[0_0_16px_rgba(53,232,91,0.45)]"
              aria-label="HASH.DEVS brand symbol"
            />
          </div>

          {/* Subtle Outer Floating Nodes */}
          <span className="absolute -top-2 right-6 w-2 h-2 rounded-full bg-[var(--brand-neon-green)]/60 animate-pulse" />
          <span className="absolute -bottom-1 left-8 w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
};

