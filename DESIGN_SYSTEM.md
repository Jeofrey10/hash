# HASH.DEVS — Design System Specification

## 1. System Overview & Philosophy

The HASH.DEVS Design System is engineered to deliver a cohesive, high-performance, and conversion-focused digital experience. Rooted in technical precision, architectural structure, and editorial authority, it blends deep atmospheric dark surfaces with high-signal neon accents.

- **Brand Essence:** Build with purpose. Grow with clarity.
- **Visual Direction:** Technical elegance, atmospheric depth, cinematic framing, editorial typography, and weightless glassmorphism.
- **Architectural Rules:** Zero arbitrary magic numbers, strict token inheritance, WCAG 2.1 AA accessibility compliance, and responsive-first execution.

---

## 2. Color System & Semantic Tokens

### 2.1 Core Brand Palette (Immutable Foundation)

| Token Name | CSS Variable | Hex Code | Purpose & Semantic Role |
|---|---|---|---|
| **Obsidian Black** | `--brand-obsidian` | `#050505` | Primary canvas background; creates infinite dark depth |
| **Hash Neon Green** | `--brand-neon-green` | `#35E85B` | Interactive signal, primary CTA fills, status indicators, focus rings |
| **Pure White** | `--brand-pure-white` | `#FFFFFF` | Primary high-contrast typography, crisp headlines, bright iconography |
| **Graphite** | `--brand-graphite` | `#171A18` | Structural framing, card backgrounds, modal backdrops |

---

### 2.2 Semantic Color Hierarchy

#### Surface & Background Tokens
- **Canvas Primary (`--bg-primary`):** `#050505` (Obsidian Black) — Base page body background.
- **Canvas Secondary (`--bg-secondary`):** `#0D0F0E` — Alternate subtle section background for visual rhythm.
- **Surface Graphite (`--bg-surface`):** `#171A18` — Base container background.
- **Surface Elevated (`--bg-surface-elevated`):** `#222623` — Hovered cards, flyout menus, tooltips.
- **Surface Card Base (`--bg-surface-card`):** `#141715` — Default card background before transparency.

#### Typography Tokens
- **Text Primary (`--text-primary`):** `#FFFFFF` (100% opacity) — Primary titles, headlines, active links.
- **Text Secondary (`--text-secondary`):** `rgba(255, 255, 255, 0.72)` — Body text, explanations, service bullet points.
- **Text Muted (`--text-muted`):** `rgba(255, 255, 255, 0.45)` — Metadata, copyright, secondary subtitles, overlines.
- **Text Accent (`--text-accent`):** `#35E85B` — Emphasized keywords, active indicators, highlighted metrics.
- **Text Inverse (`--text-inverse`):** `#050505` — High-contrast text rendered over Neon Green button fills.

#### Border & Divider Tokens
- **Border Subtle (`--border-subtle`):** `rgba(255, 255, 255, 0.08)` — Standard borders for cards, dividers, and panel seams.
- **Border Medium (`--border-medium`):** `rgba(255, 255, 255, 0.14)` — Floating navigation outline, input borders.
- **Border Active (`--border-active`):** `rgba(53, 232, 91, 0.45)` — Card hover state, interactive badge border.
- **Border Focus (`--border-focus`):** `rgba(53, 232, 91, 0.75)` — Keyboard focus ring for accessibility.

#### Functional & Feedback Tokens
- **Success (`--feedback-success`):** `#35E85B` (Hash Neon Green) — Confirmation, live status, successful submission.
- **Error (`--feedback-error`):** `#EF4444` — Form validation failures, warning messages.
- **Warning (`--feedback-warning`):** `#F59E0B` — Non-blocking system warnings.
- **Info (`--feedback-info`):** `#38BDF8` — Informational notes and developer metadata.

#### State Tokens
- **Disabled Background (`--state-disabled-bg`):** `rgba(255, 255, 255, 0.05)`
- **Disabled Text (`--state-disabled-text`):** `rgba(255, 255, 255, 0.28)`
- **Disabled Border (`--state-disabled-border`):** `rgba(255, 255, 255, 0.04)`

---

## 3. Surface & Glassmorphism Specifications

| Surface Variant | Background Fill | Backdrop Blur | Border Specification | Box Shadow | Typical Usage |
|---|---|---|---|---|---|
| **Graphite Glass (Standard)** | `rgba(23, 26, 24, 0.70)` | `16px` (`blur-md`) | `1px solid rgba(255, 255, 255, 0.08)` | `0 8px 32px rgba(0, 0, 0, 0.40)` | Service cards, feature panels, content blocks |
| **Floating Nav Island** | `rgba(23, 26, 24, 0.85)` | `12px` (`blur-md`) | `1px solid rgba(255, 255, 255, 0.12)` | `0 4px 24px rgba(0, 0, 0, 0.50)` | Sticky top header, floating action bars |
| **Hero Anchor Card** | `linear-gradient(135deg, rgba(23, 26, 24, 0.75), rgba(15, 17, 16, 0.60))` | `16px` (`blur-md`) | `1px solid rgba(255, 255, 255, 0.12)` | `0 16px 48px rgba(0, 0, 0, 0.60)` | Value proposition card anchored in hero |
| **Status Pill / Badge** | `rgba(255, 255, 255, 0.05)` | `8px` (`blur-sm`) | `1px solid rgba(255, 255, 255, 0.10)` | `none` | Service tags, availability badges, chip meta |
| **Elevated Modal / Drawer** | `rgba(18, 20, 19, 0.95)` | `24px` (`blur-lg`) | `1px solid rgba(255, 255, 255, 0.14)` | `0 24px 64px rgba(0, 0, 0, 0.80)` | Mobile navigation drawer, contact modal |

