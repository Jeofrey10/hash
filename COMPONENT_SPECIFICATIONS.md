# HASH.DEVS — Core Component Specifications

This catalog provides implementation-ready specifications for the 10 core UI components of **HASH.DEVS**. These specifications govern the implementation phase in subsequent stages.

---

## 1. Navigation (`Navigation`)

### 1.1 Purpose
Provides persistent, frictionless access to major sections and the primary contact action while floating weightlessly over page content.

### 1.2 Visual Appearance
- **Desktop:** Centered floating pill island (`top-4`, `w-fit`, `max-w-[720px]`, `rounded-full` or `rounded-xl`, `h-[54px]`).
- **Surface:** Graphite Glass (`rgba(23, 26, 24, 0.85)`), `backdrop-blur-md` (`12px`), `1px solid rgba(255, 255, 255, 0.12)`, subtle shadow `0 4px 24px rgba(0, 0, 0, 0.5)`.
- **Brand Mark:** "HASH" in Pure White, ".DEVS" with Hash Neon Green period (`#35E85B`).
- **Links:** 15px sans-serif, Pure White with `opacity-75` transitioning to `opacity-100` on hover.
- **Embedded CTA:** Compact pill button in Neon Green (`#35E85B`) with black text.
- **Mobile (<1024px):** Edge-to-edge floating header with brand mark on the left, compact CTA + hamburger toggle on the right, opening a full-screen graphite glass drawer.

### 1.3 Variants
- `default`: Sticky floating pill.
- `scrolled`: Elevated with slightly darker glass surface and higher shadow.

### 1.4 States
- `Default`: Translucent glass over background.
- `Scrolled`: Higher opacity backdrop blur.
- `Mobile Open`: Overlay drawer active with background scroll locked.

### 1.5 TypeScript API
```typescript
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface NavigationProps {
  readonly brandName?: string;
  readonly items: readonly NavItem[];
  readonly ctaText: string;
  readonly onCtaClick?: () => void;
  readonly className?: string;
}
```

### 1.6 Accessibility
- Wrapped in semantic `<header role="banner">` and `<nav aria-label="Main Navigation">`.
- Mobile toggle button declares `aria-expanded="true/false"` and `aria-controls="mobile-menu"`.
- Keyboard focusable links with `focus-visible:ring-2 focus-visible:ring-[#35E85B]`.

---

## 2. Primary Button (`PrimaryButton`)

### 2.1 Purpose
Primary conversion driver (e.g., "Start a Project", "Get in Touch", "Schedule Consultation").

### 2.2 Visual Appearance
- **Surface:** Hash Neon Green (`#35E85B`) solid fill.
- **Typography:** Obsidian Black (`#050505`) text, font-medium, `15px`, letter-spacing `-0.01em`.
- **Geometry:** Height `40px` (`h-10`) or `44px` (`h-11`), padding `px-6`, radius `rounded-lg` or `rounded-full`.
- **States:**
  - `Hover`: Subtle scale (`scale-[1.02]`) and brightness boost (`brightness-105`), subtle green halo glow (`box-shadow: 0 0 20px rgba(53, 232, 91, 0.35)`).
  - `Active/Pressed`: `scale-[0.98]`.
  - `Focus-Visible`: 2px offset ring in `#35E85B`.
  - `Disabled`: Opacity `0.4`, `cursor-not-allowed`, pointer events disabled.

### 2.3 Variants
- `size`: `'sm'` (36px high), `'md'` (42px high, default), `'lg'` (48px high).
- `fullWidth`: boolean (stretches `w-full` on mobile).

### 2.4 TypeScript API
```typescript
import React from 'react';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullWidth?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
  readonly isLoading?: boolean;
}
```

---

## 3. Secondary Button (`SecondaryButton`)

### 3.1 Purpose
Secondary actions (e.g., "View Work", "Explore Services", "Read Documentation").

### 3.2 Visual Appearance
- **Surface:** Translucent Graphite glass fill (`rgba(255, 255, 255, 0.04)`), `1px solid rgba(255, 255, 255, 0.12)`.
- **Typography:** Pure White (`#FFFFFF`), `15px`, font-medium.
- **States:**
  - `Hover`: Background shifts to `rgba(255, 255, 255, 0.08)`, border highlights to `rgba(255, 255, 255, 0.25)`.
  - `Active`: `scale-[0.98]`.
  - `Focus-Visible`: Green focus ring.
  - `Disabled`: Opacity `0.35`, border `rgba(255,255,255,0.05)`.

### 3.3 TypeScript API
```typescript
import React from 'react';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactNode;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullWidth?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
}
```

---

## 4. Glass Panel (`GlassPanel`)

### 4.1 Purpose
The fundamental structural container for cards, anchor blocks, and content sections.

