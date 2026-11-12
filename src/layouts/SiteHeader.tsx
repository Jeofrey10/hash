import React from 'react';
import { Navigation, type NavItem } from '@/components/navigation/Navigation';

export interface SiteHeaderProps {
  readonly navItems?: readonly NavItem[];
  readonly ctaText?: string;
  readonly onCtaClick?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  navItems,
  ctaText,
  onCtaClick,
}) => {
  return (
    <Navigation
      items={navItems}
      ctaText={ctaText}
      onCtaClick={onCtaClick}
    />
  );
};

