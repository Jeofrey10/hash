import React from 'react';
import { Reveal, TextReveal } from '@/components/motion';
import { cn } from '@/lib/utils';

export interface ApproachSectionProps {
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

export interface ApproachPhase {
  readonly number: string;
  readonly title: string;
  readonly phaseTag: string;
  readonly description: string;
  readonly themes: readonly string[];
}

export const APPROACH_PHASES: readonly ApproachPhase[] = [
  {
    number: '01',
    title: 'Discover',
    phaseTag: 'Phase 01 // Research & Context',
    description:
      'Understand the business, audience, goals, and challenges before deciding what to build.',
    themes: ['Business objectives', 'Audience understanding', 'Research and discovery'],
  },
  {
    number: '02',
    title: 'Define',
    phaseTag: 'Phase 02 // Strategy & Architecture',
    description:
      'Establish a clear direction, project structure, and experience strategy.',
    themes: ['Project direction', 'Information architecture', 'Experience planning'],
  },
  {
    number: '03',
    title: 'Design & Build',
    phaseTag: 'Phase 03 // Craft & Engineering',
    description:
      'Translate the defined direction into a considered, functional digital experience.',
    themes: ['Interface design', 'Development', 'Performance and usability'],
  },
  {
    number: '04',
    title: 'Refine & Grow',
    phaseTag: 'Phase 04 // Quality & Evolution',
    description:
      'Test, refine, and improve the experience so it can support evolving business needs.',
    themes: ['Quality assurance', 'Optimization', 'Continuous improvement'],
  },
] as const;

export const ApproachSection: React.FC<ApproachSectionProps> = ({ className }) => {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className={cn(
        'relative w-full overflow-hidden scroll-mt-24 lg:scroll-mt-28',
        'px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36',
        'border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-250',
        className,
      )}
    >
      {/* 1. Atmospheric Ambient & Technical Background Language */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/4 left-1/3 w-[550px] h-[350px] rounded-full blur-[140px] opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.25) 0%, rgba(23, 26, 24, 0.1) 60%, transparent 80%)',
          }}
        />

        {/* Geometric Technical Grid matching Hero & Services */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Subtle Technical Framing Markers */}
        <div className="hidden lg:block absolute top-10 left-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          SEC // 03.APPROACH
        </div>
        <div className="hidden lg:block absolute top-10 right-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          PROCESS // 04.PHASES
        </div>
      </div>

      {/* 2. Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal variant="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-accent)]">
                Our Approach
              </span>
            </div>
          </Reveal>

          <TextReveal
            as="h2"
            id="approach-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.025em] text-[var(--text-primary)] leading-[1.12]"
            delay={80}
          >
            A disciplined path from requirements to execution.
          </TextReveal>

          <Reveal variant="fade-up" delay={160}>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              Every project follows an intentional four-stage progression designed to clarify goals, establish rigorous architecture, craft purposeful interfaces, and ensure long-term stability.
            </p>
          </Reveal>
        </div>

        {/* 3. Connected 4-Stage Process Journey */}
        <div className="relative">
          {/* Desktop Horizontal Architectural Connecting Track */}
          <div
            className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-[var(--border-medium)] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* 4-Stage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
            {APPROACH_PHASES.map((phase, index) => {
              const isLast = index === APPROACH_PHASES.length - 1;

              return (
                <Reveal
                  key={phase.number}
                  variant="fade-up"
                  staggerIndex={index + 1}
                  className="h-full flex flex-col"
                >
                  <article
                    tabIndex={0}
                    aria-label={`${phase.number}: ${phase.title}`}
                    className={cn(
                      'relative flex flex-col justify-between h-full p-6 sm:p-7 lg:p-8 rounded-2xl',
                      'bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-[var(--shadow-card)]',
                      'transition-all duration-300 ease-out group',
                      'hover:border-[var(--panel-hover-border)] hover:-translate-y-1',
                      'hover:shadow-[var(--shadow-floating)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
                    )}
                  >
                    {/* Top Subtle Progression Node */}
                    <div className="flex items-center justify-between pb-6 border-b border-[var(--divider-color)] mb-6">
                      <div className="flex items-center gap-3">
                        {/* Step Marker Node */}
                        <div className="relative flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-neon-green)] shadow-[0_0_8px_rgba(53,232,91,0.6)]" />
                          <span className="absolute w-5 h-5 rounded-full border border-[var(--brand-neon-green)]/30 animate-ping opacity-30" />
                        </div>
                        <span className="font-mono text-xs font-semibold tracking-wider text-[var(--text-accent)]">
                          STEP {phase.number}
                        </span>
                      </div>

                      {/* Directional Connector Indicator */}
                      {!isLast ? (
                        <span
                          className="text-[var(--text-muted)] group-hover:text-[var(--text-accent)] group-hover:translate-x-0.5 transition-all duration-200 text-sm font-mono"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      ) : (
                        <span
                          className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--tag-bg)] border border-[var(--tag-border)]"
                          aria-hidden="true"
                        >
                          Ongoing
                        </span>
                      )}
                    </div>

                    {/* Main Stage Content */}
                    <div className="space-y-3.5 flex-1">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                        {phase.phaseTag}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-200">
                        {phase.title}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                        {phase.description}
                      </p>
                    </div>

                    {/* Supporting Themes Pills */}
                    <div className="pt-6 mt-6 border-t border-[var(--divider-color)] space-y-2.5">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                        Focus Themes
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.themes.map((theme, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-md bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)] font-mono group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-medium)] transition-colors"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

