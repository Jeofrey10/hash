import { useState, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SiteLayout } from '@/layouts/SiteLayout';
import { HeroSection } from '@/sections/HeroSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { ApproachSection } from '@/sections/ApproachSection';
import { CapabilitiesSection } from '@/sections/CapabilitiesSection';
import { ContactSection } from '@/sections/ContactSection';
import { Preloader } from '@/components/ui/Preloader';

// Lazy-load the ConsultationModal so its dialog and form dependencies only bundle when needed
const ConsultationModal = lazy(() =>
  import('@/components/ui/ConsultationModal').then((mod) => ({ default: mod.ConsultationModal }))
);

export default function App() {
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleOpenConsultation = useCallback((serviceTitle?: string | unknown) => {
    setSelectedService(typeof serviceTitle === 'string' ? serviceTitle : null);
    setCtaModalOpen(true);
  }, []);

  const handleCloseConsultation = useCallback(() => {
    setCtaModalOpen(false);
    setSelectedService(null);
  }, []);

  return (
    <ThemeProvider>
      <Preloader />
      <SiteLayout onCtaClick={handleOpenConsultation}>
        <HeroSection onCtaClick={handleOpenConsultation} />
        <ServicesSection onCtaClick={handleOpenConsultation} />
        <ApproachSection onCtaClick={handleOpenConsultation} />
        <CapabilitiesSection onCtaClick={handleOpenConsultation} />
        <ContactSection />
      </SiteLayout>

      {/* Accessible Project Consultation Inbound Modal */}
      {ctaModalOpen && (
        <Suspense fallback={null}>
          <ConsultationModal
            isOpen={ctaModalOpen}
            onClose={handleCloseConsultation}
            serviceTitle={selectedService}
          />
        </Suspense>
      )}
    </ThemeProvider>
  );
}
