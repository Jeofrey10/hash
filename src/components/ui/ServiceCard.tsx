import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { ServiceOffering } from '@/types';

export interface ServiceCardProps {
  readonly index: string; // e.g., "01"
  readonly title: ServiceOffering | string;
  readonly description: string;
  readonly category?: string;
  readonly deliverables?: readonly string[];
  readonly icon?: React.ReactNode;
  readonly onExploreClick?: () => void;
  readonly className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  index,
  title,
  description,
  category,
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
      className={cn(
        'flex flex-col justify-between h-full group relative',
        'bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-[var(--shadow-card)]',
        'hover:border-[var(--panel-hover-border)]',
        'focus-within:ring-2 focus-within:ring-[var(--brand-neon-green)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-primary)]',
        className,
      )}
      aria-label={`${index}: ${title}`}
    >
      {/* Top Border Hover Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-neon-green)]/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      <div className="space-y-4">
        {/* Header index, category marker & icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-accent)]">
              {index} //
            </span>
            {category && (
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] group-hover:border-[var(--border-medium)] transition-colors">
                {category}
              </span>
            )}
          </div>
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-[var(--tag-bg)] border border-[var(--tag-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-accent)] group-hover:border-[var(--border-active)] transition-colors duration-200">
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Deliverables / Capabilities chips and interaction affordance */}
      <div className="pt-6 mt-6 border-t border-[var(--divider-color)] space-y-4">
        {deliverables.length > 0 && (
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2.5">
              Focus & Deliverables
            </div>
            <div className="flex flex-wrap gap-2">
              {deliverables.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)] font-mono group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-medium)] transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subtle Bottom Interaction Marker with Semantic Native Button */}
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--divider-color)]">
          <span className="text-[11px] uppercase tracking-wider">Discipline {index}</span>
          <button
            type="button"
            onClick={onExploreClick}
            aria-label={`Inquire about ${title}`}
            className="inline-flex items-center gap-1.5 text-[var(--text-accent)] opacity-85 group-hover:opacity-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1.5 py-0.5 after:absolute after:inset-0 after:content-[''] after:cursor-pointer font-medium"
          >
            <span>Inquire</span>
            <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>
        </div>
      </div>
    </GlassPanel>
  );
};
