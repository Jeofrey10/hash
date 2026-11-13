import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ImageRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  readonly priority?: boolean;
  readonly overlay?: boolean;
  readonly threshold?: number;
  readonly rootMargin?: string;
  readonly once?: boolean;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  priority = false,
  overlay = true,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  once = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReduced = useReducedMotion();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  });

  const aspectClasses = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    auto: 'aspect-auto',
  };

  const showContent = prefersReduced || (isVisible && isLoaded);

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[var(--brand-graphite)] border border-white/[0.08]',
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    >
      {/* Background loading shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse" aria-hidden="true" />
      )}

      {/* Target Image with scale unmask */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover',
          !showContent && 'will-change-[transform,opacity]',
          prefersReduced
            ? 'opacity-100 transform-none transition-none'
            : showContent
            ? 'opacity-100 scale-100 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
            : 'opacity-0 scale-105 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
        )}
      />

      {/* Subtle Vignette Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--brand-obsidian)] via-transparent to-transparent opacity-80 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
