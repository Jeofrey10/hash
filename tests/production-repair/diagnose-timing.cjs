const { webkit } = require('playwright');

async function testWhyOpacity0() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  console.log('--- Initial Scroll to 1700 ---');
  await page.evaluate(() => window.scrollTo(0, 1700));

  let accumulated = 0;
  for (const step of [20, 50, 100, 200, 300, 400, 600]) {
    await page.waitForTimeout(step);
    accumulated += step;
    const detail = await page.evaluate(() => {
      // Find "WHAT WE DO" reveal
      const el = document.querySelector('#services')?.querySelector('[class*="transition-[opacity"]');
      if (!el) return { found: false };
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        found: true,
        className: el.className,
        styleDelay: el.style.transitionDelay,
        styleDuration: el.style.transitionDuration,
        computedOpacity: style.opacity,
        computedTransform: style.transform,
        rectTop: rect.top,
        rectBottom: rect.bottom
      };
    });
    console.log(`After ${accumulated}ms total: opacity=${detail.computedOpacity}, top=${detail.rectTop}, classes=${detail.className}`);
  }

  console.log('\n--- Now scroll down to 3200 (past Services) ---');
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(400);

  console.log('--- Now REVERSE scroll back up to 1500 (Services in viewport) ---');
  await page.evaluate(() => window.scrollTo(0, 1500));

  accumulated = 0;
  for (const step of [20, 50, 100, 200, 300, 400, 600]) {
    await page.waitForTimeout(step);
    accumulated += step;
    const detail = await page.evaluate(() => {
      const el = document.querySelector('#services')?.querySelector('[class*="transition-[opacity"]');
      if (!el) return { found: false };
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        found: true,
        className: el.className,
        styleDelay: el.style.transitionDelay,
        styleDuration: el.style.transitionDuration,
        computedOpacity: style.opacity,
        computedTransform: style.transform,
        rectTop: rect.top,
        rectBottom: rect.bottom
      };
    });
    console.log(`Reverse after ${accumulated}ms: opacity=${detail.computedOpacity}, top=${detail.rectTop}, classes=${detail.className}`);
  }

  await browser.close();
}

testWhyOpacity0().catch(console.error);

