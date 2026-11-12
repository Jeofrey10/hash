# HASH.DEVS — Requirements Specification

## 1. Functional Requirements

### 1.1 Responsive-First Viewing
- The website must provide an impeccable layout across standard viewports:
  - Mobile (360px – 430px)
  - Tablet (768px – 1024px)
  - Desktop (1280px – 1440px)
  - Ultra-wide (1920px+)
- Layout shifts (CLS) must be near zero during initial page load and device rotation.

### 1.2 Core Service Presentations
- Must present all five official service offerings with clarity:
  1. Website Development
  2. Application Development
  3. SEO Optimization
  4. Meta Advertising
  5. Creative Design & Video
- Each offering must communicate its tangible business value and technical deliverable.

### 1.3 Navigation & Information Flow
- Streamlined header navigation providing frictionless jumping to key sections.
- Mobile drawer / menu supporting fluid touch interactions.
- Clear primary call-to-action (CTA) guiding prospective clients toward starting a project or consultation.

### 1.4 Web Performance
- First Contentful Paint (FCP) < 1.0s on broadband.
- Largest Contentful Paint (LCP) < 2.0s.
- Clean production bundle footprint with zero unreferenced libraries.

---

## 2. Visual & Aesthetic Requirements

### 2.1 Brand Identity Adherence
- Base canvas must be Obsidian Black (`#050505`).
- Strategic, high-signal usage of Hash Neon Green (`#35E85B`).
- High-contrast text using Pure White (`#FFFFFF`).
- Structural framing and surfaces utilizing Graphite (`#171A18`).
- Absolute prohibition against warm, beige, or muddy tones.

### 2.2 Editorial & Cinematic Compositions
- Wide full-bleed marquee hero conveying technical caliber and creative precision.
- Subtle atmospheric depth (dark gradients, vignette overlays, glassmorphic refraction).
- Restrained, purposeful micro-interactions with hardware-accelerated transitions.

### 2.3 Glassmorphism Standard
- Semi-transparent graphite surfaces with `backdrop-filter: blur(16px)` and 1px crisp borders (`rgba(255, 255, 255, 0.08)`).
- Layered elevation with subtle drop shadows to create tactile separation without visual noise.

---

## 3. Accessibility & Usability (WCAG 2.1 AA)

- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Contrast ratios exceeding 4.5:1 for standard body text and 3:1 for large display headings.
- Keyboard navigability with visible, focused outlines on all interactive elements.
- Screen-reader accessible metadata (`aria-label`, descriptive alt attributes on images).

---

## 4. Factual Integrity & Content Boundaries

- Source of Truth: Strictly Hash.Devs company documentation.
- NO fictitious client logos, fabricated reviews, or invented statistics.
- Genuine messaging aligned with: *"Build with purpose. Grow with clarity."*

---

## 5. Engineering & Tooling Requirements

- Vite build pipeline supporting ultra-fast HMR and tree-shaking.
- TypeScript strict mode enabled with no implicit `any`.
- Tailwind CSS v4 styling with zero runtime CSS overhead.
- Playwright E2E automated testing for Chromium desktop and mobile viewport configurations.
- Inspo MCP integrated for ongoing design inspection and benchmark validation.