> **Design Rule:** Glow effects are restrained. Only interactive focus and card hovers produce subtle localized radial glows (`0 0 24px rgba(53, 232, 91, 0.15)`).

---

## 4. Typography System

### 4.1 Font Families & Fallback Strategy
- **Display & Headings:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - High-contrast, editorial tracking (`-0.03em`), reduced line-height (`1.05`–`1.15`).
- **Body & Functional:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Highly legible, neutral geometry, line-height `1.5`–`1.6`.
- **Monospace & Metadata:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
  - Used for code tags, section numbering (`01 //`, `02 //`), and status badges.

---

### 4.2 Type Scale Ramp

| Level | Desktop Size (>=1024px) | Tablet Size (768px-1023px) | Mobile Size (<768px) | Weight | Line Height | Letter Spacing | Max Readable Width |
|---|---|---|---|---|---|---|---|
| **Display H1** | `56px` (`3.5rem`) | `42px` (`2.625rem`) | `32px` (`2.0rem`) | `600` (SemiBold) | `1.1` | `-0.03em` (`-1.6px`) | `820px` |
| **Section H2** | `40px` (`2.5rem`) | `32px` (`2.0rem`) | `26px` (`1.625rem`) | `500` (Medium) | `1.15` | `-0.025em` (`-1.0px`) | `720px` |
| **Card / H3** | `24px` (`1.5rem`) | `20px` (`1.25rem`) | `18px` (`1.125rem`) | `500` (Medium) | `1.3` | `-0.015em` (`-0.3px`) | `540px` |
| **Feature / H4**| `18px` (`1.125rem`)| `16px` (`1.0rem`) | `15px` (`0.9375rem`)| `600` (SemiBold) | `1.4` | `-0.01em` (`-0.18px`) | `480px` |
| **Body Large** | `18px` (`1.125rem`)| `16px` (`1.0rem`) | `15px` (`0.9375rem`)| `400` (Regular) | `1.6` | `0` | `680px` |
| **Body Base** | `16px` (`1.0rem`) | `15px` (`0.9375rem`)| `14px` (`0.875rem`) | `400` (Regular) | `1.55` | `0` | `640px` |
| **Caption / Meta**| `13px` (`0.8125rem`)| `12px` (`0.75rem`) | `12px` (`0.75rem`) | `400` (Regular) | `1.4` | `0.02em` | `400px` |
| **Overline / Tag**| `12px` (`0.75rem`) | `11px` (`0.6875rem`)| `11px` (`0.6875rem`)| `600` (SemiBold) | `1.3` | `0.1em` (Uppercase) | `320px` |
| **Button / Nav**| `15px` (`0.9375rem`)| `14px` (`0.875rem`) | `14px` (`0.875rem`) | `500` (Medium) | `1.4` | `-0.01em` (`-0.15px`) | N/A |

---

## 5. Spacing, Grid & Layout System

### 5.1 Main Layout Boundaries
- **Container Maximum Width:** `1440px` (`max-w-[1440px]`), centered horizontally (`mx-auto`).
- **Horizontal Gutters:**
  - Mobile (<640px): `px-5` (`20px`)
  - Tablet (640px–1023px): `px-8` (`32px`)
  - Desktop (1024px–1439px): `px-12` (`48px`)
  - Ultra-Wide (>=1440px): `px-16` (`64px`)

### 5.2 Section Vertical Padding Scale
- **Hero Fold:** `min-h-[100vh]` (full bleed).
- **Standard Sections:**
  - Mobile: `py-16` (`64px`)
  - Tablet: `py-24` (`96px`)
  - Desktop: `py-32` (`128px`)
- **Compacted Sections (e.g. Logos/Marquee, CTA banners):**
  - Mobile: `py-10` (`40px`)
  - Desktop: `py-16` (`64px`)

### 5.3 Grid Columns & Gaps
- **Service Cards Grid:**
  - Desktop (>=1024px): 3 columns (`grid-cols-3`), `gap-8` (`32px`)
  - Tablet (768px–1023px): 2 columns (`grid-cols-2`), `gap-6` (`24px`)
  - Mobile (<768px): 1 column (`grid-cols-1`), `gap-5` (`20px`)
- **Two-Column Split Layouts:** `grid-cols-1 lg:grid-cols-12`, with `lg:col-span-5` (heading/statement) and `lg:col-span-7` (details/cards).

### 5.4 Breakpoint System
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`
- `2xl`: `1536px`

---

## 6. Accessibility & Responsive Standards

1. **Color Contrast:**
   - Body text (`rgba(255, 255, 255, 0.72)`) on Obsidian Black (`#050505`): Contrast ratio **11.4:1** (exceeds WCAG AAA requirement of 7:1).
   - Headings (`#FFFFFF`) on Obsidian Black: Ratio **21:1** (exceeds WCAG AAA).
   - Text Inverse (`#050505`) on Hash Neon Green (`#35E85B`): Ratio **13.8:1** (exceeds WCAG AAA).
2. **Keyboard Navigation:**
   - All interactive controls (buttons, links, drawer toggles) feature an explicit outline: `focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-obsidian)] outline-none`.
3. **Minimum Touch Target Size:**
   - Interactive mobile hit areas are minimum `44px × 44px`.
4. **Semantic Structure:**
   - Strictly ordered document landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`. Headings proceed monotonically without skipping levels (`h1` -> `h2` -> `h3`).
5. **No Layout Shifts (CLS < 0.05):**
   - Explicit aspect-ratio containers on imagery and media placeholders.
   - Text elements wrap cleanly with `hyphens-none break-words`.

