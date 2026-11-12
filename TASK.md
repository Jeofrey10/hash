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
  - [x] Create `PROJECT.md`
  - [x] Create `DESIGN.md` (with clear token vs. inspiration vs. implementation separation)
  - [x] Create `REQUIREMENTS.md`
  - [x] Create `ARCHITECTURE.md`
  - [x] Create `IMPLEMENTATION.md`
  - [x] Create `TASK.md`
  - [x] Create `TESTING.md`
  - [x] Create `SECURITY.md`
  - [x] Create `README.md`
- [x] **Stage 01 Verification Gate**
  - [x] Clean production build verification (`npm run build` exits 0).
  - [x] E2E test verification (`npm run test:e2e` exits 0).
  - [x] All restrictions honored (no premature homepage or hero sections created).

---

## Upcoming Stages

- [ ] **Stage 02 — Reference Website Analysis** *(Awaiting user approval to start)*
  - [ ] Use Inspo MCP tools (`get_design_system`, `get_site_pages`, `find_components`) for in-depth reference breakdown.
  - [ ] Use Playwright to capture reference website layout behavior across breakpoints.
  - [ ] Document design findings and translation into Hash.Devs dark theme.
- [ ] **Stage 03 — Core UI Components & Primitives**
- [ ] **Stage 04 — Section-by-Section Engineering**
- [ ] **Stage 05 — Interactivity, Animation & Polish**
- [ ] **Stage 06 — QA, Cross-Device Audit & Launch Readiness**
