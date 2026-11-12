# HASH.DEVS — Development Checklist & Progress Tracker

## Stage 01: Project Foundation & Environment Setup

- [x] **Workspace Environment Audit**
  - [x] Inspect root directory and verify starting state (clean empty directory).
  - [x] Check Node.js runtime (`v22.20.0`), npm (`10.9.3`), and Git (`2.51.0`).
- [x] **Project Initialization**
  - [x] Initialize modern React 19 + TypeScript + Vite 8 project.
  - [x] Configure Tailwind CSS v4 via `@tailwindcss/vite` and `@theme`.
  - [x] Configure `@/*` path alias mapping in `vite.config.ts` and `tsconfig.app.json`.
  - [x] Establish initial project structure (`src/components`, `src/sections`, `src/hooks`, `src/layouts`, `src/styles`, `src/lib`, `src/types`, `public/images`, `public/videos`, `public/fonts`, `tests/e2e`).
- [x] **Design Token Architecture**
  - [x] Encode Hash.Devs brand palette into `src/styles/tokens.css` (Obsidian `#050505`, Neon Green `#35E85B`, Pure White `#FFFFFF`, Graphite `#171A18`).
  - [x] Integrate tokens into Tailwind theme in `src/styles/globals.css`.
  - [x] Create domain types in `src/types/index.ts`.
- [x] **Inspo MCP Integration**
  - [x] Execute `npx -y inspo-mcp install`.
  - [x] Verify MCP tool connectivity in Antigravity (`inspo` tool server tested with `generalintelligencecompany-com`).
- [x] **Playwright Environment**
  - [x] Install `@playwright/test` and install Chromium browser binaries.
  - [x] Configure `playwright.config.ts` with desktop (1440x900) and mobile (Pixel 7) viewports.
  - [x] Configure automated dev server startup (`webServer`).
  - [x] Implement E2E smoke test in `tests/e2e/foundation.spec.ts`.
  - [x] Execute Playwright test suite and verify 4/4 passing tests with screenshot artifact generated.
- [x] **Documentation System**
  - [x] Create `PROJECT.md`, `DESIGN.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `IMPLEMENTATION.md`, `TASK.md`, `TESTING.md`, `SECURITY.md`, `README.md`.
- [x] **Stage 01 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] E2E test verification (`npm run test:e2e` exits 0).
  - [x] All restrictions honored (no premature homepage or hero sections created).

---

## Stage 02: Reference Website Analysis & Design Intelligence Extraction

- [x] **Inspo MCP Extraction**
  - [x] Query `get_design_system` for `generalintelligencecompany-com` (palette, fonts, macrostructure, CSS variables).
  - [x] Query `get_screen` for high-resolution captures, autopsy analysis, and design tags.
- [x] **Playwright Browser Live Inspection**
  - [x] Inspect desktop (`1440x900`), laptop (`1280x800`), tablet (`768x1024`), mobile (`390x844`), and small mobile (`360x800`).
  - [x] Capture initial hero viewports and full-page screenshots across all viewports.
  - [x] Extract exact DOM computed styles for navigation, glass cards, buttons, headings, and section containers.
  - [x] Verify responsive adaptations (hamburger collapse, card stacking, zero horizontal overflow).
  - [x] Save raw machine-readable data in `tests/e2e/screenshots/reference-analysis/inspection-data.json`.
  - [x] Save all 14 visual screenshot artifacts in `tests/e2e/screenshots/reference-analysis/`.
- [x] **Design Translation & Decision Documentation**
  - [x] Author `REFERENCE_ANALYSIS.md` (complete section inventory, exact measurements, glassmorphism recipes).
  - [x] Author `DESIGN_TRANSLATION.md` (adopt vs. adapt vs. avoid, HASH.DEVS translation).
  - [x] Author `DESIGN_DECISIONS.md` (concrete rules for layout, typography, colors, surfaces, spacing, responsiveness, animation).
- [x] **Quality & Regression Check**
  - [x] Verify existing build (`npm run build`) exits 0.
  - [x] Verify existing E2E test suite (`npm run test:e2e`) passes 4/4 tests.
  - [x] Confirm no premature code or section implementations were added.

---

## Stage 03: Design System Finalization & Core Component Specification

- [x] **Review & Documentation Cross-Referencing**
  - [x] Audit `DESIGN.md`, `REFERENCE_ANALYSIS.md`, `DESIGN_TRANSLATION.md`, `DESIGN_DECISIONS.md`, `PROJECT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`.
  - [x] Resolve inconsistencies and finalize single source of truth.
- [x] **Brand Design Token Finalization**
  - [x] Preserve core palette (Obsidian Black `#050505`, Hash Neon Green `#35E85B`, Pure White `#FFFFFF`, Graphite `#171A18`).
  - [x] Define supporting colors (muted, secondary, subtle borders, elevated surfaces, disabled states, feedback colors).
  - [x] Formalize surface system (canvas, secondary, card, graphite glass, elevated).
  - [x] Synchronize tokens with `src/styles/tokens.css` and `src/styles/globals.css`.
