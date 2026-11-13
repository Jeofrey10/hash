import React from 'react';
import { cn } from '@/lib/utils';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly href?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullWidth?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
}

export const SecondaryButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, SecondaryButtonProps>(
  (
    {
      children,
      href,
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

    const combinedClasses = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg',
      'bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--border-medium)]',
      'backdrop-blur-sm transition-all duration-200 ease-out select-none',
      'hover:bg-[var(--panel-hover-bg)] hover:border-[var(--border-active)] hover:text-[var(--text-primary)]',
      'active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
      'disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none',
      sizeClasses[size],
      fullWidth ? 'w-full' : 'w-auto',
      className,
    );

    const content = (
      <>
        {icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          role="button"
          className={combinedClasses}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  },
);

SecondaryButton.displayName = 'SecondaryButton';
