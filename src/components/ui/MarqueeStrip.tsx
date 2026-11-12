import React from 'react';
import { cn } from '@/lib/utils';

export interface MarqueeItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: React.ReactNode;
}

export interface MarqueeStripProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly items: readonly MarqueeItem[];
  readonly speed?: 'slow' | 'medium' | 'fast';
  readonly direction?: 'left' | 'right';
  readonly pauseOnHover?: boolean;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  items,
  speed = 'medium',
  direction = 'left',
  pauseOnHover = true,
  className,
  ...props
}) => {
  // Speed variations
  const speedStyles = {
    slow: { animationDuration: '40s' },
    medium: { animationDuration: '25s' },
    fast: { animationDuration: '15s' },
  };

  // Duplicate items for continuous seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden py-4 select-none',
        '[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
        '[-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex gap-8 w-max animate-marquee',
          pauseOnHover && 'pause-on-hover',
          direction === 'right' && '[animation-direction:reverse]',
        )}
        style={speedStyles[speed]}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-white hover:border-white/[0.20] transition-colors duration-200"
          >
            {item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
            <span className="font-mono text-xs uppercase tracking-wider font-medium whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