- [x] **Typography System Definition**
  - [x] Define display, section heading, card/subheading, feature, body, caption/meta, overline, and button typography.
  - [x] Specify font families, weights, desktop/tablet/mobile sizing, line heights, letter spacings, and max readable line lengths.
- [x] **Spacing, Grid & Layout System**
  - [x] Define container max-width (`1440px`), responsive gutters (`px-5`, `px-8`, `px-12`, `px-16`), and section vertical padding (`py-16`, `py-24`, `py-32`).
  - [x] Formalize responsive grid column and gap configurations for 5 core services.
- [x] **Motion & Interaction Principles**
  - [x] Author `MOTION_GUIDELINES.md` with trigger, duration, easing, transform/opacity, and reduced-motion specifications.
- [x] **Core UI Component Specifications**
  - [x] Author `COMPONENT_SPECIFICATIONS.md` detailing all 10 core UI components with TypeScript prop interfaces, variants, states, responsive behavior, and accessibility requirements.
- [x] **Accessibility & Responsive Standards**
  - [x] Document WCAG 2.1 AA compliance, color contrast ratios (11.4:1+), keyboard navigation, focus states, and minimum 44px touch targets.
- [x] **Master Documentation Updates**
  - [x] Author `DESIGN_SYSTEM.md`.
  - [x] Author `COMPONENT_SPECIFICATIONS.md`.
  - [x] Author `MOTION_GUIDELINES.md`.
  - [x] Update `DESIGN.md`.
  - [x] Update `README.md`.
- [x] **Stage 03 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] E2E test verification (`npm run test:e2e` exits 0).
  - [x] All restrictions honored (design system preparation only, zero premature homepage code).

---

## Stage 04: Core UI Component Implementation & Layout Shell

- [x] **Core UI Primitives Implementation (`src/components/ui/`)**
  - [x] `PrimaryButton`: Neon Green background, Obsidian text, hover glow, disabled states, optional full-width and loading spinner.
  - [x] `SecondaryButton`: Translucent Graphite glass, white text, subtle border, hover highlights.
  - [x] `GlassPanel`: Standard, elevated, and interactive variants with backdrop-blur and restrained shadows.
  - [x] `StatusBadge`: Live status indicator with pulse animation and reduced-motion fallback.
  - [x] `SectionHeading`: Standardized composition with overline, display H2, and subtitle.
  - [x] `ServiceCard`: Data-driven service card displaying the 5 official Hash.Devs offerings with deliverable chips.
  - [x] `ImageRevealContainer`: Aspect-ratio preservation, shimmer loading placeholder, and dark vignette overlay.
  - [x] `MarqueeStrip`: Continuous horizontal ticker with edge fade masks, pause on hover, and reduced-motion fallback.
  - [x] `FooterLinkGroup`: Reusable categorized link column with accessible keyboard navigation.
- [x] **Navigation & Layout Shell Implementation (`src/components/navigation/`, `src/layouts/`)**
  - [x] `Navigation`: Desktop floating pill navbar with scroll-aware glass surface and brand logo.
  - [x] `MobileNavigation`: Accessible full-screen mobile drawer with focus trap, body scroll lock, and Escape key listener.
  - [x] `SiteHeader`: Persistent global header wrapper.
  - [x] `SiteFooter`: Semantic footer with brand summary, status badge, categorized links, and copyright bar.
  - [x] `SiteLayout`: Global application shell with semantic landmarks, accessible skip-link, and main content slot.
- [x] **Accessibility, Motion & Quality Verification**
  - [x] Keyboard navigation and visible focus rings on all interactive elements.
  - [x] Automated WCAG contrast verification on actual rendered colors (21:1 on headings, 13.8:1 on primary CTA).
  - [x] Tested across 5 viewports (1440px, 1280px, 768px, 390px, 360px) with zero horizontal overflow.
  - [x] `prefers-reduced-motion` override verified via Playwright emulation.
  - [x] Zero unhandled console errors during full interaction.
  - [x] Screenshots generated and saved in `tests/e2e/screenshots/stage-04/`.
