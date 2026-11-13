const { webkit, chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runAcceptanceTestForBrowser(browserType, browserName) {
  const screenshotDir = path.resolve(`tests/production-repair/phase4-${browserName}`);
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`\n========================================`);
  console.log(`Starting Phase 4 Acceptance Test on Mobile ${browserName.toUpperCase()}`);
  console.log(`========================================\n`);

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

  // 1. Open the website in Light Mode
  // Pre-seed localStorage to open in Light Mode
  await page.addInitScript(() => {
    localStorage.setItem('hash_devs_theme', 'light');
  });

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);

  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`[${browserName}] 1. Opened in Light Mode. Theme attribute:`, initialTheme);
  if (initialTheme !== 'light') {
    // Click switcher if not light
    await page.locator('#mobile-theme-switcher').click();
    await page.waitForTimeout(200);
  }
  await page.screenshot({ path: path.join(screenshotDir, '01-light-mode-hero.png') });

  // Helper function to verify no blank / hidden sections
  const verifySectionsVisible = async (stepName) => {
    const report = await page.evaluate(() => {
      const selectors = [
        '#hero-primary-headline',
        '#hero-cursive-headline',
        '#services h2',
        '#services article',
        '#approach h2',
        '#approach article',
        '#capabilities h2',
        '#contact h2',
        'footer[role="contentinfo"]'
      ];

      return selectors.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, error: 'NOT_FOUND' };
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          selector: sel,
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility,
          width: rect.width,
          height: rect.height,
          isHidden: style.display === 'none' || style.visibility === 'hidden'
        };
      });
    });

    const hidden = report.filter(r => r.isHidden || r.error);
    if (hidden.length > 0) {
      console.error(`[${browserName}] BLANK SCREEN DEFECT DETECTED at ${stepName}:`, hidden);
      throw new Error(`Blank screen or missing elements at ${stepName}: ${JSON.stringify(hidden)}`);
    }
    return report;
  };

  // 2. Scroll from Hero to Footer
  console.log(`[${browserName}] 2. Scrolling from Hero to Footer...`);
  const sections = ['services', 'approach', 'capabilities', 'contact'];
  for (const s of sections) {
    await page.locator(`#${s}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    // Verify current section is rendered
    const h2 = page.locator(`#${s} h2`);
    const h2Visible = await h2.isVisible();
    const h2Opacity = await h2.evaluate(el => window.getComputedStyle(el).opacity);
    if (!h2Visible || h2Opacity === '0') {
      throw new Error(`Section #${s} heading failed to reveal! visible=${h2Visible}, opacity=${h2Opacity}`);
    }
  }

  // Reach footer
  await page.locator('footer[role="contentinfo"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '02-light-mode-footer.png') });

  // 3. Scroll rapidly back to Hero
  console.log(`[${browserName}] 3. Rapid scroll back to Hero...`);
  for (let top = 4000; top >= 0; top -= 800) {
    await page.evaluate(y => window.scrollTo(0, y), top);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Verify reverse reveals worked and Hero is 100% visible
  const heroH1 = page.locator('#hero-primary-headline');
  const heroOpacity = await heroH1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`[${browserName}] Hero H1 opacity after rapid scroll up: ${heroOpacity}`);
  if (heroOpacity !== '1') {
    throw new Error(`Hero H1 failed to reverse-reveal! opacity is ${heroOpacity}`);
  }
  await page.screenshot({ path: path.join(screenshotDir, '03-rapid-scroll-hero-settled.png') });

  // 4. Switch to Dark Mode
  console.log(`[${browserName}] 4. Switching to Dark Mode...`);
  await page.locator('#mobile-theme-switcher').click();
  await page.waitForTimeout(300);
  const darkTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`[${browserName}] Theme is now: ${darkTheme}`);
  await page.screenshot({ path: path.join(screenshotDir, '04-dark-mode-hero.png') });

  // 5. Scroll down and up again
  console.log(`[${browserName}] 5. Scrolling down and up again in Dark Mode...`);
  for (const s of sections) {
    await page.locator(`#${s}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, '05-dark-mode-bottom.png') });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '06-dark-mode-top.png') });

  // 6. Switch back to Light Mode
  console.log(`[${browserName}] 6. Switching back to Light Mode...`);
  await page.locator('#mobile-theme-switcher').click();
  await page.waitForTimeout(300);

  // 7. Repeat theme switching while positioned inside different sections
  console.log(`[${browserName}] 7. Testing theme switching while positioned inside different sections...`);
  for (const s of sections) {
    console.log(`Positioning inside #${s} and toggling theme...`);
    await page.locator(`#${s}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Toggle theme via mobile header switcher
    await page.locator('#mobile-theme-switcher').click();
    await page.waitForTimeout(250);

    const scrollAfter = await page.evaluate(() => window.scrollY);
    const scrollDelta = Math.abs(scrollAfter - scrollBefore);
    console.log(`[${browserName}] Scroll position delta during theme switch in #${s}: ${scrollDelta}px`);
    if (scrollDelta > 20) {
      throw new Error(`Loss of scroll position detected! Shifted by ${scrollDelta}px`);
    }

    // Verify section content is not blank or missing
    const sectionH2 = page.locator(`#${s} h2`);
    const isVisible = await sectionH2.isVisible();
    const op = await sectionH2.evaluate(el => window.getComputedStyle(el).opacity);
    if (!isVisible || op === '0') {
      throw new Error(`Content disappeared during theme transition in #${s}!`);
    }

    await page.screenshot({ path: path.join(screenshotDir, `07-theme-switch-inside-${s}.png`) });

    // Toggle back
    await page.locator('#mobile-theme-switcher').click();
    await page.waitForTimeout(200);
  }

  // Final check
  await verifySectionsVisible('FINAL_VERIFICATION');

  console.log(`[${browserName}] Console errors during entire sequence:`, consoleErrors);
  if (consoleErrors.length > 0) {
    throw new Error(`Console errors encountered: ${JSON.stringify(consoleErrors)}`);
  }

  await browser.close();
  console.log(`\n>>> Phase 4 Acceptance Test on Mobile ${browserName.toUpperCase()} PASSED 100%! <<<\n`);
}

async function runAll() {
  await runAcceptanceTestForBrowser(webkit, 'webkit');
  await runAcceptanceTestForBrowser(chromium, 'chromium');
  console.log('\n======================================================');
  console.log('ALL PHASE 4 MANDATORY ACCEPTANCE TESTS PASSED ON BOTH WEBKIT & CHROMIUM!');
  console.log('======================================================\n');
}

runAll().catch(err => {
  console.error('Phase 4 Acceptance Test FAILED:', err);
  process.exit(1);
});

