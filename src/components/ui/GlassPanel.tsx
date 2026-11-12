import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
  readonly variant?: 'standard' | 'elevated' | 'interactive';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly rounded?: 'xl' | '2xl' | '3xl';
  readonly as?: 'div' | 'article' | 'section';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      children,
      variant = 'standard',
      padding = 'md',
      rounded = '2xl',
      as: Component = 'div',
      className,
      ...props
    },
    ref,
  ) => {
    const paddingClasses: Record<'none' | 'sm' | 'md' | 'lg', string> = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const roundedClasses: Record<'xl' | '2xl' | '3xl', string> = {
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    };

    const variantClasses: Record<'standard' | 'elevated' | 'interactive', string> = {
      standard: 'glass-standard',
      elevated: 'glass-floating',
      interactive: cn(
        'glass-standard transition-all duration-300 ease-out cursor-pointer',
        'hover:-translate-y-1 hover:border-[var(--border-active)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.50),0_0_24px_rgba(53,232,91,0.15)]',
      ),
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'relative overflow-hidden text-[var(--brand-pure-white)]',
          roundedClasses[rounded],
          paddingClasses[padding],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

GlassPanel.displayName = 'GlassPanel';
