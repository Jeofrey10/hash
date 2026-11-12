import React from 'react';
import { cn } from '@/lib/utils';

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface FooterLinkGroupProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
  readonly className?: string;
}

export const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({
  title,
  links,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h4 className="font-mono text-xs uppercase tracking-widest text-white/50 font-semibold">
        {title}
      </h4>
      <ul className="space-y-2.5 list-none p-0 m-0">
        {links.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.href}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="text-sm text-white/70 hover:text-[var(--brand-neon-green)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

