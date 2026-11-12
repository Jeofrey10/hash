import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  readonly overline?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: 'left' | 'center';
  readonly titleTag?: 'h1' | 'h2' | 'h3';
  readonly className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  overline,
  title,
  description,
  align = 'left',
  titleTag: TitleComponent = 'h2',
  className,
}) => {
  return (
    <div
      className={cn(
        'space-y-3',
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        'max-w-3xl',
        className,
      )}
    >
      {overline && (
        <div className="inline-block font-mono text-xs font-semibold uppercase tracking-widest text-[var(--brand-neon-green)]">
          {overline}
        </div>
      )}
      <TitleComponent className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--brand-pure-white)] leading-[1.15]">
        {title}
      </TitleComponent>
      {description && (
        <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
};
