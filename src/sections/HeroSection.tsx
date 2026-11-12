import React from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { COMPANY_IDENTITY } from '@/types';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className, onCtaClick }) => {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn(
        'relative w-full min-h-[calc(100vh-74px)] flex items-center justify-center overflow-hidden',
        'px-5 sm:px-8 lg:px-12 py-16 lg:py-24',
        className,
      )}
    >
      {/* 1. Atmospheric Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle Ambient Radial Green Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] sm:w-[900px] sm:h-[600px] rounded-full blur-[120px] opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.35) 0%, rgba(23, 26, 24, 0.15) 50%, transparent 80%)',
          }}
        />

        {/* Precision Geometric Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 65% at 50% 45%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 45%, black 40%, transparent 100%)',
          }}
        />

        {/* Subtle Technical Framing Coordinate Markers */}
        <div className="hidden lg:block absolute top-12 left-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          SYS // 01.HD.CORE
        </div>
        <div className="hidden lg:block absolute top-12 right-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          LOC // 40.7128° N, 74.0060° W
        </div>
      </div>

      {/* 2. Main Hero Content Layout */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Primary Editorial Brand Headline & CTAs */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Entrance 1: Overline Live Status Badge */}
            <div className="animate-hero-1">
              <StatusBadge
                status="active"
                label="Digital Experience Studio"
              />
            </div>

            {/* Entrance 2: Primary Dominant H1 */}
            <div className="animate-hero-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] text-[var(--brand-pure-white)] leading-[1.05]">
                Build with purpose.<br />
                <span className="text-[var(--brand-neon-green)]">Grow with clarity.</span>
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
                className="justify-center shadow-[0_0_24px_rgba(53,232,91,0.25)]"
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
          </div>

          {/* Right Column: Floating Dimensional Anchor Card */}
          <div className="lg:col-span-5 xl:col-span-4 animate-hero-5">
            <GlassPanel
              variant="elevated"
              padding="lg"
              rounded="2xl"
              className="border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.60)] relative backdrop-blur-xl"
            >
              <div className="space-y-6">
                {/* Anchor Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Capabilities
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--brand-neon-green)] tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)] animate-pulse" />
                    Verified
                  </span>
                </div>

                {/* 5 Core Disciplines */}
                <ul className="space-y-3.5 list-none p-0 m-0">
                  {COMPANY_IDENTITY.services.map((service, index) => (
                    <li
                      key={service}
                      className="flex items-center justify-between text-sm text-white/85 group hover:text-white transition-colors duration-150"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[var(--brand-neon-green)] transition-colors duration-200" />
                        <span className="font-medium">{service}</span>
                      </span>
                      <span className="font-mono text-xs text-white/30 group-hover:text-white/60">
                        0{index + 1}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Engagement Status Footer */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60 font-mono">
                  <span>Capacity: Available</span>
                  <a
                    href="#contact"
                    onClick={onCtaClick}
                    className="text-[var(--brand-neon-green)] hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded"
                  >
                    Inquire →
                  </a>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
};
