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
| **Stage 02** | **Reference Website Analysis** | In-depth analysis of *The General Intelligence Company* via Inspo MCP and Playwright; layout, typography, glassmorphism analysis | *Ready to Begin* |
| **Stage 03** | **Core UI Primitive Components** | Build reusable UI primitives: `GlassPanel`, `Button`, `Badge`, `Container`, navigation headers | *Pending* |
| **Stage 04** | **Section-by-Section Engineering** | Full-bleed marquee hero, 5-service showcase, brand narrative, and contact CTA | *Pending* |
| **Stage 05** | **Micro-Interactions & Responsive Polish** | Smooth transitions, mobile drawer navigation, viewport testing | *Pending* |
| **Stage 06** | **Quality Assurance & Production Release** | Full Playwright E2E test runs, Lighthouse audit, production bundle optimization | *Pending* |

---

## 3. Strict Pre-Commit Verification Gate

Before any stage is considered complete or pushed:
1. `npm run build` must succeed with **zero errors and zero warnings**.
2. `npm run test:e2e` must pass with all desktop and mobile viewport checks green.
3. No fake business claims or mock clients added.
