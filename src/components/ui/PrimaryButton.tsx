import React from 'react';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly href?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullWidth?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
  readonly isLoading?: boolean;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, PrimaryButtonProps>(
  (
    {
      children,
      href,
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      isLoading = false,
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
      'bg-[var(--brand-neon-green)] text-[var(--brand-obsidian)]',
      'transition-all duration-200 ease-out select-none',
      'hover:brightness-105 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(53,232,91,0.30)]',
      'active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-obsidian)]',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none',
      sizeClasses[size],
      fullWidth ? 'w-full' : 'w-auto',
      className,
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--brand-obsidian)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
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
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';
