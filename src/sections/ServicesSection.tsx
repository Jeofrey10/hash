import React from 'react';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Reveal, TextReveal } from '@/components/motion';
import { cn } from '@/lib/utils';
import type { ServiceOffering } from '@/types';

export interface ServicesSectionProps {
  readonly className?: string;
  readonly onCtaClick?: (serviceTitle?: string) => void;
}

export interface ServiceItemData {
  readonly index: string;
  readonly title: ServiceOffering;
  readonly category: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly icon: React.ReactNode;
}

// 1. Precise, lightweight SVG architectural line icons
const WebDevelopmentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="15" x="2" y="3" rx="2" />
    <path d="M2 8h20" />
    <path d="m6 5 .01 0" />
    <path d="m9 5 .01 0" />
    <path d="m8 12-2 2 2 2" />
    <path d="m16 12 2 2-2 2" />
    <path d="m13 11-2 6" />
  </svg>
);

const ApplicationDevelopmentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="14" height="20" x="5" y="2" rx="2" />
    <path d="M12 18h.01" />
    <path d="M9 6h6" />
    <path d="M2 9h3" />
    <path d="M19 9h3" />
    <path d="M2 15h3" />
    <path d="M19 15h3" />
  </svg>
);

const SeoOptimizationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
    <path d="M8 12l2-2 2 1 3-3" />
    <path d="M15 8h2v2" />
  </svg>
);

const MetaAdvertisingIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </svg>
);

const CreativeDesignVideoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m14 7 3 3" />
    <path d="m4 20 4-1 10.5-10.5a2.12 2.12 0 0 0-3-3L5 16l-1 4Z" />
    <path d="m15 15 5 5" />
    <path d="m18 13 4 4" />
  </svg>
);

// 2. Verified 5 Core Service Offerings from Hash.Devs profile (PROJECT.md)
export const SERVICES_DATA: readonly ServiceItemData[] = [
  {
    index: '01',
    title: 'Website Development',
    category: 'Engineering',
    description:
      'High-performance, responsive, cinematic web platforms engineered for speed, search visibility, and conversion.',
    deliverables: ['Performance Architecture', 'Responsive Systems', 'Conversion Engineering'],
    icon: <WebDevelopmentIcon />,
  },
  {
    index: '02',
    title: 'Application Development',
    category: 'Software',
    description:
      'Scalable web and cross-platform applications with robust architecture and intuitive user interfaces.',
    deliverables: ['Full-Stack Architecture', 'Interface Design', 'Cross-Platform Systems'],
    icon: <ApplicationDevelopmentIcon />,
  },
  {
    index: '03',
    title: 'SEO Optimization',
    category: 'Growth',
    description:
      'Technical, on-page, and architectural search engine optimization designed to ensure sustained discoverability.',
    deliverables: ['Technical Indexation', 'Architectural Audits', 'Search Performance'],
    icon: <SeoOptimizationIcon />,
  },
  {
    index: '04',
    title: 'Meta Advertising',
    category: 'Media',
    description:
      'Data-backed paid acquisition and funnel strategies that maximize return on ad spend.',
    deliverables: ['Campaign Architecture', 'Funnel Strategy', 'Performance Optimization'],
    icon: <MetaAdvertisingIcon />,
  },
  {
    index: '05',
    title: 'Creative Design & Video',
    category: 'Creative',
    description:
      'High-fidelity visual identity, UI/UX design, brand systems, and engaging video storytelling.',
    deliverables: ['Design Systems', 'Visual Identity', 'Digital Storytelling'],
    icon: <CreativeDesignVideoIcon />,
  },
] as const;

export const ServicesSection: React.FC<ServicesSectionProps> = ({ className, onCtaClick }) => {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className={cn(
        'relative w-full overflow-hidden scroll-mt-24 lg:scroll-mt-28',
        'px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36',
        'border-t border-white/[0.08]',
        className,
      )}
    >
      {/* Subtle Atmospheric Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/3 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] opacity-15"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.3) 0%, rgba(23, 26, 24, 0.1) 60%, transparent 80%)',
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
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Subtle Technical Framing Markers (Architectural Continuity with Hero) */}
        <div className="hidden lg:block absolute top-10 left-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          SEC // 02.SERVICES
        </div>
        <div className="hidden lg:block absolute top-10 right-12 font-mono text-[11px] text-white/20 tracking-widest uppercase">
          DISCIPLINE // 05.CORE
        </div>
      </div>

      {/* Main Services Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
        {/* Section Introduction Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal variant="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--brand-neon-green)]">
                What We Do
              </span>
            </div>
          </Reveal>

          <TextReveal
            as="h2"
            id="services-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.025em] text-[var(--brand-pure-white)] leading-[1.12]"
            delay={80}
          >
            Integrated capabilities for connected digital growth.
          </TextReveal>

          <Reveal variant="fade-up" delay={160}>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
              We engineer high-performance web platforms, scalable applications, and data-backed growth systems that help businesses get discovered, communicate their value, and convert visitors into customers.
            </p>
          </Reveal>
        </div>

        {/* Services 5-Discipline Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 items-stretch">
          {SERVICES_DATA.map((service, index) => {
            // Balanced composition: Row 1 has 3 equal columns (col-span-2 each); Row 2 has 2 equal columns (col-span-3 each)
            const colSpanClass =
              index < 3
                ? 'lg:col-span-2'
                : index === 4
                  ? 'md:col-span-2 lg:col-span-3'
                  : 'md:col-span-1 lg:col-span-3';

            return (
              <Reveal
                key={service.index}
                variant="fade-up"
                staggerIndex={index + 1}
                className={cn('h-full flex flex-col', colSpanClass)}
              >
                <ServiceCard
                  index={service.index}
                  title={service.title}
                  category={service.category}
                  description={service.description}
                  deliverables={service.deliverables}
                  icon={service.icon}
                  onExploreClick={() => onCtaClick?.(service.title)}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

