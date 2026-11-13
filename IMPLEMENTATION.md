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
| **Stage 05.1** | **Hero Detail Correction (Factual Accuracy)** | Technical coordinate node identifier `NODE // HD.CORE.01` and non-promissory status labels | **COMPLETED** |
| **Stage 06** | **Services Section Implementation** | Dedicated `ServicesSection` (`#services`) with 5 confirmed digital disciplines, balanced 6-column grid, SVG line icons, interactive focus states, React portal modal, and background isolation | **COMPLETED** |
| **Stage 07** | **Global Animation Engineering & Motion System** | Centralized motion system (`motion.css`, `useScrollReveal`, `useReducedMotion`, `Reveal`, `TextReveal`, `ImageReveal`), micro-interactions polish, and comprehensive accessibility | **COMPLETED** |
| **Stage 08** | **Approach Section Implementation** | Dedicated `ApproachSection` (`#approach`) communicating the 4-phase transformation process (Discover, Define, Design & Build, Refine & Grow) with connected progression rail | **COMPLETED** |
| **Stage 09** | **Capabilities Section Implementation & Content Refinement** | Dedicated `CapabilitiesSection` (`#capabilities`) with 5 cross-disciplinary capability pillars ("What We Bring to the Work") separated from Services deliverables | **COMPLETED** |
| **Stage 10** | **Contact Section & Project Inquiry Experience** | Dedicated `ContactSection` (`#contact`) with accessible 4-step inquiry workflow, review & edit capabilities, robust validation, mockable typed submission adapter, and zero data loss on navigation or error | **COMPLETED** |
| **Stage 11** | **Footer & Homepage Integration** | Global footer redesign, cross-section navigation cohesion, and homepage integration | *Pending* |

---

## 3. Section Anchor Contracts
- `#hero`: Anchors the primary full-bleed hero fold.
- `#services`: Destination for services showcase (`ServicesSection`), featuring the 5 confirmed disciplines.
- `#approach`: Destination for strategic methodology & narrative section (`ApproachSection`), featuring the 4-phase transformation process.
- `#capabilities`: Destination for cross-disciplinary expertise showcase (`CapabilitiesSection`), featuring the 5 foundational capability pillars and 20 core methods.
- `#contact`: Destination for primary conversion CTA ("Start a Project") and navigation link, anchoring the multi-step project inquiry experience (`ContactSection`).

---

## 4. Strict Pre-Commit Verification Gate

Before any stage is considered complete or pushed:
1. `npm run build` must succeed with **zero errors and zero warnings**.
2. `npm run test:e2e` must pass with all desktop and mobile viewport checks green.
3. No fake business claims or mock clients added.

