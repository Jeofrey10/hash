const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  await client.send('HeapProfiler.enable');
  await client.send('HeapProfiler.collectGarbage');

  const m0 = await client.send('Performance.getMetrics');
  const h0 = m0.metrics.find((m) => m.name === 'JSHeapUsedSize').value;

  const btn = page.locator('a[href="#contact"]:has-text("Start a Project")').first();
  for (let i = 0; i < 5; i++) {
    await btn.click();
    await page.locator('div[role="dialog"]').waitFor();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50);
  }

  await client.send('HeapProfiler.collectGarbage');
  const m1 = await client.send('Performance.getMetrics');
  const h1 = m1.metrics.find((m) => m.name === 'JSHeapUsedSize').value;

  console.log('Heap start (post-GC):', (h0 / 1024).toFixed(2), 'KB');
  console.log('Heap end (post-GC):', (h1 / 1024).toFixed(2), 'KB');
  console.log('Heap delta (post-GC):', ((h1 - h0) / 1024).toFixed(2), 'KB');

  await browser.close();
})();

