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
        'bg-[var(--glass-bg-floating)] backdrop-blur-xl border border-[var(--border-medium)]',
        'shadow-[var(--shadow-floating)] text-[var(--text-primary)]',
        'transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none',
        'w-[230px] xl:w-[250px]',
        className,
      )}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--divider-color)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[var(--text-accent)] uppercase">
            SYSTEM // 001
          </span>
        </div>
        <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">LIVE</span>
      </div>

      {/* Title */}
      <div className="space-y-0.5">
        <div className="text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase">
          DIGITAL ENGINEERING
        </div>
        <div className="font-mono text-[10px] text-[var(--text-muted)]">Architecture & Performance</div>
      </div>

      {/* Disciplines */}
      <div className="space-y-1.5 pt-0.5 text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Full-Stack Web</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Scalable Systems</span>
        </div>
      </div>

      {/* Telemetry Readout */}
      <div className="pt-2 border-t border-[var(--divider-color)] flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
        <span>STATUS // NORMAL</span>
        <span className="text-[var(--text-accent)]">99.98%</span>
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
        'bg-[var(--glass-bg-floating)] backdrop-blur-xl border border-[var(--border-medium)]',
        'shadow-[var(--shadow-floating)] text-[var(--text-primary)]',
        'transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none',
        'w-[230px] xl:w-[250px]',
        className,
      )}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--divider-color)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[var(--text-accent)] uppercase">
            SYSTEM // 002
          </span>
        </div>
        <span className="font-mono text-[9px] text-[var(--text-accent)] uppercase">
          HASH.NODE // ACTIVE
        </span>
      </div>

      {/* Title */}
      <div className="space-y-0.5">
        <div className="text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase">
          CREATIVE INTELLIGENCE
        </div>
        <div className="font-mono text-[10px] text-[var(--text-muted)]">Visual & Motion Design</div>
      </div>

      {/* Disciplines */}
      <div className="space-y-1.5 pt-0.5 text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Visual identity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Motion systems</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-sm bg-[var(--text-muted)]" />
          <span>Digital experiences</span>
        </div>
      </div>

      {/* Pulse Coordinate Footnote */}
      <div className="pt-2 border-t border-[var(--divider-color)] flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
        <span>LATENCY // &lt;12ms</span>
        <span className="text-[var(--text-accent)]">VERIFIED</span>
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
        'bg-[var(--glass-bg-floating)] backdrop-blur-xl border border-[var(--border-medium)]',
        'shadow-[var(--shadow-floating)] text-[var(--text-primary)]',
        'w-full max-w-md mx-auto',
        className,
      )}
    >
      {/* Capabilities Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--divider-color)]">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Capabilities
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-accent)] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
          Verified
        </span>
      </div>

      {/* 5 Core Disciplines */}
      <ul className="space-y-2.5 list-none p-0 m-0">
        {COMPANY_IDENTITY.services.map((service, index) => (
          <li
            key={service}
            className="flex items-center justify-between text-xs sm:text-sm text-[var(--text-primary)] group hover:text-[var(--text-accent)] transition-colors duration-150"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] group-hover:bg-[var(--brand-neon-green)] transition-colors duration-200" />
              <span className="font-medium">{service}</span>
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--text-accent)]">
              0{index + 1}
            </span>
          </li>
        ))}
      </ul>

      {/* Engagement Status Footer */}
      <div className="pt-3 border-t border-[var(--divider-color)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
        <span>Digital Experience Studio</span>
        <a
          href="#contact"
          onClick={onCtaClick}
          className="text-[var(--text-accent)] hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded font-semibold"
        >
          Inquire →
        </a>
      </div>
    </div>
  );
};
