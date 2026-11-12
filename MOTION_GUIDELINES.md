# HASH.DEVS — Motion & Interaction Guidelines

## 1. Motion Philosophy

Motion in the HASH.DEVS digital experience serves as a functional signal of precision and hierarchy, rather than ornamental distraction.

- **Purposeful & Subtly Weighted:** Animations confirm actions, guide spatial comprehension, and communicate tactile depth.
- **Hardware-Accelerated:** Transitions strictly manipulate `transform` and `opacity` to maintain 60–120 FPS performance without triggering layout repaints.
- **Respect for Accessibility:** `prefers-reduced-motion: reduce` is honored across all components, replacing spatial translations with instant or subtle opacity fades.

---

## 2. Timing Tokens & Easing Curves

### Timing Tokens
- `--motion-instant`: `100ms` (Active presses, micro-toggles)
- `--motion-fast`: `200ms` (Button hovers, link color shifts)
- `--motion-standard`: `300ms` (Card hovers, dropdown reveals, modal transitions)
- `--motion-deliberate`: `500ms` (Section entries, accordion expansions)
- `--motion-cinematic`: `800ms`–`1200ms` (Hero initial fold reveals, image unmasking)

### Standard Easing Curves
- **Standard Curve:** `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind `ease-in-out` / standard smooth deceleration)
- **Deceleration Curve (Entrances):** `cubic-bezier(0.16, 1, 0.3, 1)` (Swift start, luxurious settle)
- **Sharp Curve (Exits):** `cubic-bezier(0.4, 0, 1, 1)` (Quick acceleration out of view)

---

## 3. Motion Specification Catalog

| Interaction | Trigger | Duration | Easing | Transform / Opacity Behavior | Reduced-Motion Alternative |
|---|---|---|---|---|---|
| **Page / Hero Entrance** | Page mount / initial DOM load | `800ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Opacity `0` -> `1`, Y-offset `20px` -> `0px` with staggered delay (`100ms` between header, headline, and anchor card) | Instant display or simple opacity fade (`300ms`) with zero Y-offset translation |
| **Section Reveal** | Viewport entry via IntersectionObserver (`threshold: 0.15`) | `600ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Opacity `0` -> `1`, Y-offset `24px` -> `0px` | Opacity `0` -> `1` instantly on scroll into view |
| **Text Headline Reveal** | Section activation | `500ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Opacity `0` -> `1`, slight upward drift `12px` -> `0px` | Instant full opacity |
| **Image Unmasking** | Image load / viewport entry | `700ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scale `1.04` -> `1.0`, opacity `0` -> `1`, clip-path expand | Scale stays static `1.0`, fade opacity only |
| **Floating Nav Transition** | Scroll past `50px` from top | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Backdrop-blur increases from `9px` to `16px`; background alpha increases from `0.70` to `0.85`; shadow intensifies | Instant background switch without transition |
| **Button Hover** | Pointer enter (`:hover`) | `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Primary: scale `1.02`, glow opacity `0` -> `1`. Secondary: background alpha shifts from `0.04` to `0.08` | Color and border change only; no scale shift |
| **Button Press** | Pointer down (`:active`) | `100ms` | `linear` | Scale `0.98` | Instant state change without scale |
| **Card Hover** | Pointer enter (`:hover`) | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Y-offset `-4px`, border color shifts from `rgba(255,255,255,0.08)` to `rgba(53,232,91,0.40)`, subtle shadow lift | Border color shift only; no vertical translation |
| **Mobile Menu Drawer** | Toggle button click | `350ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Y-translation `-100%` -> `0%` or slide from top with backdrop fade | Opacity fade `0` -> `1` in `150ms` without translation |
| **Marquee Loop** | Continuous | `25s` | `linear` | Infinite X translation `-100%`. Pauses on hover | Static horizontal scrollable strip with overflow-x auto |
| **Live Status Signal Pulse** | Continuous | `2000ms` | `cubic-bezier(0.4, 0, 0.6, 1)` | Radial scale `1.0` -> `1.6`, opacity `0.8` -> `0` (concentric ring) | Static 6px green indicator without animation |

---

## 4. CSS Implementation Rules

### 4.1 Reduced Motion Media Query Standard
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4.2 Reusable Motion Utility Classes
```css
/* Standard interactive transitions */
.transition-standard {
  transition-property: color, background-color, border-color, opacity, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card hover lift */
.card-hover-lift {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hover-lift:hover {
  transform: translateY(-4px);
  border-color: rgba(53, 232, 91, 0.40);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(53, 232, 91, 0.15);
}
```

---

## 5. React Motion Architecture (Stage 07 Implementation)

- **Hooks (`src/hooks/`):**
  - `useReducedMotion`: Dynamic system query hook subscribing to `(prefers-reduced-motion: reduce)`.
  - `useScrollReveal`: High-performance IntersectionObserver hook with configurable `threshold` (default 0.15), `rootMargin` (default `-50px`), `once` (default true), and a 2000ms safety visibility fallback.
- **Primitives (`src/components/motion/`):**
  - `Reveal`: General entrance component supporting `fade-up`, `fade-in`, `slide-left`, `slide-right`, and stagger indexing (`staggerIndex`).
  - `TextReveal`: Line-masked editorial text reveal preserving semantic tags (`h1`-`h6`, `p`) and full screen-reader accessible names.
  - `ImageReveal`: Aspect-ratio-preserving container with loading shimmer, subtle unmask scale transition, and zero layout shift.
