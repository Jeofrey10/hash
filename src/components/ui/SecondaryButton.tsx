import React from 'react';
import { cn } from '@/lib/utils';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullWidth?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
}

export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  (
    {
      children,
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-4 text-xs font-medium',
      md: 'h-10 px-6 text-[15px] font-medium',
      lg: 'h-12 px-8 text-base font-medium',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg',
          'bg-white/[0.04] text-[var(--brand-pure-white)] border border-white/[0.12]',
          'backdrop-blur-sm transition-all duration-200 ease-out select-none',
          'hover:bg-white/[0.08] hover:border-white/[0.25] hover:text-white',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-obsidian)]',
          'disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none',
          sizeClasses[size],
          fullWidth ? 'w-full' : 'w-auto',
          className,
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
      </button>
    );
  },
);

SecondaryButton.displayName = 'SecondaryButton';
