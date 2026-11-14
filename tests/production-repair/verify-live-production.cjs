const { webkit, chromium } = require('playwright');

async function testProductionUrl(browserType, browserName) {
  console.log(`\n======================================================`);
  console.log(`VERIFYING LIVE PRODUCTION DEPLOYMENT ON ${browserName.toUpperCase()}`);
  console.log(`Production URL: https://hashdev-ten.vercel.app/`);
  console.log(`======================================================\n`);

  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('pageerror', err => consoleErrors.push(err.message));

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  console.log(`1. Navigating to production URL...`);
  const response = await page.goto('https://hashdev-ten.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`HTTP Status:`, response.status());

  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // Check Hero Headline
  const h1 = page.locator('#hero-primary-headline');
  const h1Visible = await h1.isVisible();
  const h1Text = (await h1.textContent())?.trim();
  const h1Opacity = await h1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Hero H1: visible=${h1Visible}, text="${h1Text}", opacity=${h1Opacity}`);

  // Check Cursive Headline
  const cursive = page.locator('#hero-cursive-headline');
  const cursiveText = (await cursive.textContent())?.trim();
  console.log(`Hero Cursive: text="${cursiveText}"`);

  // Check Brand Symbol in Hero
  const brandSymbol = page.locator('#hero svg[aria-label="HASH.DEVS brand symbol"], #hero svg').first();
  const symbolVisible = await brandSymbol.isVisible();
  console.log(`Brand Symbol visible: ${symbolVisible}`);

  // Check Theme Switcher
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`Initial Theme: ${initialTheme}`);

  // Test Mobile Navigation Drawer
  console.log(`2. Testing Mobile Drawer interaction...`);
  await page.locator('button[aria-label="Open navigation menu"]').click();
  await page.waitForTimeout(400);

  const drawer = page.locator('#mobile-navigation-drawer');
  const drawerVisible = await drawer.isVisible();
  console.log(`Mobile Drawer open: ${drawerVisible}`);

  // Toggle theme inside drawer
  const drawerThemeSwitcher = page.locator('#drawer-theme-switcher');
  if (await drawerThemeSwitcher.count() > 0) {
    await drawerThemeSwitcher.click();
    await page.waitForTimeout(300);
    const themeAfterToggle = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Theme after toggle inside drawer: ${themeAfterToggle}`);
  }

  // Close drawer
  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(400);

  // Check Hero after drawer close
  const h1OpacityAfterDrawer = await h1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Hero H1 opacity after drawer close: ${h1OpacityAfterDrawer}`);

  // Test Scroll through all sections
  console.log(`3. Testing section scroll and reveals...`);
  const sections = ['services', 'approach', 'capabilities', 'contact'];
  for (const s of sections) {
    const heading = page.locator(`#${s} h2`).first();
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const op = await heading.evaluate(el => window.getComputedStyle(el).opacity);
    const vis = await heading.isVisible();
    const txt = (await heading.textContent())?.trim();
    console.log(`  ✓ Section #${s} heading: visible=${vis}, opacity=${op}, text="${txt?.substring(0, 35)}..."`);
    if (!vis || op === '0') {
      throw new Error(`Section #${s} is invisible or blank on live production!`);
    }
  }

  // Test Reverse Scroll
  console.log(`4. Testing reverse scroll to top...`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const h1ReverseOpacity = await h1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Hero H1 opacity after reverse scroll to top: ${h1ReverseOpacity}`);

  console.log(`Console Errors:`, consoleErrors);
  console.log(`Failed Critical Requests:`, failedRequests.filter(r => !r.url.includes('analytics') && !r.url.includes('favicon')));

  await browser.close();

  if (consoleErrors.length > 0) {
    throw new Error(`Console errors detected on production: ${JSON.stringify(consoleErrors)}`);
  }
  if (h1OpacityAfterDrawer !== '1' || h1ReverseOpacity !== '1') {
    throw new Error(`Hero blank screen detected on production!`);
  }

  console.log(`\n>>> LIVE PRODUCTION VERIFICATION ON ${browserName.toUpperCase()} PASSED 100%! <<<\n`);
}

async function run() {
  await testProductionUrl(webkit, 'webkit');
  await testProductionUrl(chromium, 'chromium');
}

run().catch(err => {
  console.error('Production Verification Failed:', err);
  process.exit(1);
});

