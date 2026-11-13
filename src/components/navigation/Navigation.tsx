import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { HashFullLogo } from '@/components/ui/HashFullLogo';
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
          'fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,box-shadow] duration-300 ease-out',
          'px-4 sm:px-8 lg:px-12 pt-4 pointer-events-none',
          className,
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Main Floating Glass Bar */}
          <nav
            aria-label="Main Navigation"
            className={cn(
              'pointer-events-auto flex items-center justify-between w-full lg:w-fit lg:mx-auto gap-4 sm:gap-8',
              'px-4 sm:px-6 h-[56px] rounded-2xl transition-[background-color,border-color,box-shadow] duration-300 ease-out',
              isScrolled
                ? 'bg-[var(--glass-bg-floating)] backdrop-blur-md border border-[var(--border-medium)] shadow-[var(--shadow-floating)]'
                : 'bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--border-subtle)] shadow-[var(--shadow-card)]',
            )}
          >
            {/* Brand Logo */}
            <a
              href="/"
              aria-label="HASH.DEVS Homepage"
              className="flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] rounded py-1"
            >
              <HashFullLogo
                className="h-6 sm:h-7 w-auto text-[var(--text-primary)]"
                aria-hidden="true"
              />
              <span className="sr-only">HASH.DEVS</span>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-6 list-none p-0 m-0">
              {items.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1.5 py-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Actions: Theme Switcher & CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeSwitcher id="desktop-theme-switcher" size="sm" />
              <PrimaryButton size="sm" onClick={onCtaClick}>
                {ctaText}
              </PrimaryButton>
            </div>

            {/* Mobile Actions: Theme Switcher & Hamburger Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeSwitcher id="mobile-theme-switcher" size="md" />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label="Open navigation menu"
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-medium)] text-[var(--text-primary)] hover:border-[var(--border-active)] hover:bg-[var(--state-hover-glass)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] cursor-pointer select-none transition-all duration-200"
              >
                <span
                  className={cn(
                    'w-5 h-[2px] bg-current rounded-full transition-transform duration-300 ease-out origin-center',
                    mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : '',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'w-5 h-[2px] bg-current rounded-full transition-opacity duration-200 ease-out',
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'w-5 h-[2px] bg-current rounded-full transition-transform duration-300 ease-out origin-center',
                    mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : '',
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
        items={items}
        ctaText={ctaText}
        onCtaClick={onCtaClick}
        triggerRef={menuButtonRef}
      />
    </>
  );
};
