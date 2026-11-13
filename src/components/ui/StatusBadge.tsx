import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly label: string;
  readonly status?: 'active' | 'neutral' | 'accent';
  readonly pulse?: boolean;
  readonly icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status = 'neutral',
  pulse = true,
  icon,
  className,
  ...props
}) => {
  const dotColorClasses = {
    active: 'bg-[var(--brand-neon-green)]',
    accent: 'bg-[var(--brand-neon-green)]',
    neutral: 'bg-[var(--text-muted)]',
  };

  return (
    <div
      role="status"
      className={cn(
        'inline-flex items-center gap-2 h-7 px-3 rounded-full',
        'bg-[var(--tag-bg)] border border-[var(--tag-border)] backdrop-blur-sm',
        'text-xs font-mono font-medium tracking-wide uppercase text-[var(--text-primary)]',
        'select-none transition-colors duration-200',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">{icon}</span>
      ) : (
        <span
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            dotColorClasses[status],
            status === 'active' && pulse && 'pulse-active',
          )}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </div>
  );
};