- [x] **Stage 04 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] Playwright E2E suite passes 21/21 active tests (`npm run test:e2e` exits 0).
  - [x] No premature homepage or section implementations created.

---

## Stage 05: Cinematic Hero Section Implementation

- [x] **Hero Architectural Implementation (`src/sections/HeroSection.tsx`)**
  - [x] Create dedicated, modular `HeroSection` component.
  - [x] Exactly one primary H1: "Build with purpose. Grow with clarity." in editorial typography.
  - [x] Brand presence: StatusBadge overline ("Digital Experience Studio"), Obsidian Black canvas (`#050505`), and Hash Neon Green accent (`#35E85B`).
  - [x] Verified supporting company mission copy from `PROJECT.md` without fabricated claims.
  - [x] Dual call to actions using `PrimaryButton` ("Start a Project" -> `#contact`) and `SecondaryButton` ("Explore Our Services" -> `#services`).
  - [x] Floating dimensional capabilities card featuring the 5 official Hash.Devs offerings with live status indicator.
  - [x] Pure CSS/SVG atmospheric composition (ambient radial green glow, technical coordinate markers, geometric grid lines, no heavy 3D/WebGL bloat).
- [x] **Motion & Entrance Sequences**
  - [x] Sequential staggered entrance sequence (`animate-hero-1` through `animate-hero-5`) utilizing hardware-accelerated transform & opacity.
  - [x] Full `prefers-reduced-motion` override turning off animation and translations.
- [x] **Application Integration**
  - [x] Integrate cleanly into `App.tsx` wrapped in `SiteLayout`.
  - [x] Support `#contact` project consultation dialog callback.
  - [x] Zero extraneous homepage sections built (strict hero scope preserved).
- [x] **Playwright E2E Validation (`tests/e2e/hero.spec.ts`)**
  - [x] Exactly one H1 verified.
  - [x] Verified both CTAs with destinations `#contact` and `#services`.
  - [x] Verified all 5 capabilities in anchor card.
  - [x] Verified zero horizontal overflow across 5 viewports (1440px, 1280px, 768px, 390px, 360px).
  - [x] Verified headline does not clip.
  - [x] Verified reduced motion mode turns off animations.
  - [x] Verified zero browser console errors.
  - [x] Generated all 6 responsive screenshots in `tests/e2e/screenshots/stage-05/`.
- [x] **Stage 05 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] Full Playwright E2E suite passes 33/33 active tests (`npm run test:e2e` exits 0).

---

## Stage 05.1: Hero Detail Correction (Factual Accuracy)

- [x] **Replace Geographic Coordinate Marker**
  - [x] Replace `LOC // 40.7128° N, 74.0060° W` in `src/sections/HeroSection.tsx` with non-geographic technical node identifier: `NODE // HD.CORE.01`.
  - [x] Preserved existing typography, styling, position, and subtle opacity.
  - [x] Removed all geographic and NYC references.
- [x] **Verify Project Availability Status**
  - [x] Reviewed source documentation (`PROJECT.md`, `types/index.ts`, `REQUIREMENTS.md`).
  - [x] Confirmed specific availability claims ("Available for new projects" / "Capacity: Available" / "Available for Q1/Q2 Projects") are not explicitly in the company profile.
  - [x] Replaced with verified neutral, non-promissory label: `Digital Experience Studio`.
  - [x] Updated in `src/sections/HeroSection.tsx` (anchor card status) and `src/layouts/SiteFooter.tsx` (`StatusBadge`).
- [x] **Verification & Test Suite**
  - [x] Confirmed zero visual layout or typography regressions.
  - [x] Updated `tests/e2e/hero.spec.ts` asserting presence of `NODE // HD.CORE.01` and absence of geographic coordinates.
  - [x] `npm run build` passes with zero errors.
  - [x] `npm run test:e2e` passes 33/33 tests across Desktop & Mobile Chromium.
  - [x] Captured updated screenshots in `tests/e2e/screenshots/stage-05/`.

---

## Stage 06: Services Section Implementation

