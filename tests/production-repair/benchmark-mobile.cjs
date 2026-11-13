const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function benchmark() {
  const outputDir = path.resolve('tests/production-repair/results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  
  // Test 1: Standard Mobile Viewport 390x844 (iPhone 14)
  console.log('Testing Mobile 390x844 continuous scroll performance...');
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // Measure scrolling
  const scrollResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const deltas = [];
      let lastTime = performance.now();
      let animId;

      const record = (now) => {
        deltas.push(now - lastTime);
        lastTime = now;
        animId = requestAnimationFrame(record);
      };
      animId = requestAnimationFrame(record);

      let pos = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const step = 20;

      const timer = setInterval(() => {
        pos += step;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(timer);
          cancelAnimationFrame(animId);

          const over16 = deltas.filter(d => d > 16.7).length;
          const over33 = deltas.filter(d => d > 33.3).length;
          const over50 = deltas.filter(d => d > 50).length;
          const maxDelta = Math.max(...deltas);
          const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

          resolve({
            totalFrames: deltas.length,
            avgFps: Math.round(1000 / avgDelta),
            avgDelta: avgDelta.toFixed(2),
            over16Pct: ((over16 / deltas.length) * 100).toFixed(1) + '%',
            over33Pct: ((over33 / deltas.length) * 100).toFixed(1) + '%',
            over50Pct: ((over50 / deltas.length) * 100).toFixed(1) + '%',
            longestFrameMs: maxDelta.toFixed(2),
          });
        }
      }, 16);
    });
  });

  console.log('Mobile 390x844 Result:', scrollResult);
  await page.screenshot({ path: path.join(outputDir, 'mobile-390-repaired.png') });
  await page.close();

  // Test 2: Mobile 384x832 (Exact dimension from user screen recording) with 4x CPU Throttling
  console.log('Testing Mobile 384x832 with 4x CPU Throttling...');
  const pageThrottled = await browser.newPage({
    viewport: { width: 384, height: 832 },
    deviceScaleFactor: 2.6,
    isMobile: true,
    hasTouch: true
  });
  const client = await pageThrottled.context().newCDPSession(pageThrottled);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await pageThrottled.goto('http://localhost:5173/');
  await pageThrottled.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await pageThrottled.waitForTimeout(500);

  const throttledResult = await pageThrottled.evaluate(async () => {
    return new Promise((resolve) => {
      const deltas = [];
      let lastTime = performance.now();
      let animId;

      const record = (now) => {
        deltas.push(now - lastTime);
        lastTime = now;
        animId = requestAnimationFrame(record);
      };
      animId = requestAnimationFrame(record);

      let pos = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const step = 25;

      const timer = setInterval(() => {
        pos += step;
        window.scrollTo(0, pos);
        if (pos >= maxScroll) {
          clearInterval(timer);
          cancelAnimationFrame(animId);

          const over16 = deltas.filter(d => d > 16.7).length;
          const over33 = deltas.filter(d => d > 33.3).length;
          const maxDelta = Math.max(...deltas);
          const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

          resolve({
            totalFrames: deltas.length,
            avgFps: Math.round(1000 / avgDelta),
            avgDelta: avgDelta.toFixed(2),
            over16Pct: ((over16 / deltas.length) * 100).toFixed(1) + '%',
            over33Pct: ((over33 / deltas.length) * 100).toFixed(1) + '%',
            longestFrameMs: maxDelta.toFixed(2),
          });
        }
      }, 16);
    });
  });

  console.log('Mobile 384x832 (4x CPU Throttle) Result:', throttledResult);
  await pageThrottled.screenshot({ path: path.join(outputDir, 'mobile-384-throttled.png') });
  await pageThrottled.close();

  // Test 3: Repeated bidirectional scroll memory test (5 round trips)
  console.log('Testing 5 round-trip bidirectional scroll cycles for memory stability...');
  const memPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true
  });
  await memPage.goto('http://localhost:5173/');
  await memPage.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});

  const heapStart = await memPage.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : 0);

  for (let cycle = 0; cycle < 5; cycle++) {
    // scroll down
    await memPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await memPage.waitForTimeout(300);
    // scroll back up
    await memPage.evaluate(() => window.scrollTo(0, 0));
    await memPage.waitForTimeout(300);
  }

  const heapEnd = await memPage.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : 0);
  const heapDeltaKB = ((heapEnd - heapStart) / 1024).toFixed(2);
  console.log(`Heap Delta after 5 full bidirectional scroll round trips: ${heapDeltaKB} KB`);

  await memPage.close();
  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    standardMobile: scrollResult,
    throttledMobile: throttledResult,
    heapDeltaKB,
  };

  fs.writeFileSync(path.join(outputDir, 'repaired-benchmark.json'), JSON.stringify(report, null, 2));
  console.log('Performance Benchmark complete! Results saved in:', outputDir);
}

benchmark().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});

