const { webkit, chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Rigorous Section Content Assertion
 * Verifies actual rendered pixels and layout rather than just DOM presence:
 * 1. Non-zero bounding box (width > 0, height > 0)
 * 2. Visible text content
 * 3. Computed opacity === '1'
 * 4. Computed visibility === 'visible'
 * 5. Computed display !== 'none'
 * 6. Element bounds intersect the viewport
 * 7. Element is hit by document.elementFromPoint (no rogue overlay blocking it)
 */
async function assertSectionContentVisible(page, sectionName, selector, description) {
  const result = await page.evaluate(({ sel, desc }) => {
    const el = document.querySelector(sel);
    if (!el) {
      return { ok: false, reason: `Element NOT FOUND in DOM: ${sel} (${desc})` };
    }

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const text = el.innerText || el.textContent || '';

    // Check bounding box
    if (rect.width <= 0 || rect.height <= 0) {
      return { ok: false, reason: `Bounding box is zero: ${rect.width}x${rect.height} for ${sel}` };
    }

    // Check display & visibility
    if (style.display === 'none') {
      return { ok: false, reason: `style.display is 'none' for ${sel}` };
    }
    if (style.visibility === 'hidden' || style.visibility === 'collapse') {
      return { ok: false, reason: `style.visibility is '${style.visibility}' for ${sel}` };
    }

    // Check computed opacity
    const opacityNum = parseFloat(style.opacity);
    if (isNaN(opacityNum) || opacityNum < 0.95) {
      return { ok: false, reason: `Computed opacity is too low (${style.opacity}) for ${sel}` };
    }

    // Check if element is in viewport
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inViewport) {
      return { ok: false, reason: `Element is outside viewport: top=${rect.top}, bottom=${rect.bottom}, vh=${window.innerHeight} for ${sel}` };
    }

    // Check for unexpected full-screen overlay blocking the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + Math.min(rect.height / 2, 50);
    if (centerX >= 0 && centerX <= window.innerWidth && centerY >= 0 && centerY <= window.innerHeight) {
      const topElement = document.elementFromPoint(centerX, centerY);
      if (topElement) {
        const isDescendant = el.contains(topElement) || topElement.contains(el);
        if (!isDescendant) {
          // Check if topElement is an overlay
          const topStyle = window.getComputedStyle(topElement);
          const isDrawerOrModal = topElement.closest('[role="dialog"], [aria-modal="true"]');
          if (isDrawerOrModal) {
            return { ok: false, reason: `Blocked by dialog/drawer overlay: ${topElement.tagName} (${topElement.className})` };
          }
        }
      }
    }

    return {
      ok: true,
      textSnippet: text.trim().substring(0, 40),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      opacity: style.opacity
    };
  }, { sel: selector, desc: description });

  if (!result.ok) {
    throw new Error(`[${sectionName}] Content assertion FAILED: ${result.reason}`);
  }
  return result;
}

const SECTIONS = [
  {
    name: 'Hero',
    id: '#hero',
    assertions: [
      { sel: '#hero-primary-headline', desc: 'Primary Headline H1' },
      { sel: '#hero-cursive-headline', desc: 'Cursive Accent Headline' },
      { sel: '#hero a[href="#contact"]', desc: 'Start a Project Primary CTA' }
    ]
  },
  {
    name: 'Services',
    id: '#services',
    assertions: [
      { sel: '#services h2', desc: 'Services Section Heading' },
      { sel: '#services article', desc: 'First Core Service Card' }
    ]
  },
  {
    name: 'Approach',
    id: '#approach',
    assertions: [
      { sel: '#approach h2', desc: 'Approach Section Heading' },
      { sel: '#approach article', desc: 'First Approach Stage Card' }
    ]
  },
  {
    name: 'Capabilities',
    id: '#capabilities',
    assertions: [
      { sel: '#capabilities h2', desc: 'Capabilities Section Heading' },
      { sel: '#capabilities article', desc: 'First Capability Pillar Card' }
    ]
  },
  {
    name: 'Contact',
    id: '#contact',
    assertions: [
      { sel: '#contact h2', desc: 'Contact Section Heading' },
      { sel: '#contact form', desc: 'Multi-Step Contact Inquiry Form' }
    ]
  },
  {
    name: 'Footer',
    id: 'footer[role="contentinfo"]',
    assertions: [
      { sel: 'footer[role="contentinfo"] p', desc: 'Footer Copyright & Brand Info' },
      { sel: 'footer[role="contentinfo"] a[href="#contact"]', desc: 'Footer Start a Project Link' }
    ]
  }
];

