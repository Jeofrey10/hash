import React from 'react';
import { Reveal, TextReveal } from '@/components/motion';
import { cn } from '@/lib/utils';

export interface CapabilitiesSectionProps {
  readonly className?: string;
  readonly onCtaClick?: () => void;
}

export interface CapabilityPillar {
  readonly index: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly featured?: boolean;
}

export const CAPABILITY_PILLARS: readonly CapabilityPillar[] = [
  {
    index: '01',
    title: 'Digital Experience Strategy',
    category: 'STRATEGY // EXPERIENCE ARCHITECTURE',
    description:
      'We structure digital experiences around business objectives, user needs, and clear conversion paths.',
    capabilities: [
      'Information architecture',
      'User journey planning',
      'Conversion-focused experience design',
      'Digital experience planning',
    ],
    featured: true,
  },
  {
    index: '02',
    title: 'Interface & Experience Design',
    category: 'DESIGN // INTERACTION SYSTEMS',
    description:
      'We shape intuitive interfaces and consistent visual systems that make digital products easier to understand and use.',
    capabilities: [
      'UI/UX design',
      'Responsive interface systems',
      'Visual consistency',
      'Usability-focused design',
    ],
  },
  {
    index: '03',
    title: 'Software & Platform Engineering',
    category: 'ENGINEERING // SOFTWARE ARCHITECTURE',
    description:
      'We build structured digital platforms and software experiences with attention to architecture, functionality, and performance.',
    capabilities: [
      'Frontend architecture',
      'Web application development',
      'Backend integration',
      'Scalable software architecture',
    ],
  },
  {
    index: '04',
    title: 'Search & Acquisition Systems',
    category: 'GROWTH // DISCOVERY & ACQUISITION',
    description:
      'We combine search optimization and paid acquisition practices to improve digital discoverability and support customer acquisition.',
    capabilities: [
      'Technical and on-page SEO',
      'Search visibility optimization',
      'Campaign architecture',
      'Audience targeting and creative testing',
    ],
  },
  {
    index: '05',
    title: 'Brand & Motion Systems',
    category: 'CREATIVE // VISUAL COMMUNICATION',
    description:
      'We develop coherent visual identities and digital creative experiences that communicate a brand consistently across touchpoints.',
    capabilities: [
      'Brand identity and visual systems',
      'Digital creative assets',
      'Video storytelling',
      'Motion design',
    ],
  },
] as const;

// Backwards compatibility alias
export type CapabilityArea = CapabilityPillar;
export const CAPABILITY_AREAS = CAPABILITY_PILLARS;

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  className,
  onCtaClick,
}) => {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className={cn(
        'relative w-full overflow-hidden scroll-mt-24 lg:scroll-mt-28',
        'px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36',
        'border-t border-white/[0.08]',
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
          className="absolute top-1/3 right-1/4 w-[600px] h-[400px] rounded-full blur-[150px] opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.25) 0%, rgba(23, 26, 24, 0.1) 60%, transparent 80%)',
          }}
        />

        {/* Precision Geometric Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Technical Framing Boundary Markers */}
        <div className="hidden lg:block absolute top-10 left-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          SEC // 04.CAPABILITIES
        </div>
        <div className="hidden lg:block absolute top-10 right-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          FRAMEWORK // 05.PILLARS
        </div>
      </div>

      {/* 2. Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto space-y-16 lg:space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal variant="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--brand-neon-green)]">
                Cross-Disciplinary Capabilities
              </span>
            </div>
          </Reveal>

          <TextReveal
            as="h2"
            id="capabilities-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.025em] text-[var(--brand-pure-white)] leading-[1.12]"
            delay={80}
          >
            The thinking and craft behind every digital experience.
          </TextReveal>

          <Reveal variant="fade-up" delay={160}>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
              From experience strategy and interface design to engineering, acquisition, and creative production, our capabilities connect the disciplines needed to build purposeful digital experiences.
            </p>
          </Reveal>
        </div>

        {/* 3. Interconnected Architectural Capability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {CAPABILITY_PILLARS.map((pillar, index) => {
            // Row 1: Strategy (6-col) + Interface Design (6-col)
            // Row 2: Software Engineering (4-col) + Search/Acquisition (4-col) + Brand/Motion (4-col)
            // Tablet: 2 cols with 5th element spanning 2 columns
            const colSpanClass =
              index === 0
                ? 'md:col-span-1 lg:col-span-6'
                : index === 1
                ? 'md:col-span-1 lg:col-span-6'
                : index === 4
                ? 'md:col-span-2 lg:col-span-4'
                : 'md:col-span-1 lg:col-span-4';

            return (
              <Reveal
                key={pillar.index}
                variant="fade-up"
                staggerIndex={index + 1}
                className={cn('h-full flex flex-col', colSpanClass)}
              >
                <article
                  tabIndex={0}
                  aria-label={`${pillar.index}: ${pillar.title}`}
                  className={cn(
                    'relative flex flex-col justify-between h-full p-6 sm:p-7 lg:p-8 rounded-2xl',
                    'bg-white/[0.02] border border-white/[0.08]',
                    'transition-all duration-300 ease-out group',
                    'hover:bg-white/[0.04] hover:border-white/[0.18] hover:-translate-y-1',
                    'hover:shadow-[0_16px_36px_rgba(0,0,0,0.40),0_0_20px_rgba(53,232,91,0.08)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-obsidian)]',
                  )}
                >
                  {/* Top Header with Technical Category Marker */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/[0.06] mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-neon-green)]">
                        {pillar.index} //
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/50 group-hover:text-white/80 group-hover:border-white/20 transition-colors">
                        {pillar.category}
                      </span>
                    </div>
                    {pillar.featured && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand-neon-green)] px-2 py-0.5 rounded bg-[var(--brand-neon-green)]/10 border border-[var(--brand-neon-green)]/20">
                        Foundation Pillar
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--brand-pure-white)] group-hover:text-white transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Specific Core Capabilities List */}
                  <div className="pt-5 border-t border-white/[0.06] mt-auto">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
                      Core Expertise & Methods
                    </div>
                    <ul className="space-y-2.5" role="list">
                      {pillar.capabilities.map((capability, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-white/75 group-hover:text-white/90 transition-colors"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-sm bg-[var(--brand-neon-green)]/80 mt-1.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* 4. Directional Closing Statement Toward Contact */}
        <Reveal variant="fade-up" delay={200}>
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-white/[0.14] transition-colors">
            <div className="space-y-1.5 max-w-2xl">
              <div className="font-mono text-xs text-[var(--brand-neon-green)] uppercase tracking-wider">
                CONNECTED SYSTEM // 05 PILLARS
              </div>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Every discipline is engineered to operate as one unified delivery system—eliminating fragmented handoffs and ensuring brand coherence from initial strategy through execution.
              </p>
            </div>
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--brand-neon-green)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-[var(--brand-neon-green)]/30 hover:border-[var(--brand-neon-green)] px-5 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] flex-shrink-0"
            >
              <span>Initiate Project Consultation</span>
              <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
