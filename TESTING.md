# HASH.DEVS — Testing & Quality Assurance Strategy

## 1. Testing Philosophy

The testing strategy for HASH.DEVS prioritizes automated browser-level verification to ensure visual fidelity, responsive resilience, brand token consistency, and zero runtime regression across development phases.

---

## 2. Playwright Configuration

Playwright is configured in `playwright.config.ts` to test against the local Vite development server automatically.

### Key Capabilities

1. **Dual Viewport Testing:**
   - **Desktop Chromium:** Default 1440 × 900 resolution.
   - **Mobile Chromium:** Pixel 7 viewport profile (393 × 851, touch-enabled, mobile user agent).
2. **Automated Dev Server Hook:**
   - Spawns `npm run dev` automatically via `webServer` option on port `5173`.
   - Reuses existing server during local development to speed up iterative cycles.
3. **Automated Screenshot Artifacts:**
   - Visual capture on failure and programmatic full-page snapshot support (`tests/e2e/screenshots/`).
4. **HTML & CLI Reporters:**
   - Detailed console summaries and full trace reports upon failure.

---

## 3. Test Suites

### 3.1 Foundation Smoke Suite (`tests/e2e/foundation.spec.ts`)
Verifies fundamental environment health:
- Title and semantic document metadata.
- Brand name rendering (`HASH.DEVS`).
- Brand core message (`Build with purpose. Grow with clarity.`).
- Stage 01 status badge.
- Root element styling (Obsidian Black `#050505` / `rgb(5, 5, 5)` background).
- Visual screenshot capture (`foundation-smoke.png`).

---

## 4. Test Execution Commands

```bash
# Run full E2E test suite across all configured projects
npm run test:e2e

# Run tests in interactive UI mode
npm run test:e2e:ui

# View HTML test report
npm run test:e2e:report
```

---

## 5. Visual Regression & Cross-Device Strategy for Future Stages

Starting in Stage 02:
- Playwright will be utilized to inspect and snapshot reference website layouts at desktop and mobile dimensions.
- In subsequent stages, visual regression tests will validate that custom components (e.g., `GlassPanel`, responsive navigation, service cards) maintain their spacing, typography, and contrast without layout shift.

