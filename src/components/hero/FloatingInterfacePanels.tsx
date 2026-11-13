import React from 'react';
import { COMPANY_IDENTITY } from '@/types';
import { cn } from '@/lib/utils';

export interface FloatingPanelProps {
  readonly className?: string;
  readonly pointerOffset?: { x: number; y: number };
}

/**
 * Panel A: Digital Engineering Telemetry
 */
export const EngineeringPanel: React.FC<FloatingPanelProps> = ({
  className,
  pointerOffset = { x: 0, y: 0 },
}) => {
  const px = pointerOffset.x * -16;
  const py = pointerOffset.y * -14;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 sm:p-5 rounded-xl',
        'bg-[#171A18]/80 backdrop-blur-xl border border-white/[0.10]',
        'shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(53,232,91,0.05)]',
        'transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none',
        'w-[230px] xl:w-[250px]',
        className,
      )}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[var(--brand-neon-green)] uppercase">
            SYSTEM // 001
          </span>
        </div>
        <span className="font-mono text-[9px] text-white/40 uppercase">LIVE</span>
      </div>

      {/* Title */}
      <div className="space-y-0.5">
        <div className="text-xs font-semibold tracking-wider text-[var(--brand-pure-white)] uppercase">
          DIGITAL ENGINEERING
        </div>
        <div className="font-mono text-[10px] text-white/50">Architecture & Performance</div>
      </div>

      {/* Disciplines */}
      <div className="space-y-1.5 pt-0.5 text-[11px] text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Interface systems</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Performance</span>
        </div>
      </div>

      {/* Signal Micro-Equaliser Visualizer */}
      <div className="pt-2 border-t border-white/[0.06] flex items-end justify-between h-4 gap-1">
        <span className="w-1 h-2 rounded-xs bg-[var(--brand-neon-green)]/60 animate-pulse" />
        <span className="w-1 h-3.5 rounded-xs bg-[var(--brand-neon-green)]/80 animate-pulse delay-75" />
        <span className="w-1 h-1.5 rounded-xs bg-[var(--brand-neon-green)]/40 animate-pulse delay-150" />
        <span className="w-1 h-4 rounded-xs bg-[var(--brand-neon-green)] animate-pulse delay-100" />
        <span className="w-1 h-2.5 rounded-xs bg-[var(--brand-neon-green)]/70 animate-pulse delay-200" />
        <span className="w-1 h-3 rounded-xs bg-[var(--brand-neon-green)]/80 animate-pulse" />
        <span className="font-mono text-[8px] text-white/30 ml-auto self-center">
          44.1 kHz
        </span>
      </div>
    </div>
  );
};

/**
 * Panel B: Creative Intelligence Telemetry
 */
export const CreativePanel: React.FC<FloatingPanelProps> = ({
  className,
  pointerOffset = { x: 0, y: 0 },
}) => {
  const px = pointerOffset.x * 16;
  const py = pointerOffset.y * 14;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 sm:p-5 rounded-xl',
        'bg-[#171A18]/80 backdrop-blur-xl border border-white/[0.10]',
        'shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(53,232,91,0.05)]',
        'transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none',
        'w-[230px] xl:w-[250px]',
        className,
      )}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[var(--brand-neon-green)] uppercase">
            SYSTEM // 002
          </span>
        </div>
        <span className="font-mono text-[9px] text-[var(--brand-neon-green)] uppercase">
          HASH.NODE // ACTIVE
        </span>
      </div>

      {/* Title */}
      <div className="space-y-0.5">
        <div className="text-xs font-semibold tracking-wider text-[var(--brand-pure-white)] uppercase">
          CREATIVE INTELLIGENCE
        </div>
        <div className="font-mono text-[10px] text-white/50">Visual & Motion Design</div>
      </div>

      {/* Disciplines */}
      <div className="space-y-1.5 pt-0.5 text-[11px] text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Visual identity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Motion systems</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-white/30" />
          <span>Digital experiences</span>
        </div>
      </div>

      {/* Pulse Coordinate Footnote */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[9px] text-white/40">
        <span>LATENCY // &lt;12ms</span>
        <span className="text-[var(--brand-neon-green)]">VERIFIED</span>
      </div>
    </div>
  );
};

export interface CapabilitiesCardProps {
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

/**
 * Verified Core Capabilities Card
 */
export const CapabilitiesCard: React.FC<CapabilitiesCardProps> = ({
  className,
  onCtaClick,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-5 sm:p-6 rounded-2xl',
        'bg-[#171A18]/85 backdrop-blur-xl border border-white/[0.12]',
        'shadow-[0_16px_48px_rgba(0,0,0,0.60)]',
        'w-full max-w-md mx-auto',
        className,
      )}
    >
      {/* Capabilities Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <span className="font-mono text-xs uppercase tracking-widest text-white/50">
          Capabilities
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--brand-neon-green)] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          Verified
        </span>
      </div>

      {/* 5 Core Disciplines */}
      <ul className="space-y-2.5 list-none p-0 m-0">
        {COMPANY_IDENTITY.services.map((service, index) => (
          <li
            key={service}
            className="flex items-center justify-between text-xs sm:text-sm text-white/85 group hover:text-white transition-colors duration-150"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[var(--brand-neon-green)] transition-colors duration-200" />
              <span className="font-medium">{service}</span>
            </span>
            <span className="font-mono text-xs text-white/30 group-hover:text-white/60">
              0{index + 1}
            </span>
          </li>
        ))}
      </ul>

      {/* Engagement Status Footer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60 font-mono">
        <span>Digital Experience Studio</span>
        <a
          href="#contact"
          onClick={onCtaClick}
          className="text-[var(--brand-neon-green)] hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded"
        >
          Inquire →
        </a>
      </div>
    </div>
  );
};
