import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ImageRevealContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  readonly priority?: boolean;
  readonly overlay?: boolean;
}

export const ImageRevealContainer: React.FC<ImageRevealContainerProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  priority = false,
  overlay = true,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClasses = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    auto: 'aspect-auto',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[var(--brand-graphite)] border border-white/[0.08]',
        aspectClasses[aspectRatio],
        className,
      )}
      {...props}
    >
      {/* Background loading shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse" aria-hidden="true" />
      )}

      {/* Target Image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-700 ease-out',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
        )}
      />

      {/* Dark Vignette Overlay for Contrast */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--brand-obsidian)] via-transparent to-transparent opacity-80 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

