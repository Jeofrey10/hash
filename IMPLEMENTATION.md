# HASH.DEVS — Implementation Strategy & Conventions

## 1. Development Conventions

### 1.1 TypeScript Standards
- **Strict Mode:** Enabled across all modules. `any` is disallowed; use explicit union types, generics, or `unknown` where applicable.
- **Naming Conventions:**
  - Types / Interfaces: `PascalCase` (e.g., `ServiceOffering`, `BrandTokens`).
  - Components: `PascalCase` (e.g., `GlassPanel.tsx`).
  - Hooks: `camelCase` prefixed with `use` (e.g., `useViewport.ts`).
  - Utilities: `camelCase` (e.g., `cn.ts`, `formatters.ts`).
- **Props Typing:** Every component must declare a dedicated props interface extending standard React HTML attributes when applicable.

### 1.2 CSS & Tailwind Guidelines
- Rely on Tailwind utility classes and declared theme variables (`var(--brand-obsidian)`, `var(--brand-neon-green)`, etc.).
- Avoid arbitrary hardcoded magic values (e.g., `top-[137px]`); utilize design system steps (`4`, `8`, `12`, `16`, `24`, `32`).
- Glassmorphic panels must utilize shared utility classes or tokens to maintain uniform backdrop blur and border alpha.

### 1.3 Semantic HTML & Accessibility
- Maintain strict heading hierarchy (`h1` -> `h2` -> `h3`). Never skip heading levels for visual styling.
- All interactive elements must be focusable via keyboard with high-contrast `:focus-visible` styling.
- Buttons must use `<button type="button">`; links must use `<a href="...">`.

---

## 2. Multi-Stage Implementation Plan

| Stage | Title | Focus Area | Status |
|---|---|---|---|
| **Stage 01** | **Project Foundation & Environment Setup** | Vite + React + TS setup, Tailwind tokens, Playwright E2E configuration, Inspo MCP verification, architecture docs | **COMPLETED** |
| **Stage 02** | **Reference Website Analysis** | In-depth analysis of *The General Intelligence Company* via Inspo MCP and Playwright; layout, typography, glassmorphism analysis | **COMPLETED** |
| **Stage 03** | **Design System Finalization & Component Specs** | Design system token formalization, typography ramps, motion guidelines, 10-component specification catalog | **COMPLETED** |
| **Stage 04** | **Core UI Component Implementation & Layout Shell** | Implementation of 10 UI primitives (`PrimaryButton`, `SecondaryButton`, `GlassPanel`, `StatusBadge`, `SectionHeading`, `ServiceCard`, `ImageRevealContainer`, `MarqueeStrip`, `FooterLinkGroup`, `Navigation`, `MobileNavigation`, `SiteLayout`) | **COMPLETED** |
| **Stage 05** | **Cinematic Hero Section Implementation** | Dedicated `HeroSection` with dominant H1, verified brand mission, dual CTAs (`#contact`, `#services`), dimensional capabilities card, and CSS atmospheric depth | **COMPLETED** |
| **Stage 06** | **Section Engineering: Services, Approach & Contact** | 5-Pillar Service Showcase section, strategic brand narrative, and contact initiation workflow | *Ready to Begin* |
| **Stage 07** | **Micro-Interactions, Polish & QA** | Motion refinement, cross-browser validation, production audit | *Pending* |

---

## 3. Section Anchor Contracts
- `#hero`: Anchors the primary full-bleed hero fold.
- `#contact`: Destination for primary conversion CTA ("Start a Project"). Connected to inbound dialog in Stage 05, transitioning to full dedicated contact section in Stage 06.
- `#services`: Destination for secondary CTA ("Explore Our Services"). Connected to 5-pillar digital services showcase in Stage 06.
- `#approach`: Destination for strategic methodology & narrative section in Stage 06.
- `#capabilities`: Secondary link to capability highlights.

---

## 4. Strict Pre-Commit Verification Gate

Before any stage is considered complete or pushed:
1. `npm run build` must succeed with **zero errors and zero warnings**.
2. `npm run test:e2e` must pass with all desktop and mobile viewport checks green.
3. No fake business claims or mock clients added.