- [x] **Services Architectural Implementation (`src/sections/ServicesSection.tsx`)**
  - [x] Create dedicated, modular `ServicesSection` component with `id="services"` and `scroll-mt-24 lg:scroll-mt-28` anchor offset.
  - [x] Section Introduction: Editorial overline `WHAT WE DO`, strong heading `"Integrated capabilities for connected digital growth."`, and verified supporting description.
  - [x] All 5 official HASH.DEVS disciplines rendered with exact naming and indexes:
    1. `01 // Website Development` (Engineering)
    2. `02 // Application Development` (Software)
    3. `03 // SEO Optimization` (Growth)
    4. `04 // Meta Advertising` (Media)
    5. `05 // Creative Design & Video` (Creative)
  - [x] Disciplines populated with verified capability descriptions and focus/deliverables directly grounded in `PROJECT.md`.
  - [x] Responsive balanced grid layout:
    - Desktop (>=1024px): 6-column grid (3 cards top row at `col-span-2`, 2 cards bottom row at `col-span-3`).
    - Tablet (768px–1023px): 2-column grid (2 cards top row, 2 cards middle row, 1 card bottom row at `col-span-2`).
    - Mobile (<768px): Single-column stack with comfortable padding and no horizontal overflow.
  - [x] Pure SVG minimalist line iconography for all 5 disciplines.
  - [x] Subtle atmospheric background: technical grid, coordinate markers `SEC // 02.SERVICES` and `DISCIPLINE // 05.CORE`, and subtle radial glow.
- [x] **Interactions, Motion & Accessibility**
  - [x] Interactive card hover state with top neon line accent and smooth translate-x arrow affordance.
  - [x] Keyboard focus visible outlines (`focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]`).
  - [x] Full consultation modal trigger integration (`onCtaClick` / Enter / Space key).
  - [x] `prefers-reduced-motion: reduce` fully respected with instantaneous transitions.
- [x] **Application Integration (`src/App.tsx`)**
  - [x] Mounted cleanly immediately following `HeroSection` within `SiteLayout`.
  - [x] Hero CTA `Explore Our Services` -> `#services` navigation and floating navigation link tested and verified.
- [x] **Playwright E2E Test Suite (`tests/e2e/services.spec.ts`)**
  - [x] Section rendering, ID `#services`, and exactly 5 service cards verified.
  - [x] Hero CTA and Navigation anchor links verified.
  - [x] Keyboard focus and dialog activation verified.
  - [x] Zero horizontal overflow verified across 5 viewports (1440px, 1280px, 768px, 390px, 360px).
  - [x] Reduced motion preference verified.
  - [x] Zero browser console errors verified.
  - [x] 6 responsive screenshots captured and saved in `tests/e2e/screenshots/stage-06/`.
- [x] **Stage 06 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] Full Playwright E2E suite passes 47/47 active tests (`npm run test:e2e` exits 0).

---

## Stage 06.1: Service Card Interaction & Accessibility Check

- [x] **Semantic Native Interactive Control**
  - [x] Replaced fake `tabIndex={0}` and synthetic key handlers on non-interactive `<article>` with a native `<button type="button">` inside `ServiceCard.tsx`.
  - [x] Provided descriptive `aria-label="Inquire about [Service Title]"`.
  - [x] Maintained full-card click target using `after:absolute after:inset-0` with no nested interactive elements.
  - [x] Card container uses `focus-within:ring-2 focus-within:ring-[var(--brand-neon-green)]` for identical high-contrast focus rings.
- [x] **Accessible Consultation Dialog (`ConsultationModal.tsx`)**
  - [x] Dedicated modal component with `role="dialog"`, `aria-modal="true"`, and `aria-label="Project Consultation Inbound"`.
  - [x] Dynamically reflects the selected service title (e.g. `Inquire: Website Development`).
  - [x] Traps keyboard Tab focus within the dialog.
  - [x] Dismissible via close control button, top-right icon button, backdrop click, and `Escape` key.
  - [x] Background content is marked `aria-hidden="true"` while open, preventing background leakage.
  - [x] Restores focus back to the triggering card button upon closing.
- [x] **Playwright E2E Verification (`services.spec.ts`)**
  - [x] Validated semantic button count (5/5).
  - [x] Validated Enter and Space key activation opening service-specific dialogs.
  - [x] Validated Escape key closing and focus restoration.
  - [x] Full suite passes 47/47 active tests.

---

## Stage 06.2: Consultation Modal Accessibility Verification

- [x] **React Portal Placement (`#modal-root`)**
  - [x] Created dedicated `#modal-root` container directly inside `index.html` as a sibling to `#root`.
  - [x] Mounted `ConsultationModal` using React `createPortal` targeting `#modal-root`.
  - [x] Confirmed modal DOM tree is 100% outside all background landmarks (`#root`, `<header>`, `<main>`, `<footer>`).
- [x] **Background Isolation & Inert Mechanism**
  - [x] Applied `inert` attribute and `aria-hidden="true"` to `#root` upon modal mount.
  - [x] Background links, buttons, and landmarks are completely excluded from keyboard and mouse focus while modal is open.
  - [x] Verified `#modal-root` is never marked inert or aria-hidden.
