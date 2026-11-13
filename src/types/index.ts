/**
 * HASH.DEVS Brand & Service Domain Types
 * Source of truth: Hash.Devs Company Profile
 */

export type ServiceOffering =
  | 'Website Development'
  | 'Application Development'
  | 'SEO Optimization'
  | 'Meta Advertising'
  | 'Creative Design & Video';

export interface BrandTokens {
  readonly obsidianBlack: '#050505';
  readonly hashNeonGreen: '#35E85B';
  readonly pureWhite: '#FFFFFF';
  readonly graphite: '#171A18';
}

export interface CompanyIdentity {
  readonly name: 'HASH.DEVS';
  readonly tagline: 'Build with purpose. Grow with clarity.';
  readonly mission: 'Connected digital experiences that help businesses get discovered, communicate their value and convert visitors into customers.';
  readonly services: readonly ServiceOffering[];
}

export const COMPANY_IDENTITY: CompanyIdentity = {
  name: 'HASH.DEVS',
  tagline: 'Build with purpose. Grow with clarity.',
  mission: 'Connected digital experiences that help businesses get discovered, communicate their value and convert visitors into customers.',
  services: [
    'Website Development',
    'Application Development',
    'SEO Optimization',
    'Meta Advertising',
    'Creative Design & Video',
  ],
} as const;

export * from './inquiry';

