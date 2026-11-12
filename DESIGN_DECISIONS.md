# HASH.DEVS — Concrete Design Decisions

This document formally records all engineering and design decisions that will govern the implementation in subsequent stages (Stage 03+). All decisions strictly align with [DESIGN.md](file:///c:/hash.devs/DESIGN.md) and [DESIGN_TRANSLATION.md](file:///c:/hash.devs/DESIGN_TRANSLATION.md).

---

## 1. Layout Principles

- **Maximum Content Container:** `max-w-[1440px]` centered horizontally with responsive side margins (`px-5 sm:px-8 lg:px-12`).
- **Section Composition:**
  - Every major section is a distinct semantic landmark (`<header>`, `<main>`, `<section>`, `<footer>`).
  - Hero section occupies full viewport height (`min-h-[100vh]` or `min-h-[900px]` on desktop).
  - Main services section uses an asymmetric or 2/3-column responsive card grid.
- **Visual Stacking:**
  - Header: `z-[100]` (fixed / sticky floating island).
  - Modal / Mobile Drawer: `z-[150]`.
  - Floating Hero Anchor Card: `z-[20]`.
  - Background Atmosphere: `z-[0]` / `z-[-1]`.

---

## 2. Typography Direction

- **Font Strategy:** Modern high-contrast editorial system stack for zero font loading latency and maximum rendering performance:
  - Display / Headlines: `font-sans` with `-0.03em` tight tracking and reduced line-height (`1.05`–`1.15`).
  - Body Copy: Clean system sans (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`), line-height `1.5`–`1.6`, neutral white `rgba(255, 255, 255, 0.72)`.
  - Monospace / Micro-labels: `font-mono` (`ui-monospace, SFMono-Regular, monospace`), tracking `0.08em` uppercase, font-size `11px`–`13px`.
- **Type Ramp:**
  - **Display H1:** `text-3xl sm:text-5xl lg:text-6xl` (`36px` -> `48px` -> `64px`), font-semibold, letter-spacing `-0.03em`.
  - **Section H2:** `text-2xl sm:text-3xl lg:text-4xl` (`28px` -> `36px` -> `44px`), font-medium, letter-spacing `-0.02em`.
  - **Card / Subheading H3:** `text-lg sm:text-xl` (`18px` -> `20px`), font-medium.
  - **Body Standard:** `text-sm sm:text-base` (`14px` -> `16px`), font-normal, line-height `1.6`.
  - **Overline / Pill Meta:** `text-xs` (`12px`), uppercase, tracking-wider, font-medium.

---

## 3. Color Usage & Token Rules

| Color Token | Value | Strict Usage Boundaries |
|---|---|---|
| **Obsidian Black** | `#050505` | Canvas background, body base, deep overlays. Never replaced by gray or white. |
| **Hash Neon Green** | `#35E85B` | Interactive CTA button fills, live signal dots, active border glows, brand mark accent dot. Reserved for high-value interactions. |
| **Pure White** | `#FFFFFF` | Primary headlines, active navigation labels, primary card titles. |
| **Graphite** | `#171A18` | Base tone for cards, elevated surfaces, borders, and input fields. |
| **Text Secondary** | `rgba(255, 255, 255, 0.72)` | Standard descriptive body text and service outlines. |
| **Text Muted** | `rgba(255, 255, 255, 0.45)` | Secondary timestamps, footnotes, and inactive navigation links. |
| **Border Subtle** | `rgba(255, 255, 255, 0.08)` | Default card and panel outlines. |
| **Border Glow** | `rgba(53, 232, 91, 0.35)` | Interactive focus states, hover borders on cards and buttons. |

---

## 4. Surface & Glassmorphism Rules

1. **Floating Navigation Island:**
   - Width: `w-fit` on desktop, max-width `680px`.
   - Surface: `background: rgba(23, 26, 24, 0.75)`.
   - Blur: `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)`.
   - Border: `1px solid rgba(255, 255, 255, 0.12)`.
   - Shadow: `0 4px 20px 0 rgba(0, 0, 0, 0.4)`.
   - Radius: `rounded-2xl` (16px) or `rounded-full`.
2. **Standard Glass Card (Services & Value Props):**
   - Surface: `background: rgba(23, 26, 24, 0.65)`.
   - Blur: `backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px)`.
   - Border: `1px solid rgba(255, 255, 255, 0.08)`.
   - Hover: Border shifts to `rgba(53, 232, 91, 0.3)` with subtle box-shadow `0 8px 32px rgba(53, 232, 91, 0.08)`.
   - Radius: `rounded-2xl` (16px).
3. **Pill Badges & Status Indicators:**
   - Surface: `background: rgba(255, 255, 255, 0.05)`.
   - Blur: `backdrop-filter: blur(8px)`.
   - Border: `1px solid rgba(255, 255, 255, 0.1)`.
   - Radius: `rounded-full` (9999px).

---

## 5. Spacing System

- **Macro Section Padding:**
  - Mobile (<768px): `py-16` (64px) to `py-20` (80px).
  - Tablet (768px–1024px): `py-24` (96px).
  - Desktop (1280px+): `py-32` (128px) to `py-40` (160px).
- **Component Gutters:**
  - Grid gaps: `gap-6` (24px) on mobile, `gap-8` (32px) on desktop.
  - Card internal padding: `p-6 sm:p-8`.

---

## 6. Responsive Principles

- **Mobile First Construction:**
  - All components must function gracefully on `360px` screens with zero horizontal overflow (`scrollWidth === clientWidth`).
  - Touch targets must meet or exceed `44px × 44px`.
- **Navigation Adaptation:**
  - On viewports < `1024px`, floating desktop nav bar collapses into a floating mobile header with a high-contrast toggle and full-screen glass drawer.
- **Card Stacking:**
  - Desktop multi-column grids convert into clean vertical stacks with uniform spacing.

---

## 7. Animation & Interaction Principles

- **Performance First:** All animations must utilize GPU-accelerated CSS properties (`transform`, `opacity`).
- **Timing & Curves:**
  - Interactive transitions: `200ms`–`300ms` using `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Micro-glows: Smooth fade on hover (`transition: border-color 0.25s, box-shadow 0.25s`).
- **Reduced Motion Support:**
  - All animations must respect `prefers-reduced-motion: reduce`.
- **Status Signal:**
  - Pulsing neon green dot (`@keyframes pulse` with scale and opacity pulse) next to live availability text.

