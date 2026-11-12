import { useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { HeroSection } from '@/sections/HeroSection';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function App() {
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  return (
    <SiteLayout onCtaClick={() => setCtaModalOpen(true)}>
      <HeroSection onCtaClick={() => setCtaModalOpen(true)} />

      {/* Project Consultation Inbound Modal */}
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
              Hero Section is active. The full dedicated interactive contact section will be connected in upcoming stages.
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
