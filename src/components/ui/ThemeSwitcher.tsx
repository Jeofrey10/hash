import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface ThemeSwitcherProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly className?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly id?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  size = 'md',
  id,
  ...props
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-11 h-11',
  };

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'relative flex items-center justify-center rounded-xl',
        'bg-[var(--tag-bg)] border border-[var(--border-medium)] text-[var(--text-primary)]',
        'hover:border-[var(--border-active)] hover:bg-[var(--state-hover-glass)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
        'transition-all duration-200 ease-out cursor-pointer active:scale-95 select-none',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {/* Sun Icon (shown in dark mode or transitioning) */}
      <svg
        className={cn(
          'w-[18px] h-[18px] transition-transform duration-300 ease-out',
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-[var(--brand-neon-green)]'
            : '-rotate-90 scale-0 opacity-0 absolute text-amber-500',
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* Moon Icon (shown in light mode or transitioning) */}
      <svg
        className={cn(
          'w-[18px] h-[18px] transition-transform duration-300 ease-out',
          !isDark
            ? 'rotate-0 scale-100 opacity-100 text-[var(--text-accent)]'
            : 'rotate-90 scale-0 opacity-0 absolute',
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
};