### 4.2 Visual Appearance
- **Surface:** `rgba(23, 26, 24, 0.70)` (Graphite Glass).
- **Backdrop Filter:** `blur(16px)` (`backdrop-blur-md`).
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`.
- **Corner Radius:** `rounded-2xl` (`16px`) or `rounded-3xl` (`24px`).
- **Shadow:** `0 8px 32px 0 rgba(0, 0, 0, 0.40)`.

### 4.3 Variants
- `variant`:
  - `'standard'`: Default card container.
  - `'elevated'`: Higher opacity `0.85` and deeper shadow `0 16px 48px rgba(0,0,0,0.60)`.
  - `'interactive'`: Adds hover border color transition to `rgba(53, 232, 91, 0.35)` and subtle lift (`-translate-y-1`).
- `padding`: `'none'` | `'sm'` (16px) | `'md'` (24px) | `'lg'` (32px).

### 4.4 TypeScript API
```typescript
import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode;
  readonly variant?: 'standard' | 'elevated' | 'interactive';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly rounded?: 'xl' | '2xl' | '3xl';
  readonly className?: string;
}
```

---

## 5. Status Badge (`StatusBadge`)

### 5.1 Purpose
Communicates live system status, availability for new projects, or technology tags.

### 5.2 Visual Appearance
- **Surface:** Translucent pill (`rgba(255, 255, 255, 0.05)`), `backdrop-blur-sm`, `1px solid rgba(255, 255, 255, 0.10)`.
- **Geometry:** Height `28px`, `px-3`, radius `rounded-full`.
- **Indicator:** 6px circular dot with optional animated pulse (`bg-[#35E85B]`).
- **Typography:** `12px` sans/mono, Pure White or 80% white, font-medium, uppercase tracking-wide.

### 5.3 Variants
- `status`: `'active'` (pulsing green dot), `'neutral'` (solid white/gray dot), `'accent'` (solid green dot).

### 5.4 TypeScript API
```typescript
import React from 'react';

export interface StatusBadgeProps {
  readonly label: string;
  readonly status?: 'active' | 'neutral' | 'accent';
  readonly pulse?: boolean;
  readonly className?: string;
}
```

---

## 6. Section Heading (`SectionHeading`)

### 6.1 Purpose
Standardized section title composition with optional category overline, display H2, and descriptive subtitle.

### 6.2 Visual Appearance
- **Overline (Optional):** Monospace or tracking-widest text (`12px`), Neon Green (`#35E85B`) or muted white (`text-white/60`).
- **Main Heading:** H2, `text-2xl sm:text-3xl lg:text-4xl`, font-medium, tracking-tight (`-0.025em`), Pure White (`#FFFFFF`).
- **Description (Optional):** `text-base sm:text-lg`, line-height `1.6`, secondary white (`text-white/70`), max width `640px`.
- **Alignment:** `'left'` (default) or `'center'`.

### 6.3 TypeScript API
```typescript
import React from 'react';

export interface SectionHeadingProps {
  readonly overline?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: 'left' | 'center';
  readonly titleTag?: 'h1' | 'h2' | 'h3';
  readonly className?: string;
}
```

---

## 7. Service Card (`ServiceCard`)

### 7.1 Purpose
Presents each of the 5 official Hash.Devs services:
1. Website Development
2. Application Development
3. SEO Optimization
4. Meta Advertising
5. Creative Design & Video

### 7.2 Visual Appearance
- Built upon `GlassPanel` (`variant="interactive"`).
- **Header:** Numeric index (`01 //`, `02 //` in `font-mono text-xs text-[#35E85B]`), paired with service category icon.
- **Title:** H3, `text-xl sm:text-2xl`, font-medium, Pure White.
- **Description:** Secondary text (`text-white/70`), line-height `1.55`.
- **Deliverables / Capabilities List:** Unordered list with custom Neon Green bullet markers or chips.
- **Interactive States:** Hover shifts border to `rgba(53, 232, 91, 0.40)`, lifts card by `4px`, and reveals subtle neon glow.

### 7.3 TypeScript API
```typescript
export interface ServiceCardProps {
  readonly index: string; // e.g. "01"
  readonly title: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly icon?: React.ReactNode;
  readonly onExploreClick?: () => void;
  readonly className?: string;
}
```

---

## 8. Image Reveal Container (`ImageRevealContainer`)

### 8.1 Purpose
Containers for photography, technical diagrams, or mockups with smooth viewport-triggered unmasking and dark vignette overlays.

### 8.2 Visual Appearance
- Fixed aspect-ratio container (`aspect-[16/9]`, `aspect-[4/3]`, `aspect-[1/1]`).
- Dark ambient gradient overlay (`linear-gradient(to top, rgba(5,5,5,0.8), transparent)`) to maintain brand contrast with superimposed text.
- Overflow clipped with `rounded-2xl`.

### 8.3 TypeScript API
```typescript
import React from 'react';

export interface ImageRevealContainerProps {
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  readonly priority?: boolean;
  readonly overlay?: boolean;
  readonly className?: string;
}
```

---

## 9. Marquee / Logo Strip (`MarqueeStrip`)

### 9.1 Purpose
Displays continuous horizontal ticker of technology stacks, core capability tags, or brand keywords.

### 9.2 Visual Appearance
- Horizontal full-width band with gradient fade masks on left and right edges (`mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)`).
- Continuous, smooth CSS infinite scroll (`animation: marquee 25s linear infinite`).
- Pauses on user hover (`group-hover:[animation-play-state:paused]`).
- Items: High-contrast typography or monochrome SVG badges with `opacity-60` moving to `opacity-100` on hover.

### 9.3 TypeScript API
```typescript
export interface MarqueeItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: React.ReactNode;
}

export interface MarqueeStripProps {
  readonly items: readonly MarqueeItem[];
  readonly speed?: 'slow' | 'medium' | 'fast';
  readonly direction?: 'left' | 'right';
  readonly pauseOnHover?: boolean;
  readonly className?: string;
}
```

---

## 10. Footer Link Group (`FooterLinkGroup`)

### 10.1 Purpose
Structures navigational, legal, and company links inside the curtain-reveal footer.

### 10.2 Visual Appearance
- **Header:** `12px` uppercase font-mono, tracking-wider, muted white (`text-white/50`).
- **Links:** Unordered list of 14px links, Pure White with `opacity-70` transitioning to `opacity-100` and `text-[#35E85B]` on focus/hover.

### 10.3 TypeScript API
```typescript
export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export interface FooterLinkGroupProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
  readonly className?: string;
}
```

