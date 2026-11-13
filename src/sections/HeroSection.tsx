import React, { useState, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CinematicNoise } from '@/components/hero/CinematicNoise';
import { SignalEqualiser } from '@/components/hero/SignalEqualiser';
import { SignalCore } from '@/components/hero/SignalCore';
import {
  EngineeringPanel,
  CreativePanel,
  CapabilitiesCard,
} from '@/components/hero/FloatingInterfacePanels';
import { COMPANY_IDENTITY } from '@/types';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className, onCtaClick }) => {
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px',
    once: false,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Only apply on fine-pointer (desktop) devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setPointerOffset({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointerOffset({ x: 0, y: 0 });
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative w-full min-h-[calc(100vh-74px)] flex flex-col items-center justify-start overflow-hidden',
        'px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-28',
        'bg-[var(--bg-primary)] transition-colors duration-250',
        className,
      )}
    >
      {/* 1. Cinematic Noise Texture Layer */}
      <CinematicNoise />

      {/* 2. Layered Atmospheric Horizon & Green Signal Illumination */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Concentrated Green Radial Illumination Behind Headline & Visual Core */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] sm:w-[1000px] sm:h-[700px] rounded-full blur-[140px] opacity-35 transition-all duration-300"
          style={{
            background: 'var(--hero-radial-glow)',
          }}
        />

        {/* Ambient Lower Horizon Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[320px] rounded-full blur-[110px] opacity-25 transition-all duration-300"
          style={{
            background: 'var(--hero-horizon-glow)',
          }}
        />

        {/* Precision Geometric Technical Grid Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, transparent 100%)',
          }}
        />

        {/* Subtle Technical Framing Coordinate Markers */}
        <div className="hidden lg:block absolute top-12 left-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          SYS // 01.HD.CORE
        </div>
        <div className="hidden lg:block absolute top-12 right-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          NODE // HD.CORE.01
        </div>
      </div>

      {/* 3. Pixel-Dot Signal Equaliser Rising from the Horizon */}
      <SignalEqualiser pointerX={pointerOffset.x} />

      {/* 4. Main Centered Editorial Composition */}
      <div
        className={cn(
          'relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center',
          'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity]',
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
        )}
      >
        {/* Entrance 1: Overline Live Status Badge (Centered) */}
        <div className="animate-hero-1 mb-5 sm:mb-6">
          <StatusBadge
            status="active"
            label="Digital Experience Studio"
          />
        </div>

        {/* Entrance 2: Primary Dominant Centered H1 */}
        <div className="animate-hero-2 mb-6 sm:mb-8">
          <h1 className="text-center tracking-[-0.035em]">
            <span
              id="hero-primary-headline"
              className="block text-4xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-sans font-semibold tracking-[-0.035em] leading-[1.08] text-[var(--text-primary)]"
            >
              Build with purpose.
            </span>
            <span
              id="hero-cursive-headline"
              className="block font-cursive italic font-normal text-[var(--cursive-headline-color)] text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[98px] leading-[1.12] mt-1 sm:mt-2.5 tracking-normal drop-shadow-[var(--cursive-headline-shadow)]"
            >
              Grow with clarity.
            </span>
          </h1>
        </div>

        {/* Entrance 3: Centered Supporting Description */}
        <div className="animate-hero-3 max-w-[650px] mx-auto mb-8 sm:mb-9 px-4">
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed font-normal text-center">
            {COMPANY_IDENTITY.mission}
          </p>
        </div>

        {/* Entrance 4: Dual Calls to Action (Centered) */}
        <div className="animate-hero-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10 w-full max-w-md sm:max-w-none">
          <PrimaryButton
            size="lg"
            href="#contact"
            onClick={onCtaClick}
            className="w-full sm:w-auto justify-center shadow-[0_0_28px_rgba(53,232,91,0.28)] hover:shadow-[0_0_36px_rgba(53,232,91,0.45)]"
          >
            Start a Project
          </PrimaryButton>
          <SecondaryButton
            size="lg"
            href="#services"
            className="w-full sm:w-auto justify-center"
          >
            Explore Our Services
          </SecondaryButton>
        </div>

        {/* Telemetry Micro-Marker Footnote */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 pb-6 sm:pb-8 border-b border-[var(--divider-color)] font-mono text-[11px] text-[var(--text-muted)] max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
            <span>SIGNAL // ACTIVE</span>
          </div>
          <span>•</span>
          <div>LATENCY // 11.4ms</div>
          <span>•</span>
          <div>CORE // 05.DISCIPLINES</div>
        </div>

        {/* Entrance 5: Cinematic Digital Signal Stage & Telemetry Below CTAs */}
        <div className="animate-hero-5 w-full mt-6 sm:mt-10 relative flex flex-col items-center">
          {/* Signal Core & Flanking Telemetry on Desktop */}
          <div className="relative w-full max-w-4xl flex items-center justify-center py-2 sm:py-4">
            {/* Left Flanking Telemetry Panel (Engineering) */}
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-auto z-20">
              <EngineeringPanel pointerOffset={pointerOffset} />
            </div>

            {/* Central Geometric Signal Core */}
            <div className="relative z-10">
              <SignalCore pointerOffset={pointerOffset} />
            </div>

            {/* Right Flanking Telemetry Panel (Creative) */}
            <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto z-20">
              <CreativePanel pointerOffset={pointerOffset} />
            </div>
          </div>

          {/* Telemetry Panels on Screens below XL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:hidden gap-4 w-full max-w-md mt-6">
            <EngineeringPanel className="w-full" pointerOffset={pointerOffset} />
            <CreativePanel className="w-full" pointerOffset={pointerOffset} />
          </div>

          {/* Verified Capabilities Card */}
          <div className="w-full max-w-md mt-6 sm:mt-8 z-20">
            <CapabilitiesCard onCtaClick={onCtaClick} />
          </div>
        </div>
      </div>
    </section>
  );
};
