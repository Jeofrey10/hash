# HASH.DEVS — Frontend Architecture

## 1. Architectural Philosophy

The HASH.DEVS frontend architecture is engineered for speed, modularity, strict type safety, and clean separation of concerns. It avoids heavy meta-framework bloat in favor of a lean, highly responsive Single Page Application built on modern web standards.

---

## 2. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Runtime & Bundler** | [Vite 8](https://vite.dev/) | ESM-native dev server, Rollup production bundler |
| **View Library** | [React 19](https://react.dev/) | Component model, concurrent rendering |
| **Language** | [TypeScript 7](https://www.typescriptlang.org/) | Strict static typing, interfaces, domain models |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first, zero-runtime CSS with `@theme` engine |
| **Testing** | [Playwright 1.58](https://playwright.dev/) | Automated end-to-end and responsive viewport validation |
| **Design Extraction** | [Inspo MCP](https://inspomcp.dev/) | AI-powered design token and layout intelligence |

---

## 3. Directory Layout & Module Responsibilities

```
c:\hash.devs\
├── public/                     # Static unbundled assets
│   ├── images/                 # Optimized brand & atmospheric imagery
│   ├── videos/                 # Background video loops & media
│   └── fonts/                  # Custom webfont files (if local)
├── src/
│   ├── assets/                 # SVGs, icons, bundled graphics
│   ├── components/             # Reusable UI primitives (Buttons, Cards, Badges, Glass)
│   ├── sections/               # Page-level compositional sections (Hero, Services, CTA)
│   ├── layouts/                # Structural layout templates (Header, Footer, Container)
│   ├── hooks/                  # Custom reusable React hooks
│   ├── styles/                 # Global styling, tokens, and CSS variable definitions
│   │   ├── tokens.css          # Raw brand tokens & semantic variables
│   │   └── globals.css         # Tailwind directives and theme configuration
│   ├── lib/                    # Utility functions, DOM helpers, formatters
│   ├── types/                  # TypeScript domain interfaces and types
│   │   └── index.ts            # Brand, service, and data contract definitions
│   ├── App.tsx                 # Root application shell
│   └── main.tsx                # Client bootstrap & DOM mount point
├── tests/
│   └── e2e/                    # End-to-end and visual regression test suites
│       ├── foundation.spec.ts  # Environment smoke and brand baseline test
│       └── screenshots/        # Visual regression test captures
├── playwright.config.ts        # Playwright test runner configuration
├── vite.config.ts              # Vite plugins, aliases, and build settings
├── tsconfig.json               # TypeScript project reference root
├── tsconfig.app.json           # Application compiler configuration
└── package.json                # Project dependencies and operational scripts
```

---

## 4. Component Hierarchy & Layering

```
[ App.tsx ]
   └── [ Root Layout (layouts/) ]
         ├── [ Header / Navigation ]
         ├── [ <main> ]
         │     ├── [ HeroSection (sections/) ]
         │     │     ├── [ GlassPanel (components/) ]
         │     │     └── [ ActionButton (components/) ]
         │     ├── [ ServicesSection (sections/) ]
         │     │     └── [ ServiceCard (components/) ]
         │     └── [ CTASection (sections/) ]
         └── [ Footer ]
```

### Architectural Principles

1. **Primitives in `src/components/`:**
   - Stateless, highly composable UI building blocks (e.g., `GlassPanel`, `Button`, `Badge`).
   - Accept strongly typed props. No direct business logic or API ties.
2. **Compositions in `src/sections/`:**
   - Full visual sections representing page landmarks (`HeroSection`, `ServicesSection`).
   - Manage section-specific layout, headings, and data mapping.
3. **Shells in `src/layouts/`:**
   - Frame the overarching page flow, persistent navigation bar, and footer anchors.
4. **Strict Path Aliasing:**
   - `@/*` maps directly to `./src/*`, ensuring clean, relocatable imports across modules.