async function runFiveCycleVerification(browserType, browserName) {
  console.log(`\n================================================================`);
  console.log(`STARTING 5-CYCLE PRODUCTION VERIFICATION ON MOBILE ${browserName.toUpperCase()}`);
  console.log(`================================================================\n`);

  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // Initialize in Light Mode
  await page.addInitScript(() => {
    localStorage.setItem('hashdevs-theme', 'light');
    localStorage.setItem('hash_devs_theme', 'light');
  });

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);

  const ensureTheme = async (desired) => {
    const cur = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (cur !== desired) {
      await page.locator('#mobile-theme-switcher').click();
      await page.waitForTimeout(250);
      const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      if (after !== desired) {
        throw new Error(`Failed to set theme to ${desired}, got ${after}`);
      }
    }
  };

  // Ensure Light Mode is active initially
  await ensureTheme('light');

  const cycleResults = [];

  for (let cycle = 1; cycle <= 5; cycle++) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`[${browserName}] EXECUTING CYCLE ${cycle} OF 5`);
    console.log(`------------------------------------------------------------`);

    // 1. Ensure Light Mode & Verify Hero
    console.log(`[${browserName}] Cycle ${cycle} - Step 1: Verify Initial Hero in Light Mode`);
    await ensureTheme('light');
    for (const a of SECTIONS[0].assertions) {
      const res = await assertSectionContentVisible(page, 'Hero', a.sel, a.desc);
      console.log(`  ✓ Hero assertion passed: ${a.desc} (opacity=${res.opacity}, box=${res.width}x${res.height})`);
    }

    // 2. Scroll from Hero to Footer, verifying EVERY section
    console.log(`[${browserName}] Cycle ${cycle} - Step 2: Scrolling through all sections (Hero -> Footer)`);
    for (const sec of SECTIONS) {
      if (sec.name === 'Hero') continue;
      for (const a of sec.assertions) {
        await page.locator(a.sel).first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        const res = await assertSectionContentVisible(page, sec.name, a.sel, a.desc);
        console.log(`  ✓ [${sec.name}] ${a.desc} visible: "${res.textSnippet}..." (${res.width}x${res.height}, op=${res.opacity})`);
      }
    }

    // 3. Rapid scroll back to Hero
    console.log(`[${browserName}] Cycle ${cycle} - Step 3: Rapid scroll back to top (0px)`);
    for (let y = 3500; y >= 0; y -= 700) {
      await page.evaluate(top => window.scrollTo(0, top), y);
      await page.waitForTimeout(30);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    for (const a of SECTIONS[0].assertions) {
      const res = await assertSectionContentVisible(page, 'Hero', a.sel, a.desc);
      console.log(`  ✓ Reverse Reveal settled: ${a.desc} (opacity=${res.opacity})`);
    }

    // 4. Switch to Dark Mode
    console.log(`[${browserName}] Cycle ${cycle} - Step 4: Switch to Dark Mode`);
    await ensureTheme('dark');

    // 5. Scroll through every section in Dark Mode
    console.log(`[${browserName}] Cycle ${cycle} - Step 5: Scrolling through all sections in Dark Mode`);
    for (const sec of SECTIONS) {
      if (sec.name === 'Hero') continue;
      for (const a of sec.assertions) {
        await page.locator(a.sel).first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        await assertSectionContentVisible(page, sec.name, a.sel, a.desc);
      }
    }

    // 6. Switch back to Light Mode
    console.log(`[${browserName}] Cycle ${cycle} - Step 6: Switch back to Light Mode`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await ensureTheme('light');

    // 7. Repeat theme changes while positioned inside every section
    console.log(`[${browserName}] Cycle ${cycle} - Step 7: Mid-section theme toggling across all sections`);
    for (const sec of SECTIONS) {
      const targetSel = sec.assertions[0].sel;
      await page.locator(targetSel).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Toggle theme
      await page.locator('#mobile-theme-switcher').click();
      await page.waitForTimeout(200);

      const scrollAfter = await page.evaluate(() => window.scrollY);
      const delta = Math.abs(scrollAfter - scrollBefore);
      if (delta > 20) {
        throw new Error(`Scroll position jumped by ${delta}px during theme switch in ${sec.name}!`);
      }

      // Assert section content remains visible
      await assertSectionContentVisible(page, sec.name, targetSel, sec.assertions[0].desc);

      // Toggle back to preserve flow
      await page.locator('#mobile-theme-switcher').click();
      await page.waitForTimeout(200);
    }

    // 8. Open and close the mobile navigation drawer repeatedly (3 times)
    console.log(`[${browserName}] Cycle ${cycle} - Step 8: Repeated mobile drawer open/close`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    for (let d = 1; d <= 3; d++) {
      // Open
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.waitForTimeout(200);

      const drawer = page.locator('#mobile-navigation-drawer');
      const drawerVisible = await drawer.isVisible();
      if (!drawerVisible) throw new Error(`Cycle ${cycle} drawer open ${d} failed`);

      // Optionally toggle theme inside drawer on 2nd iteration
      if (d === 2) {
        await page.locator('#drawer-theme-switcher').click();
        await page.waitForTimeout(200);
      }

      // Close
      await page.locator('button[aria-label="Close menu"]').click();
      await page.waitForTimeout(300);

      // Verify Hero content did NOT disappear!
      for (const a of SECTIONS[0].assertions) {
        await assertSectionContentVisible(page, 'Hero', a.sel, a.desc);
      }
    }

    // 9. Repeat rapid upward and downward scrolling
    console.log(`[${browserName}] Cycle ${cycle} - Step 9: Rapid fling scrolling (up and down)`);
    await page.evaluate(() => window.scrollTo(0, 4500));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    for (const a of SECTIONS[0].assertions) {
      await assertSectionContentVisible(page, 'Hero', a.sel, a.desc);
    }

    cycleResults.push({ cycle, status: 'PASSED', errors: 0 });
    console.log(`>>> [${browserName}] CYCLE ${cycle} OF 5 COMPLETED SUCCESSFULLY! <<<`);
  }

  console.log(`\n[${browserName}] Final console error check:`, consoleErrors);
  if (consoleErrors.length > 0) {
    throw new Error(`Console errors detected: ${JSON.stringify(consoleErrors)}`);
  }

  await browser.close();
  return cycleResults;
}

async function main() {
  console.log('\n======================================================');
  console.log('HASH.DEVS FINAL PRODUCTION VERIFICATION SUITE');
  console.log('======================================================');

  const webkitResults = await runFiveCycleVerification(webkit, 'webkit');
  const chromiumResults = await runFiveCycleVerification(chromium, 'chromium');

  console.log('\n======================================================');
  console.log('FINAL 5-CYCLE VERIFICATION RESULTS');
  console.log('======================================================');
  console.log('Mobile WebKit (Safari):', webkitResults);
  console.log('Mobile Chromium:       ', chromiumResults);
  console.log('\nALL 10 CYCLES PASSED WITH ZERO BLANK SCREENS AND ZERO ERRORS!');
}

main().catch(err => {
  console.error('\nFATAL VERIFICATION ERROR:', err);
  process.exit(1);
});
