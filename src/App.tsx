import { useState } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { HeroSection } from '@/sections/HeroSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { ConsultationModal } from '@/components/ui/ConsultationModal';

export default function App() {
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleOpenConsultation = (serviceTitle?: string) => {
    setSelectedService(serviceTitle || null);
    setCtaModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setCtaModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <SiteLayout onCtaClick={() => handleOpenConsultation()}>
        <HeroSection onCtaClick={() => handleOpenConsultation()} />
        <ServicesSection onCtaClick={(serviceTitle) => handleOpenConsultation(serviceTitle)} />
      </SiteLayout>

      {/* Accessible Project Consultation Inbound Modal */}
      <ConsultationModal
        isOpen={ctaModalOpen}
        onClose={handleCloseConsultation}
        serviceTitle={selectedService}
      />
    </>
  );
}
