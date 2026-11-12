# HASH.DEVS — Design System & Reference Inspiration

This document defines the visual strategy, design tokens, reference inspiration analysis, and actual implementation decisions for the **HASH.DEVS** website.

---

## 1. Hash.Devs Brand Tokens (Source of Truth)

The Hash.Devs identity is engineered around high-contrast, technical dark surfaces energized by a luminous neon green signal accent.

> **CRITICAL DIRECTIVE:** Under no circumstances should the Hash.Devs brand palette be replaced with earthy or beige tones.

### Color Tokens

| Token Name | Hex Code | Purpose / Semantic Role |
|---|---|---|
| **Obsidian Black** | `#050505` | Primary canvas background; creates deep atmospheric void |
| **Hash Neon Green** | `#35E85B` | Primary brand accent; interactive states, badges, glow signals |
| **Pure White** | `#FFFFFF` | Primary typography, headers, high-contrast text |
| **Graphite** | `#171A18` | Secondary dark surface; card backgrounds, borders, structural containers |

### Semantic Role Extensions

- **Background Canvas:** `#050505` (Obsidian Black)
- **Card / Surface Base:** `#171A18` (Graphite)
- **Elevated Surface:** `#222623` (Softened Graphite)
- **Primary Typography:** `#FFFFFF` (100% opacity)
- **Secondary Typography:** `rgba(255, 255, 255, 0.72)` (Muted white)
- **Tertiary / Caption Typography:** `rgba(255, 255, 255, 0.45)` (Subtle white)
- **Border Default:** `rgba(255, 255, 255, 0.08)`
- **Border Glow / Active:** `rgba(53, 232, 91, 0.4)`
- **Glassmorphic Fill:** `rgba(23, 26, 24, 0.65)` with `backdrop-filter: blur(16px)`

---

## 2. Reference Website Inspiration

- **Reference URL:** https://www.generalintelligencecompany.com/
- **Inspo MCP Identifier:** `generalintelligencecompany-com`
- **Extracted Design Profile:** https://inspomcp.dev/d/generalintelligencecompany-com/DESIGN.md

### Principles to Adapt (NOT Copy Directly)

1. **Cinematic Full-Bleed Compositions:**
   - Wide, immersive framing where visual elements anchor the user's focus immediately.
   - Purposeful negative space that lets typography and messaging breathe.
2. **Editorial Typography:**
   - Expressive, editorial headline styling paired with clean, ultra-legible body typography.
   - Tight letter-spacing on display headlines to impart precision and authority.
3. **Glassmorphism & Layered Depth:**
   - Semi-transparent cards with subtle borders (`1px solid rgba(255,255,255,0.08-0.12)`) and background blurs (`backdrop-blur-md` or `16px`).
   - Cards feel physical yet weightless, floating effortlessly above atmospheric backgrounds.
4. **Atmospheric Imagery & Visual Storytelling:**
   - Rich backgrounds with controlled contrast and ambient lighting.
   - Restrained motion that serves understanding rather than distraction.
5. **Generous Spacing & Minimal Navigation:**
   - Uncluttered viewport edges, compact floating or sticky navigation with clear signposts.
   - Spacing scale prioritizing macro-rhythms (e.g., 80px–140px section padding).

### What NOT to Adopt from the Reference

- **Do NOT adopt the reference color palette:**
  - Reference uses `#b4ac54`, `#e4bd9d`, `#845c34`, `#998271` (warm, muted, earthy tones).
  - Hash.Devs strictly enforces `#050505` (Obsidian), `#35E85B` (Neon Green), `#FFFFFF` (Pure White), and `#171A18` (Graphite).
- **Do NOT copy proprietary assets or logos.**

---

## 3. Actual Implementation Decisions

### A. CSS Architecture (Tailwind CSS v4 + Custom Properties)

Tokens are defined in `src/styles/tokens.css` and bound directly to Tailwind CSS via `@theme` in `src/styles/globals.css`.

```css
@theme {
  --color-obsidian: #050505;
  --color-neon-green: #35E85B;
  --color-pure-white: #FFFFFF;
  --color-graphite: #171A18;

  --color-brand-obsidian: var(--brand-obsidian);
  --color-brand-neon: var(--brand-neon-green);
  --color-brand-white: var(--brand-pure-white);
  --color-brand-graphite: var(--brand-graphite);
}
```

### B. Typography Hierarchy

- **Display / H1:** High-impact editorial headline, `-0.03em` letter-spacing, tight line height (`1.05`–`1.15`), Pure White (`#FFFFFF`).
- **H2 / Section Title:** Medium weight display, `-0.02em` letter-spacing, Pure White (`#FFFFFF`).
- **H3 / Service Title:** Semi-bold structured header, Pure White or with Neon Green marker.
- **Body:** System sans-serif stack (`system-ui, -apple-system, sans-serif`), 16px/150%, secondary white (`rgba(255, 255, 255, 0.72)`).
- **Caption / Overline:** Uppercase, tracking-widest (`0.1em`–`0.15em`), text-xs, Hash Neon Green (`#35E85B`) or muted white.

### C. Glassmorphism Specification

```css
.glass-panel {
  background: rgba(23, 26, 24, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### D. Layout Boundaries & Spatial Rhythm

- **Max Container Width:** `1440px` (`max-w-[1440px]`) with responsive horizontal gutters (`px-4 sm:px-6 lg:px-12`).
- **Section Spacing:** Minimum `py-16` on mobile, scaling to `py-24` or `py-32` on desktop for editorial breathing room.
- **Corner Radii:** Micro-elements `rounded-full` or `rounded-md` (4px–8px); cards and floating panels `rounded-2xl` (16px) or `rounded-3xl` (24px).
