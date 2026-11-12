import { useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import {
  PrimaryButton,
  SecondaryButton,
  GlassPanel,
  StatusBadge,
  SectionHeading,
  ServiceCard,
  MarqueeStrip,
} from '@/components/ui';

const SERVICES_DATA = [
  {
    index: '01',
    title: 'Website Development' as const,
    description:
      'High-performance, cinematic, and responsive web platforms engineered for lightning speed, technical SEO, and conversion excellence.',
    deliverables: ['Custom Web Architecture', 'Headless CMS', 'Core Web Vitals'],
  },
  {
    index: '02',
    title: 'Application Development' as const,
    description:
      'Scalable web and cross-platform applications engineered with robust infrastructure and intuitive user interfaces.',
    deliverables: ['Full-Stack Systems', 'Interactive Dashboards', 'API Architecture'],
  },
  {
    index: '03',
    title: 'SEO Optimization' as const,
    description:
      'Technical, architectural, and content-driven search engine optimization to secure long-term organic visibility and qualified inbound traffic.',
    deliverables: ['Technical Audits', 'Structured Schema', 'Performance Tuning'],
  },
  {
    index: '04',
    title: 'Meta Advertising' as const,
    description:
      'High-converting paid acquisition funnels and data-backed ad strategies across Meta platforms to maximize ROI and customer acquisition.',
    deliverables: ['Funnel Architecture', 'Conversion API', 'Creative Testing'],
  },
  {
    index: '05',
    title: 'Creative Design & Video' as const,
    description:
      'Distinctive visual identities, high-fidelity UI/UX design systems, and cinematic video storytelling that communicate clarity and technical authority.',
    deliverables: ['Design Systems', 'UI/UX Prototyping', 'Motion & Video'],
  },
];

const MARQUEE_ITEMS = [
  { id: '1', label: 'Website Development' },
  { id: '2', label: 'Application Development' },
  { id: '3', label: 'SEO Optimization' },
  { id: '4', label: 'Meta Advertising' },
  { id: '5', label: 'Creative Design & Video' },
  { id: '6', label: 'React 19 & TypeScript' },
  { id: '7', label: 'Tailwind CSS v4' },
  { id: '8', label: 'Playwright E2E' },
];

export default function App() {
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  return (
    <SiteLayout onCtaClick={() => setCtaModalOpen(true)}>
      {/* Component & Layout Verification Showcase */}
      <section className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* Foundation & Architecture Status Header */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <StatusBadge
              status="active"
              label="Stage 04 UI Architecture Verified"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--brand-pure-white)] leading-[1.1]">
            HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-normal">
            Build with purpose. Grow with clarity.
          </p>
        </div>

        {/* Marquee Strip Component */}
        <div className="w-full">
          <MarqueeStrip items={MARQUEE_ITEMS} speed="medium" />
        </div>

        {/* Interactive Buttons Verification Grid */}
        <GlassPanel variant="standard" padding="lg" rounded="2xl" className="space-y-6">
          <SectionHeading
            overline="UI Primitives"
            title="Component System & Action States"
            description="Verified implementation of PrimaryButton, SecondaryButton, and GlassPanel variants."
          />
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <PrimaryButton onClick={() => setCtaModalOpen(true)}>
              Primary CTA
            </PrimaryButton>
            <PrimaryButton size="sm">Small Primary</PrimaryButton>
            <PrimaryButton size="lg">Large Primary</PrimaryButton>
            <PrimaryButton disabled>Disabled Primary</PrimaryButton>
            <SecondaryButton>Secondary Button</SecondaryButton>
            <SecondaryButton size="sm">Small Secondary</SecondaryButton>
            <SecondaryButton disabled>Disabled Secondary</SecondaryButton>
          </div>
        </GlassPanel>

        {/* 5 Core Services Verification Grid */}
        <div id="services" className="space-y-8">
          <SectionHeading
            overline="Core Capabilities"
            title="Digital Services Architecture"
            description="All five core services represented via data-driven ServiceCard components with interactive glassmorphism."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES_DATA.map((service) => (
              <ServiceCard
                key={service.index}
                index={service.index}
                title={service.title}
                description={service.description}
                deliverables={service.deliverables}
                onExploreClick={() => setCtaModalOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Verification Modal for CTA click */}
      {ctaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project Consultation Inbound"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <GlassPanel
            variant="elevated"
            padding="lg"
            rounded="2xl"
            className="max-w-md w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200"
          >
            <StatusBadge status="active" label="Inbound Channel Active" />
            <h3 className="text-2xl font-semibold text-white">Start a Project</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Stage 04 component foundation is active. Full interactive project consultation workflow will be wired in upcoming section stages.
            </p>
            <PrimaryButton fullWidth onClick={() => setCtaModalOpen(false)}>
              Close Dialog
            </PrimaryButton>
          </GlassPanel>
        </div>
      )}
    </SiteLayout>
  );
}
