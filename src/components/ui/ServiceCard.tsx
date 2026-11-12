import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { ServiceOffering } from '@/types';

export interface ServiceCardProps {
  readonly index: string; // e.g., "01"
  readonly title: ServiceOffering | string;
  readonly description: string;
  readonly deliverables?: readonly string[];
  readonly icon?: React.ReactNode;
  readonly onExploreClick?: () => void;
  readonly className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  index,
  title,
  description,
  deliverables = [],
  icon,
  onExploreClick,
  className,
}) => {
  return (
    <GlassPanel
      as="article"
      variant="interactive"
      padding="lg"
      rounded="2xl"
      className={cn('flex flex-col justify-between h-full group', className)}
      onClick={onExploreClick}
      tabIndex={onExploreClick ? 0 : undefined}
      role={onExploreClick ? 'button' : undefined}
      onKeyDown={
        onExploreClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onExploreClick();
              }
            }
          : undefined
      }
    >
      <div className="space-y-4">
        {/* Header index & icon */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-neon-green)]">
            {index} //
          </span>
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:text-[var(--brand-neon-green)] group-hover:border-[var(--brand-neon-green)]/40 transition-colors duration-200">
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--brand-pure-white)] group-hover:text-white transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Deliverables / Capabilities chips */}
      {deliverables.length > 0 && (
        <div className="pt-6 mt-6 border-t border-white/[0.06]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-3">
            Key Deliverables
          </div>
          <div className="flex flex-wrap gap-2">
            {deliverables.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/80 font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

