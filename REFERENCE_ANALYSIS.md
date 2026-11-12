# HASH.DEVS — Reference Website Analysis & Design Intelligence

**Reference Source:** [The General Intelligence Company](https://www.generalintelligencecompany.com/)  
**Inspo MCP Identifier:** `generalintelligencecompany-com`  
**Analysis Date:** 2026-11-13  
**Methodology:** Live browser inspection via Playwright (Chromium across 5 viewports) + Inspo MCP design-system extractor.

---

## 1. Reference Overview & Design Philosophy

The General Intelligence Company website represents an elite tier of modern digital studio design. Its design philosophy centers around:
- **Atmospheric Cinematic Immersion:** The hero is completely full-bleed with soft atmospheric depth, evoking calm authority and intellectual weight.
- **High-Low Typography Contrast:** Pairings of classical, editorial serif display typefaces (`ppmondwest`) with geometric, utilitarian modern sans-serif body typography (`af`).
- **Tactile Weightlessness via Glassmorphism:** Semi-transparent, frosted floating panels (`backdrop-blur-[9px]` to `[20px]`, subtle `1px` borders with low alpha) that anchor critical CTAs and navigation without blocking underlying visual storytelling.
- **Editorial Pacing & Spatial Restraint:** High section vertical padding (ranging from `120px` on mobile up to `220px` on ultra-wide desktop) giving each thought ample visual breathing room.
- **Narrative Scroll Engineering:** The middle of the page features a long-scroll container (`#coordinator-scroll-container`, height `5000px`) that locks the viewport to choreograph interactive agent workflows.

---

## 2. Complete Page Section Inventory

The website is structured into 5 contiguous sections from top to bottom:

| # | Section Identifier | Primary Purpose | Background / Surface | Height & Dimensions | Layout Structure | Key Content & Media |
|---|---|---|---|---|---|---|
| **01** | **Hero (`#hero`)** | Immersive first impression, brand name, primary value proposition & initial CTA | Atmospheric golden-hour cityscape background image; full bleed | `1344px` height (Desktop) / `100vh` on initial fold | Floating centered nav; centered editorial brand title at top; bottom-left anchored glass card (500px wide) | H1: "The General Intelligence Company Of New York"<br>H2 in card: "AI that runs businesses autonomously"<br>CTA: "Get to know us" pill button |
| **02** | **Manifesto / Vision Statement** | Philosophical positioning and founding thesis | Off-white `#FEFFFC` flat surface | `850px` height (`pt-[200px] pb-[200px]`) | Centered editorial statement block; max-width ~1000px | "We envision a world where anyone with an idea and some unique insight can start a business..." High-contrast editorial text |
| **03** | **Interactive Coordinator (`#coordinator-scroll-container`)** | Demonstrating the multi-agent orchestration product (*Cofounder*) | `#FEFFFC` base transitioning into a dark interface canvas | `5000px` scroll height (sticky container pinned to viewport) | Pinned interactive viewport; floating agent status tags (`Coding`, `Customer Support`, `Marketing`, `Sales`) | H2: "Existing specialized agents have shown success... They need a coordinator."<br>Sticky dark application frame: "Cofounder lets you automate your business with natural language" |
| **04** | **Editorial Insights & Case Studies (`#blog-list`)** | Proof of execution, founder stories, and intellectual depth | `#FEFFFC` flat surface | `943px` height (`pt-[200px] pb-[200px]`) | 3-column responsive card grid with image headers and frosted pill meta | H2: "Our vision for the future of the world"<br>Articles on Ramp, ActiveGraph, and founder interviews |
| **05** | **Curtain-Reveal Footer** | Brand closure, navigation links, and legal meta | Dark backdrop `#16171D` revealed via fixed background scroll trick (`z-[-1]`) | `500px` fixed height at bottom | 2-column wide layout: large closing manifesto on left, utility links on right | H2: "We're building tools for businesses that run themselves"<br>Copyright & Altalogy design credits |

---

## 3. Layout Proportions, Spacing & Alignment

### Container & Max-Widths
- **Primary Content Boundaries:** `max-w-[1440px]` with standard horizontal gutters:
  - Mobile (<640px): `px-5` (20px)
  - Tablet (768px): `px-8` (32px)
  - Desktop (1280px): `px-12` (48px)
  - Ultra-wide (1536px+): `2xl:px-30` (120px)
- **Hero Glass Card:** Width locked at `max-w-[500px]` (exact measured desktop width: `500px`, height: `272px`).
- **Floating Navigation:** Desktop width is content-fit (`w-fit`), measured at `441.4px` width by `54px` height, centered at `top: 16px` via `left: 50%` and `transform: -translate-x-1/2`.

### Vertical Rhythm & Padding
- **Macro-Section Padding:**
  - Mobile: `py-[120px]`
  - Tablet: `md:py-[160px]`
  - Desktop: `xl:py-[200px]`
  - Large Desktop: `2xl:py-[220px]`
- **Micro-Spacings:** Consistent `4px`, `8px`, `12px`, `16px`, `24px` steps.

---

## 4. Typography System & Hierarchy

The reference uses two primary font families:
- **Display / Editorial Font:** `ppmondwest` (editorial high-contrast serif).
- **Body & Functional Font:** `af` (geometric clean modern sans-serif).

| Element | Detected Font | Measured Size | Weight | Line Height | Letter Spacing | Color (Observed) |
|---|---|---|---|---|---|---|
| **Site / Hero H1** | `ppmondwest` | `27px` (Desktop) / `20.8px` (Mobile) | `400` | `40.5px` (1.5) | `-1.08px` | `rgb(255, 255, 255)` |
| **Card Hero H2** | `ppmondwest` | `40px` | `500` | `44px` (1.1) | `-0.8px` | `rgb(255, 255, 255)` |
| **Section H2 (Light)**| `ppmondwest` | `48px` | `500` | `52.8px` (1.1) | `-0.96px` | `rgb(44, 44, 44)` |
| **Feature Display H2**| `ppmondwest` | `54px` | `400` | `59.4px` (1.1) | `-1.08px` | `rgb(255, 255, 255)` |
| **Article / Case Title**| `af` | `18px` | `500` | `23.4px` (1.3) | `-0.18px` | `rgb(41, 41, 41)` |
| **Nav Links** | `af` | `15px` | `500` | `21px` (1.4) | `-0.15px` | `rgb(255, 255, 255)` |
| **Functional / Meta** | `af` | `13px` | `500` / `600` | `19.5px` (1.5) | `-0.13px` | `rgb(68, 65, 65)` |

---

## 5. Colors, Surfaces & Glassmorphism Analysis

### Reference Color Roles
- **Hero Gradient:** Warm peach/gold atmospheric gradient (`#e4bd9d` to `#ccab9a`).
- **Accent Button:** `#b4ac54` (muted ochre/gold) and `#41a1cf` (subtle cyan border on product CTA).
- **Light Sections Background:** `#FEFFFC` (warm off-white).
- **Dark Inset Surface:** `#1F1F29` / `#282834` (dark graphite slate).

### Glassmorphism Recipes (Exact Extracted CSS)

1. **Floating Navigation Bar:**
   ```css
   position: fixed;
   top: 16px;
   left: 50%;
   transform: translateX(-50%);
   border-radius: 12px;
   border: 1px solid rgba(255, 255, 255, 0.2);
   background: linear-gradient(to right, rgba(249, 250, 247, 0.12), rgba(249, 250, 247, 0.18));
   backdrop-filter: blur(9px);
   box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
   ```
2. **Hero Anchor Value Proposition Card:**
   ```css
   border-radius: 16px; /* rounded-2xl */
   border: 1px solid rgba(255, 255, 255, 0.2);
   background: linear-gradient(to right, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.07));
   backdrop-filter: blur(15px);
   box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
   padding: 32px 24px 32px 32px;
   max-width: 500px;
   ```
3. **Floating Agent Pills / Tags:**
   ```css
   border-radius: 27px;
   border: 1px solid #CFD1D3;
   background: rgba(156, 180, 192, 0.14);
   backdrop-filter: blur(4px);
   box-shadow: 0 2px 4px 0 rgba(80, 115, 138, 0.24);
   padding: 6px 12px;
   font-size: 14px;
   ```
4. **App Notification Mockup Card:**
   ```css
   border-radius: 16px;
   border: 1px solid rgba(255, 255, 255, 0.6);
   background: rgba(255, 255, 255, 0.6);
   backdrop-filter: blur(20px);
   box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.05);
   ```

---

## 6. Interaction, Animation & Scroll Mechanics

1. **Floating Nav Scroll Transition:**
   - Nav starts transparently over the hero image.
   - Transitions smoothly (`duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]`) with property transitions on `background-color`, `border-color`, `box-shadow`, and `backdrop-filter`.
2. **Interactive Multi-Agent Coordinator Pinning:**
   - GSAP / ScrollTrigger pinning locks the `coordinator-section` inside a `5000px` scroll track.
   - As user scrolls, agent badges float, connecting lines activate, and central product card transitions into view.
3. **Curtain Reveal Footer:**
   - The main content wraps inside a foreground container with `z-index: 1` and `background: #FEFFFC`.
   - The footer sits at `position: fixed; bottom: 0; z-index: -1; height: 500px`.
   - As user scrolls to the bottom of the page, the main wrapper lifts up, revealing the footer underneath like a theater curtain.
4. **Hover Micro-Interactions:**
   - Pill buttons utilize `hover:opacity-90` with subtle internal glow and border highlighting.
   - Text links transition `opacity-70` to `opacity-100` with 200ms ease.

---

## 7. Responsive Behavior Across 5 Viewports

| Viewport Profile | Width × Height | Navigation Transformation | Typography Adjustment | Layout Reorganization |
|---|---|---|---|---|
| **Desktop (Large)** | `1440 × 900` | Floating pill bar centered at top (`54px` height, 441px width) | H1: `27px`, H2: `40px`–`54px`, Body: `16px` | Hero glass card anchored bottom-left (500px width); 3-column article grid |
| **Laptop** | `1280 × 800` | Floating pill bar maintained (`54px` height) | H1: `27px`, H2: `40px`, tight tracking | Same as desktop; section padding `xl:py-[200px]` |
| **Tablet** | `768 × 1024` | Nav bar converts to edge-to-edge floating header (`60px` height) with hamburger icon | H1 downscales to `24px`; H2 to `36px` | Hero glass card stretches across width with `px-8` gutters; article grid shifts to 2 columns |
| **Mobile** | `390 × 844` | Full-width header (`60px` height) with mobile menu button; links hidden | H1 downscales to `20.8px` / line-height `31.2px` | Hero glass card stacks full width under headline; article grid stacks to 1 column |
| **Small Mobile** | `360 × 800` | Full-width header (`60px`), zero horizontal overflow verified (`scrollWidth == clientWidth`) | H1 maintained at `20.8px`; padding reduced to `px-5` (`20px`) | Fully stacked single column layout; tag pills stack vertically |

---

## 8. Exact versus Estimated Measurements

| Property | Measured Value | Measurement Type | Verification Tool |
|---|---|---|---|
| Desktop Container Max-Width | `1440px` (with `2xl:px-30` / `120px` gutters up to `1920px`) | Exact | Playwright DOM evaluation |
| Floating Nav Dimensions | `441.4px` width × `54px` height | Exact | Computed BoundingClientRect |
| Nav Top Offset | `16px` (`top: 16px`) | Exact | Computed style |
| Hero Card Dimensions | `500px` width × `272px` height | Exact | Computed BoundingClientRect |
| Hero Card Backdrop Blur | `15px` (`backdrop-blur-[15px]`) | Exact | Tailwind class & computed CSS |
| Nav Backdrop Blur | `9px` (`backdrop-blur-[9px]`) | Exact | Tailwind class & computed CSS |
| Display H1 Font Size | `27px` (Desktop) / `24px` (Tablet) / `20.8px` (Mobile) | Exact | Computed style |
| Section Vertical Padding | `120px` (Mobile) / `160px` (Tablet) / `200px` (Laptop) / `220px` (2XL) | Exact | Tailwind class extraction |
| Coordinator Scroll Track | `5000px` | Exact | Element height in DOM |
| Footer Reveal Height | `500px` | Exact | Computed BoundingClientRect |
| Scroll Pinning Easing Curve | `cubic-bezier(0.4, 0, 0.2, 1)` | Exact | CSS transition timing function |
| Hero Cityscape Focal Depth | Soft focus blur ~`8px`–`12px` with foreground foliage | Estimated / Inferred | Visual screenshot inspection |

---

## 9. Screenshot Evidence Captured

The following live screenshots were captured using Playwright Chromium and saved directly in `tests/e2e/screenshots/reference-analysis/`:

1. `01-desktop-1440-hero.png` — Desktop 1440x900 initial fold with floating nav, large H1, and glassmorphic card.
2. `02-desktop-1440-fullpage.png` — Complete desktop page from top to footer.
3. `03-desktop-interactive-button-hover.png` — Button and CTA hover states.
4. `04-desktop-scroll-midpage.png` — Mid-page interactive coordinator section.
5. `05-desktop-scroll-bottom.png` — Footer curtain reveal and article case studies.
6. `06-laptop-1280-hero.png` — Laptop 1280x800 hero composition.
7. `07-laptop-1280-fullpage.png` — Laptop full page layout.
8. `06-tablet-768-hero.png` — Tablet 768x1024 hero composition.
9. `07-tablet-768-fullpage.png` — Tablet full page layout.
10. `06-mobile-390-hero.png` — Mobile 390x844 hero composition.
11. `07-mobile-390-fullpage.png` — Mobile full page layout.
12. `06-small-mobile-360-hero.png` — Small mobile 360x800 viewport.
13. `07-small-mobile-360-fullpage.png` — Small mobile full page layout.
14. `08-mobile-menu-open.png` — Mobile navigation drawer / state.
15. `inspection-data.json` — Machine-readable raw DOM dump.
