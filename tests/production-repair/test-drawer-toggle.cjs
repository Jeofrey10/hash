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
  await page.waitForTimeout(500);

  console.log('1. Checking Hero opacity initially...');
  let op = await page.evaluate(() => {
    const el = document.querySelector('#hero-primary-headline');
    return el ? window.getComputedStyle(el).opacity : null;
  });
  console.log('Hero initial opacity:', op);

  console.log('2. Opening mobile menu drawer...');
  await page.locator('button[aria-label="Open navigation menu"]').click();
  await page.waitForTimeout(400);

  console.log('3. Toggling theme inside mobile drawer via #drawer-theme-switcher...');
  const drawerSwitcher = page.locator('#drawer-theme-switcher');
  await drawerSwitcher.click();
  await page.waitForTimeout(300);

  const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Current theme after toggle inside drawer:', currentTheme);

  console.log('4. Closing mobile menu drawer via Close menu button...');
  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(400);

  console.log('5. Checking Hero opacity after closing drawer...');
  op = await page.evaluate(() => {
    const el = document.querySelector('#hero-primary-headline');
    return el ? window.getComputedStyle(el).opacity : null;
  });
  console.log('Hero opacity after drawer close:', op);

  const isH1Visible = await page.locator('#hero-primary-headline').isVisible();
  console.log('Hero H1 isVisible():', isH1Visible);

  const heroContainerStyle = await page.evaluate(() => {
    const el = document.querySelector('#hero > div.relative.z-10');
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      opacity: cs.opacity,
      transform: cs.transform,
      visibility: cs.visibility
    };
  });
  console.log('Hero container computed style:', heroContainerStyle);

  await page.screenshot({ path: 'tests/production-repair/drawer-toggle-result.png' });

  await browser.close();
  if (op !== '1' || !isH1Visible || heroContainerStyle.opacity !== '1') {
    console.error('FAIL: Hero is blank/hidden after drawer toggle!');
    process.exit(1);
  } else {
    console.log('SUCCESS: Hero remained 100% visible with zero blank screen!');
  }
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
