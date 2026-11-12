import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { cn } from '@/lib/utils';

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface NavigationProps {
  readonly brandName?: string;
  readonly items?: readonly NavItem[];
  readonly ctaText?: string;
  readonly onCtaClick?: () => void;
  readonly className?: string;
}

const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation: React.FC<NavigationProps> = ({
  items = DEFAULT_NAV_ITEMS,
  ctaText = 'Start a Project',
  onCtaClick,
  className,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out',
          'px-5 sm:px-8 lg:px-12 pt-4 pointer-events-none',
          className,
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Main Floating Glass Bar */}
          <nav
            aria-label="Main Navigation"
            className={cn(
              'pointer-events-auto flex items-center justify-between w-full lg:w-fit lg:mx-auto gap-8',
              'px-4 sm:px-6 h-[54px] rounded-2xl transition-all duration-300 ease-out',
              isScrolled
                ? 'bg-[var(--glass-bg-floating)] backdrop-blur-md border border-[var(--border-medium)] shadow-[var(--shadow-floating)]'
                : 'bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--border-subtle)] shadow-[var(--shadow-card)]',
            )}
          >
            {/* Brand Logo */}
            <a
              href="/"
              className="font-semibold text-lg sm:text-xl tracking-tight text-[var(--brand-pure-white)] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded"
            >
              HASH<span className="text-[var(--brand-neon-green)]">.</span>DEVS
            </a>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-6 list-none p-0 m-0">
              {items.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-[14px] font-medium text-white/75 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA Action */}
            <div className="hidden lg:flex items-center">
              <PrimaryButton size="sm" onClick={onCtaClick}>
                {ctaText}
              </PrimaryButton>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.10] text-white hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={items}
        ctaText={ctaText}
        onCtaClick={onCtaClick}
      />
    </>
  );
};

