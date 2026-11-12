# HASH.DEVS — Master Design Reference

This document serves as the primary gateway to the **HASH.DEVS** visual identity, design system, and reference intelligence.

---

## 1. Brand Identity & Source of Truth

The Hash.Devs brand identity is engineered around high-contrast, technical dark surfaces energized by an electric neon green signal accent.

> **CRITICAL DIRECTIVE:** The Hash.Devs brand palette is immutable. Never replace our dark Obsidian & Neon Green palette with earthy, beige, or warm tones.

### Core Brand Tokens
- **Obsidian Black (`#050505`):** Primary canvas background; creates deep atmospheric void.
- **Hash Neon Green (`#35E85B`):** Primary brand accent; interactive states, badges, glow signals.
- **Pure White (`#FFFFFF`):** Primary typography, headers, high-contrast text.
- **Graphite (`#171A18`):** Secondary dark surface; card backgrounds, structural borders.

---

## 2. Design System Architecture

Detailed specifications have been formalized into dedicated modular documents:

- **[DESIGN_SYSTEM.md](file:///c:/hash.devs/DESIGN_SYSTEM.md)** — Comprehensive color tokens, surface hierarchy, type scale ramp, layout boundaries, responsive margins, and WCAG 2.1 AA accessibility rules.
- **[COMPONENT_SPECIFICATIONS.md](file:///c:/hash.devs/COMPONENT_SPECIFICATIONS.md)** — Full specification catalog for the 10 core UI components (Navigation, Primary Button, Secondary Button, Glass Panel, Status Badge, Section Heading, Service Card, Image Reveal Container, Marquee Strip, Footer Link Group) with TypeScript prop interfaces, variants, states, and responsive behavior.
- **[MOTION_GUIDELINES.md](file:///c:/hash.devs/MOTION_GUIDELINES.md)** — Motion philosophy, timing tokens, easing curves, hardware-accelerated transitions, and `prefers-reduced-motion` specifications.
- **[DESIGN_TRANSLATION.md](file:///c:/hash.devs/DESIGN_TRANSLATION.md)** — Strategic analysis of what to adopt, adapt, and avoid from modern reference sites.
- **[REFERENCE_ANALYSIS.md](file:///c:/hash.devs/REFERENCE_ANALYSIS.md)** — Live browser inspection and exact DOM measurements extracted from *The General Intelligence Company*.
- **[DESIGN_DECISIONS.md](file:///c:/hash.devs/DESIGN_DECISIONS.md)** — High-level design choices established during initial discovery.

---

## 3. High-Level Implementation Decisions

### 3.1 CSS Tokens in Tailwind CSS v4
Tokens are defined in `src/styles/tokens.css` and exposed directly to Tailwind CSS via `@theme` in `src/styles/globals.css`.

### 3.2 Glassmorphism Recipe
```css
.glass-surface {
  background: rgba(23, 26, 24, 0.70);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.40);
}
```

### 3.3 Container & Layout Bounds
- **Maximum Width:** `1440px` (`max-w-[1440px]`).
- **Responsive Padding:** `px-5` (mobile) -> `px-8` (tablet) -> `px-12` (desktop) -> `px-16` (ultra-wide).
- **Macro-Spacing:** `py-16` (mobile) -> `py-24` (tablet) -> `py-32` (desktop).
