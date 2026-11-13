import React, { useState, useCallback } from 'react';
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
      id="hero"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative w-full min-h-[calc(100vh-74px)] flex items-center justify-center overflow-hidden',
        'px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24',
        'bg-[var(--brand-obsidian)]',
        className,
      )}
    >
      {/* 1. Cinematic Noise Texture Layer */}
      <CinematicNoise opacity={0.075} />

      {/* 2. Layered Atmospheric Horizon & Green Signal Illumination */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Concentrated Green Radial Illumination Behind Main Visual */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] sm:w-[950px] sm:h-[650px] rounded-full blur-[140px] opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.40) 0%, rgba(23, 26, 24, 0.18) 50%, transparent 80%)',
          }}
        />

        {/* Ambient Lower Horizon Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[320px] rounded-full blur-[110px] opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(53, 232, 91, 0.35) 0%, rgba(23, 26, 24, 0.10) 65%, transparent 85%)',
          }}
        />

        {/* Precision Geometric Technical Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, transparent 100%)',
          }}
        />

        {/* Subtle Technical Framing Coordinate Markers */}
        <div className="hidden lg:block absolute top-12 left-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          SYS // 01.HD.CORE
        </div>
        <div className="hidden lg:block absolute top-12 right-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          NODE // HD.CORE.01
        </div>
      </div>

      {/* 3. Pixel-Dot Signal Equaliser Rising from the Horizon */}
      <SignalEqualiser pointerX={pointerOffset.x} />

      {/* 4. Main Hero Composition */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Editorial Brand Headline, Narrative & Primary Conversion CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-7 sm:space-y-8">
            {/* Entrance 1: Overline Live Status Badge */}
            <div className="animate-hero-1">
              <StatusBadge
                status="active"
                label="Digital Experience Studio"
              />
            </div>

            {/* Entrance 2: Primary Dominant H1 */}
            <div className="animate-hero-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-semibold tracking-[-0.035em] text-[var(--brand-pure-white)] leading-[1.04]">
                Build with purpose.<br />
                <span className="text-[var(--brand-neon-green)] drop-shadow-[0_0_24px_rgba(53,232,91,0.35)]">
                  Grow with clarity.
                </span>
              </h1>
            </div>

            {/* Entrance 3: Supporting Description */}
            <div className="animate-hero-3 max-w-2xl">
              <p className="text-base sm:text-lg lg:text-xl text-white/75 leading-relaxed font-normal">
                {COMPANY_IDENTITY.mission}
              </p>
            </div>

            {/* Entrance 4: Dual Calls to Action */}
            <div className="animate-hero-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <PrimaryButton
                size="lg"
                href="#contact"
                onClick={onCtaClick}
                className="justify-center shadow-[0_0_28px_rgba(53,232,91,0.28)] hover:shadow-[0_0_36px_rgba(53,232,91,0.45)]"
              >
                Start a Project
              </PrimaryButton>
              <SecondaryButton
                size="lg"
                href="#services"
                className="justify-center"
              >
                Explore Our Services
              </SecondaryButton>
            </div>

            {/* Telemetry Micro-Marker Footnote */}
            <div className="hidden sm:flex items-center gap-4 pt-4 border-t border-white/[0.06] font-mono text-[11px] text-white/35">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
                <span>SIGNAL // ACTIVE</span>
              </div>
              <span>•</span>
              <div>LATENCY // 11.4ms</div>
              <span>•</span>
              <div>CORE // 05.DISCIPLINES</div>
            </div>
          </div>

          {/* Right Column: Cinematic Digital Signal Stage */}
          <div className="lg:col-span-5 xl:col-span-5 animate-hero-5">
            <div className="relative flex flex-col items-center justify-center gap-6 sm:gap-8">
              {/* Central Geometric Hash Signal Core and Flanking Floating Panels */}
              <div className="relative flex items-center justify-center w-full py-4 sm:py-6">
                <SignalCore pointerOffset={pointerOffset} />

                {/* Floating Panel A (Engineering System) - Desktop Positioned */}
                <div className="hidden 2xl:block absolute -left-24 -bottom-4 pointer-events-auto z-20">
                  <EngineeringPanel pointerOffset={pointerOffset} />
                </div>

                {/* Floating Panel B (Creative System) - Desktop Positioned */}
                <div className="hidden 2xl:block absolute -right-16 -top-4 pointer-events-auto z-20">
                  <CreativePanel pointerOffset={pointerOffset} />
                </div>
              </div>

              {/* Engineering & Creative Systems Telemetry on Medium/Large Screens */}
              <div className="hidden sm:grid 2xl:hidden grid-cols-2 gap-4 w-full max-w-md">
                <EngineeringPanel className="w-full" pointerOffset={pointerOffset} />
                <CreativePanel className="w-full" pointerOffset={pointerOffset} />
              </div>

              {/* Verified Capabilities Card */}
              <div className="w-full max-w-md">
                <CapabilitiesCard onCtaClick={onCtaClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
