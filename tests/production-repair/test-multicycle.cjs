const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);

  console.log('--- Multi-Cycle Stress Test on WebKit ---');

  for (let cycle = 1; cycle <= 4; cycle++) {
    console.log(`\nCycle ${cycle}:`);
    
    // 1. Open drawer
    await page.locator('button[aria-label="Open navigation menu"]').click();
    await page.waitForTimeout(200);

    // 2. Toggle theme in drawer
    await page.locator('#drawer-theme-switcher').click();
    await page.waitForTimeout(200);

    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(` Cycle ${cycle} theme is now: ${theme}`);

    // 3. Close drawer
    await page.locator('button[aria-label="Close menu"]').click();
    await page.waitForTimeout(250);

    // 4. Verify Hero is visible
    const heroH1 = page.locator('#hero-primary-headline');
    const heroVisible = await heroH1.isVisible();
    const heroOp = await heroH1.evaluate(el => window.getComputedStyle(el).opacity);
    if (!heroVisible || heroOp !== '1') {
      throw new Error(`Cycle ${cycle}: Hero disappeared! visible=${heroVisible}, opacity=${heroOp}`);
    }

    // 5. Scroll down to Services & Approach
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const sH2 = page.locator('#services h2');
    const sOp = await sH2.evaluate(el => window.getComputedStyle(el).opacity);
    if (sOp === '0') throw new Error(`Cycle ${cycle}: Services h2 is opacity 0!`);

    await page.locator('#approach').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const aH2 = page.locator('#approach h2');
    const aOp = await aH2.evaluate(el => window.getComputedStyle(el).opacity);
    if (aOp === '0') throw new Error(`Cycle ${cycle}: Approach h2 is opacity 0!`);

    // 6. Rapid scroll back to 0
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const heroOpAfterScroll = await heroH1.evaluate(el => window.getComputedStyle(el).opacity);
    if (heroOpAfterScroll !== '1') {
      throw new Error(`Cycle ${cycle}: Hero failed to reverse reveal after scroll up! opacity=${heroOpAfterScroll}`);
    }
    console.log(` Cycle ${cycle} completed perfectly! Hero opacity: ${heroOpAfterScroll}`);
  }

  await browser.close();
  console.log('\n>>> MULTI-CYCLE STRESS TEST PASSED 100%! ZERO BLANK SCREENS! <<<');
})().catch(err => {
  console.error('Multi-cycle test failed:', err);
  process.exit(1);
});