- [x] **Screen Reader Accessibility & Focus Trapping**
  - [x] Dialog exposes `role="dialog"`, `aria-modal="true"`, and `aria-label="Project Consultation Inbound"`.
  - [x] Headings and controls are fully accessible to assistive technology queries.
  - [x] Two-way keyboard Tab trapping keeps focus strictly cycling inside the modal.
- [x] **Lifecycle-Safe Restoration & Cleanup**
  - [x] Captures `previousActiveElement` on open and restores focus to the exact triggering service button upon closing.
  - [x] `Escape` key dismisses modal and restores background state.
  - [x] Safe unmount cleanup removes `inert` and `aria-hidden` from `#root` without leaving stale attributes across repeated open/close cycles.
- [x] **Automated E2E Verification & Gates**
  - [x] Production build passes cleanly with zero errors (`npm run build`).
  - [x] Full Playwright suite passes 47/47 active tests (`npm run test:e2e`).

---

## Stage 06.3: Preserve Original Background Attributes

- [x] **Attribute State Capture & Dynamic Restoration**
  - [x] Captured exact pre-existing presence and string values of `inert` and `aria-hidden` on `#root` prior to modal mutation.
  - [x] Restores pre-existing `inert` value if present; completely removes `inert` if originally absent.
  - [x] Restores pre-existing `aria-hidden` value if present; completely removes `aria-hidden` if originally absent.
  - [x] Lifecycle-safe cleanup verified across React Strict Mode effect cycles and repeated openings.
- [x] **Automated Verification (`services.spec.ts`)**
  - [x] Tested restoration from initially unmodified root baseline.
  - [x] Tested restoration from root with pre-existing `inert="pre-existing-inert"` and `aria-hidden="custom-hidden-value"`.
  - [x] Full test suite passes 49/49 active tests across Desktop & Mobile.

---

## Stage 07: Global Animation Engineering & Motion System

- [x] **Global Motion Architecture & Tokens**
  - [x] Created `src/styles/motion.css` containing timing tokens, easing functions (`cubic-bezier(0.16, 1, 0.3, 1)`), keyframes, utility classes, and reduced motion overrides.
  - [x] Integrated `motion.css` into `src/styles/globals.css`.
- [x] **Motion Hooks Implementation (`src/hooks/`)**
  - [x] `useReducedMotion.ts`: Dynamic live listener on `prefers-reduced-motion: reduce`.
  - [x] `useScrollReveal.ts`: Configurable IntersectionObserver hook with threshold, rootMargin, once, and guaranteed fallback timeout to prevent permanently hidden content.
- [x] **Motion Primitives Implementation (`src/components/motion/`)**
  - [x] `Reveal.tsx`: Reusable entrance wrapper supporting `fade-up`, `fade-in`, `slide-left`, `slide-right`, and stagger delays.
  - [x] `TextReveal.tsx`: Line-masked editorial text reveal preserving semantic headings and full screen reader accessibility.
  - [x] `ImageReveal.tsx`: Aspect ratio preserving container with shimmer loading and subtle unmask scale animation.
  - [x] `index.ts`: Barrel export.
- [x] **Micro-Interactions Integration**
  - [x] `ServicesSection`: Staggered card entrance reveal and editorial text reveal on section header.
  - [x] `ConsultationModal`: Smooth `animate-dialog-enter` scale pop-in.
  - [x] `MobileNavigation`: Smooth `animate-drawer-slide` slide-down entrance.
  - [x] Preserved all approved copy, brand colors, and component layouts.
- [x] **Accessibility & Reduced Motion**
  - [x] Full `prefers-reduced-motion: reduce` compliance across CSS and React hooks.
  - [x] Instant zero-delay transitions with zero translate transforms when reduced motion is preferred.
- [x] **E2E Test Verification (`tests/e2e/motion.spec.ts`)**
  - [x] Validated scroll reveals, text reveal semantics, modal dialog entrance, mobile menu drawer, card hover, zero console errors, and zero horizontal overflow across 5 standard viewports (360px, 390px, 768px, 1280px, 1440px).
  - [x] Captured all 7 required screenshots in `tests/e2e/screenshots/stage-07/`.
  - [x] Full test suite passes 67/67 active tests across Chromium desktop and mobile.

---

## Upcoming Stages

- [ ] **Stage 08 — Interactive Contact & Project Initiation Section (`#contact`)**
- [ ] **Stage 09 — Final QA, Cross-Browser Audit & Deployment Readiness**
