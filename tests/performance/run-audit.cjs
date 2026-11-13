const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.resolve('tests/performance/artifacts');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, isMobile: false },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: false },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true },
  { name: 'mobile-360', width: 360, height: 800, isMobile: true },
];

async function runComprehensiveAudit() {
  const browser = await chromium.launch();
  const summary = {
    timestamp: new Date().toISOString(),
    viewports: {},
    cpuThrottling4x: {},
    themes: {},
    interactionLatencies: {},
    memoryLeaks: {},
  };

  console.log('--- Starting Matrix Benchmark ---');

  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport ${vp.name}...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    const page = await context.newPage();

    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    const navStart = Date.now();
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - navStart;

    // Track scroll frame performance
    const frameData = await page.evaluate(async () => {
      const frameDeltas = [];
      let last = performance.now();
      let tracking = true;

      function onFrame(now) {
        if (!tracking) return;
        frameDeltas.push(now - last);
        last = now;
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);

      const maxScroll = document.body.scrollHeight;
      const step = 80;
      for (let y = 0; y < maxScroll; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 16));
      }
      for (let y = maxScroll; y >= 0; y -= step * 1.5) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 16));
      }

      tracking = false;
      await new Promise((r) => setTimeout(r, 100));

      const deltas = frameDeltas.slice(1);
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const over16 = deltas.filter((d) => d > 16.7).length;
      const over33 = deltas.filter((d) => d > 33.3).length;

      return {
        count: deltas.length,
        avgFps: Math.round(1000 / avg),
        avgDeltaMs: avg.toFixed(2),
        over16Pct: ((over16 / deltas.length) * 100).toFixed(1) + '%',
        over33Pct: ((over33 / deltas.length) * 100).toFixed(1) + '%',
        longestFrameMs: Math.max(...deltas).toFixed(2),
      };
    });

    const cdpMetrics = await client.send('Performance.getMetrics');
    const metricMap = {};
    for (const m of cdpMetrics.metrics) {
      metricMap[m.name] = m.value;
    }

    summary.viewports[vp.name] = {
      loadTimeMs: loadTime,
      frameData,
      jsHeapKB: (metricMap.JSHeapUsedSize / 1024).toFixed(2),
      layoutCount: metricMap.LayoutCount,
      recalcStyleCount: metricMap.RecalcStyleCount,
    };

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, `perf-${vp.name}.png`),
    });

    await context.close();
  }

  // 2. CPU Throttling test (4x slowdown)
  console.log('Testing 4x CPU Slowdown on mobile-390...');
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await client.send('Performance.enable');

    const start = Date.now();
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    const frameData = await page.evaluate(async () => {
      const frameDeltas = [];
      let last = performance.now();
      let tracking = true;

      function onFrame(now) {
        if (!tracking) return;
        frameDeltas.push(now - last);
        last = now;
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);

      const maxScroll = document.body.scrollHeight;
      const step = 120;
      for (let y = 0; y < maxScroll; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }

      tracking = false;
      const deltas = frameDeltas.slice(1);
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      return {
        avgFps: Math.round(1000 / avg),
        longestFrameMs: Math.max(...deltas).toFixed(2),
      };
    });

    summary.cpuThrottling4x = {
      loadTimeMs: loadTime,
      frameData,
    };

    await context.close();
  }

  // 3. Theme switching latency & layout stability
  console.log('Testing Light & Dark Theme switching...');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const themeToggle = page.locator('#desktop-theme-switcher');

    // Switch to Light
    const t0 = Date.now();
    await themeToggle.click();
    await page.locator('html[data-theme="light"]').waitFor();
    const toLightMs = Date.now() - t0;

    // Switch back to Dark
    const t1 = Date.now();
    await themeToggle.click();
    await page.locator('html[data-theme="dark"]').waitFor();
    const toDarkMs = Date.now() - t1;

    summary.themes = {
      toLightMs,
      toDarkMs,
    };

    await context.close();
  }

  // 4. Memory Leak Audit (repeated drawer and modal cycles)
  console.log('Testing Memory Leak during repeated modal/drawer cycles...');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const m0 = await client.send('Performance.getMetrics');
    const heapStart = m0.metrics.find((m) => m.name === 'JSHeapUsedSize').value;

    // Open and close Consultation modal 5 times
    const startProjectBtn = page.locator('a[href="#contact"]:has-text("Start a Project")').first();
    for (let i = 0; i < 5; i++) {
      await startProjectBtn.click();
      const modal = page.locator('div[role="dialog"]');
      await modal.waitFor();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
    }

    const m1 = await client.send('Performance.getMetrics');
    const heapEnd = m1.metrics.find((m) => m.name === 'JSHeapUsedSize').value;
    const heapDeltaKB = ((heapEnd - heapStart) / 1024).toFixed(2);

    summary.memoryLeaks = {
      heapStartKB: (heapStart / 1024).toFixed(2),
      heapEndKB: (heapEnd / 1024).toFixed(2),
      heapDeltaKB,
      verdict: parseFloat(heapDeltaKB) < 3000 ? 'STABLE (No leak)' : 'ELEVATED',
    };

    await context.close();
  }

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'comprehensive-audit-report.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('=== Comprehensive Audit Complete ===');
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();
}

runComprehensiveAudit();

