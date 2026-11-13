const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function measurePerformance() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  const navigationStart = Date.now();
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  const loadDuration = Date.now() - navigationStart;

  // Measure Core Web Vitals via PerformanceObserver inside page
  const webVitals = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let lcp = 0;
      let cls = 0;

      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}

      // Observe CLS
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}

      setTimeout(() => {
        resolve({ lcp, cls });
      }, 1500);
    });
  });

  // Measure Frame Rates & Timings during scrolling
  const frameMetrics = await page.evaluate(async () => {
    const frameDeltas = [];
    let lastTime = performance.now();
    let isTracking = true;

    function track(now) {
      if (!isTracking) return;
      const delta = now - lastTime;
      frameDeltas.push(delta);
      lastTime = now;
      requestAnimationFrame(track);
    }
    requestAnimationFrame(track);

    // Perform smooth full-page scrolling
    const scrollHeight = document.body.scrollHeight;
    const distance = 80;
    for (let y = 0; y < scrollHeight; y += distance) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 16));
    }
    // Scroll back up
    for (let y = scrollHeight; y >= 0; y -= distance * 1.5) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 16));
    }

    isTracking = false;
    await new Promise((r) => setTimeout(r, 100));

    // Analyze deltas (ignore first frame which can be setup)
    const validDeltas = frameDeltas.slice(1);
    const avgDelta = validDeltas.reduce((a, b) => a + b, 0) / validDeltas.length;
    const over16 = validDeltas.filter((d) => d > 16.7).length;
    const over33 = validDeltas.filter((d) => d > 33.3).length;
    const maxDelta = Math.max(...validDeltas);

    return {
      frameCount: validDeltas.length,
      averageFPS: Math.round(1000 / avgDelta),
      avgDeltaMs: avgDelta.toFixed(2),
      framesOver16_7ms: over16,
      framesOver16_7msPct: ((over16 / validDeltas.length) * 100).toFixed(1) + '%',
      framesOver33_3ms: over33,
      framesOver33_3msPct: ((over33 / validDeltas.length) * 100).toFixed(1) + '%',
      longestFrameMs: maxDelta.toFixed(2),
    };
  });

  // Measure Long Tasks (>50ms)
  const longTasks = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const tasks = [];
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            tasks.push({
              duration: entry.duration.toFixed(2),
              startTime: entry.startTime.toFixed(2),
              name: entry.name,
            });
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {}

      setTimeout(() => {
        resolve({
          count: tasks.length,
          tasks,
          longestTaskMs: tasks.length > 0 ? Math.max(...tasks.map(t => parseFloat(t.duration))).toFixed(2) : '0',
        });
      }, 500);
    });
  });

  // Get CDP Metrics
  const cdpMetrics = await client.send('Performance.getMetrics');
  const metricMap = {};
  for (const m of cdpMetrics.metrics) {
    metricMap[m.name] = m.value;
  }

  const result = {
    loadDurationMs: loadDuration,
    webVitals,
    frameMetrics,
    longTasks,
    jsHeapUsedKB: (metricMap.JSHeapUsedSize / 1024).toFixed(2),
    layoutCount: metricMap.LayoutCount,
    recalcStyleCount: metricMap.RecalcStyleCount,
    taskDurationSeconds: metricMap.TaskDuration ? metricMap.TaskDuration.toFixed(3) : 'N/A',
  };

  console.log('=== Performance Benchmark Results ===');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
  return result;
}

measurePerformance();
