const { chromium } = require('playwright');

async function inspectProduction() {
  console.log('--- Inspecting https://hashdev-ten.vercel.app/ ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  const consoleMessages = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
  });

  page.on('pageerror', err => {
    consoleMessages.push({ type: 'pageerror', text: err.message, stack: err.stack });
  });

  const startTime = Date.now();
  await page.goto('https://hashdev-ten.vercel.app/', { waitUntil: 'networkidle' });
  const loadDuration = Date.now() - startTime;

  console.log('Load duration (ms):', loadDuration);
  console.log('Console messages:', JSON.stringify(consoleMessages, null, 2));
  console.log('Failed requests:', JSON.stringify(failedRequests, null, 2));

  // Inspect scripts & HTML on deployed version
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
  });
  console.log('Deployed script bundles:', scripts);

  // Measure scrolling performance through the entire page
  const scrollPerf = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frames = [];
      let lastTime = performance.now();
      let animId;

      const record = (now) => {
        const delta = now - lastTime;
        frames.push(delta);
        lastTime = now;
        animId = requestAnimationFrame(record);
      };
      animId = requestAnimationFrame(record);

      // Scroll slowly down then fast
      let scrollY = 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const step = 25; // simulate finger drag
      const interval = setInterval(() => {
        scrollY += step;
        window.scrollTo(0, scrollY);
        if (scrollY >= totalHeight) {
          clearInterval(interval);
          cancelAnimationFrame(animId);
          
          const over16 = frames.filter(f => f > 16.7).length;
          const over33 = frames.filter(f => f > 33.3).length;
          const over50 = frames.filter(f => f > 50).length;
          const maxDelta = Math.max(...frames);
          const avgDelta = frames.reduce((a, b) => a + b, 0) / frames.length;
          
          resolve({
            totalFrames: frames.length,
            avgDelta: avgDelta.toFixed(2),
            over16Pct: ((over16 / frames.length) * 100).toFixed(1) + '%',
            over33Pct: ((over33 / frames.length) * 100).toFixed(1) + '%',
            over50Pct: ((over50 / frames.length) * 100).toFixed(1) + '%',
            maxDelta: maxDelta.toFixed(2)
          });
        }
      }, 16);
    });
  });

  console.log('Production Mobile Scroll Performance:', scrollPerf);

  await browser.close();
}

inspectProduction().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});

