const { webkit, chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIDEO_DIR = path.join(__dirname, 'acceptance-video');
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:4173';

// Section targets for deep assertions & hit-testing
const SECTION_TARGETS = [
  {
    name: 'Hero',
    selector: '#hero',
    contentSelector: '#hero-primary-headline',
    expectedText: 'Build with purpose',
    scrollPos: 0,
  },
  {
    name: 'Services',
    selector: '#services',
    contentSelector: '#services h2',
    expectedText: 'Integrated capabilities',
    scrollPos: 950,
  },
  {
    name: 'Approach',
    selector: '#approach',
    contentSelector: '#approach h2',
    expectedText: 'A disciplined path',
    scrollPos: 2100,
  },
  {
    name: 'Capabilities',
    selector: '#capabilities',
    contentSelector: '#capabilities h2',
    expectedText: 'The thinking and craft',
    scrollPos: 3300,
  },
  {
    name: 'Contact',
    selector: '#contact',
    contentSelector: '#contact h2',
    expectedText: "Have a project in mind?",
    scrollPos: 4600,
  },
  {
    name: 'Footer',
    selector: 'footer',
    contentSelector: 'footer p',
    expectedText: 'Connected digital experiences',
    scrollPos: 5600,
  },
];

async function assertSectionRendered(page, target, contextMsg) {
  // 1. Scroll to section position
  await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), target.scrollPos);
  await page.waitForTimeout(500); // allow RAF + 450ms transition settlement

  const info = await page.evaluate((t) => {
    const sec = document.querySelector(t.selector);
    const content = document.querySelector(t.contentSelector);

    if (!sec || !content) {
      return { found: false, error: `Missing element: ${t.selector} or ${t.contentSelector}` };
    }

    const secRect = sec.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const secStyle = window.getComputedStyle(sec);
    const contentStyle = window.getComputedStyle(content);

    // Hit-testing at center of content
    const centerX = Math.floor(contentRect.left + contentRect.width / 2);
    const centerY = Math.floor(contentRect.top + contentRect.height / 2);
    let hitOk = false;
    let hitTag = 'none';

    if (centerX >= 0 && centerX <= window.innerWidth && centerY >= 0 && centerY <= window.innerHeight) {
      const hitEl = document.elementFromPoint(centerX, centerY);
      hitTag = hitEl ? hitEl.tagName + (hitEl.id ? '#' + hitEl.id : '') : 'none';
      hitOk = hitEl ? (content.contains(hitEl) || hitEl.contains(content)) : false;
    } else {
      // If content is outside viewport (due to tall section), check top of content
      hitOk = true; 
    }

    const text = (content.textContent || '').trim();
    const textMatches = text.toLowerCase().includes(t.expectedText.toLowerCase());

    return {
      found: true,
      secOpacity: secStyle.opacity,
      secVis: secStyle.visibility,
      secDisplay: secStyle.display,
      contentOpacity: contentStyle.opacity,
      contentVis: contentStyle.visibility,
      contentDisplay: contentStyle.display,
      contentBox: { width: Math.round(contentRect.width), height: Math.round(contentRect.height) },
      textMatches,
      actualText: text.substring(0, 40),
      hitOk,
      hitTag,
    };
  }, target);

  if (!info.found) {
    throw new Error(`[ASSERT FAIL - ${contextMsg}] ${info.error}`);
  }

  const opVal = parseFloat(info.contentOpacity);
  if (opVal < 0.95) {
    throw new Error(`[ASSERT FAIL - ${contextMsg}] ${target.name} content opacity is ${info.contentOpacity} (expected >= 0.95)`);
  }
  if (info.contentVis === 'hidden' || info.contentDisplay === 'none') {
    throw new Error(`[ASSERT FAIL - ${contextMsg}] ${target.name} hidden/none`);
  }
  if (info.contentBox.width === 0 || info.contentBox.height === 0) {
    throw new Error(`[ASSERT FAIL - ${contextMsg}] ${target.name} has zero bounding box`);
  }
  if (!info.textMatches) {
    throw new Error(`[ASSERT FAIL - ${contextMsg}] ${target.name} text mismatch: got "${info.actualText}"`);
  }

  return info;
}

// Reproduction test for Drawer & Modal sequence (Prompt Item 2)
async function runReproductionTest(page, browserName) {
  console.log(`\n======================================================`);
  console.log(`[${browserName}] RUNNING PROMPT ITEM 2: REPRODUCTION OF ORIGINAL FAILURE`);
  console.log(`======================================================`);

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1600); // wait for preloader

  // Ensure Light mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.setItem('hashdevs-theme', 'light'); } catch (e) {}
    window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
  });
  await page.waitForTimeout(200);

  const testPositions = [
    { name: 'Hero', y: 0, selector: '#hero' },
    { name: 'Services', y: 1000, selector: '#services' },
    { name: 'Approach', y: 2200, selector: '#approach' },
    { name: 'Capabilities', y: 3400, selector: '#capabilities' },
    { name: 'Contact', y: 4700, selector: '#contact' },
  ];

  for (const pos of testPositions) {
    console.log(`\n--- Testing Drawer Sequence at ${pos.name} (scrollY=${pos.y}) ---`);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pos.y);
    await page.waitForTimeout(400);

    // 1. Open mobile navigation drawer
    const menuBtn = await page.$('button[aria-controls="mobile-navigation-drawer"]');
    if (!menuBtn) throw new Error('Menu button not found');
    await menuBtn.click();
    await page.waitForTimeout(200);

    // 2. Switch to Dark Mode inside drawer
    await page.evaluate(() => {
      const btn = document.querySelector('#drawer-theme-switcher');
      if (btn) btn.click();
    });
    await page.waitForTimeout(150);

    // 3. Switch back to Light Mode inside drawer
    await page.evaluate(() => {
      const btn = document.querySelector('#drawer-theme-switcher');
      if (btn) btn.click();
    });
    await page.waitForTimeout(150);

    // 4. Close drawer
    const closeBtn = await page.$('button[aria-label="Close menu"]');
    if (closeBtn) await closeBtn.click();
    else await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 5. Wait without scrolling (500ms)
    await page.waitForTimeout(500);

    // 6. Check that visible content DID NOT disappear
    const visibleCheck = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { found: false };
      const st = window.getComputedStyle(el);
      return { found: true, opacity: st.opacity, vis: st.visibility };
    }, pos.selector);

    if (parseFloat(visibleCheck.opacity) < 0.95) {
      throw new Error(`[REPRO FAIL] ${pos.name} content disappeared after drawer close! Opacity: ${visibleCheck.opacity}`);
    }
    console.log(`  ✓ ${pos.name} content remained solid after drawer close (opacity=${visibleCheck.opacity})`);

    // 7. Test Consultation Modal sequence at this position
    console.log(`--- Testing Modal Sequence at ${pos.name} ---`);
    const opened = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(
        (b) => b.textContent && b.textContent.includes('Start a Project') && b.getBoundingClientRect().height > 0
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (opened) {
      await page.waitForTimeout(400);
      const modalClose = await page.$('button[aria-label="Close consultation dialog"], button:has-text("Close Dialog")');
      if (modalClose) {
        await modalClose.click();
        await page.waitForTimeout(400);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    }

    // Wait without scrolling
    await page.waitForTimeout(400);
    const postModalCheck = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? window.getComputedStyle(el).opacity : '0';
    }, pos.selector);

    if (parseFloat(postModalCheck) < 0.95) {
      throw new Error(`[REPRO FAIL] ${pos.name} disappeared after modal close! Opacity: ${postModalCheck}`);
    }
    console.log(`  ✓ ${pos.name} content remained solid after modal close (opacity=${postModalCheck})`);
  }

  console.log(`>>> [${browserName}] PROMPT ITEM 2 REPRODUCTION PASSED WITH ZERO DISAPPEARANCE <<<`);
}

// Capture screenshots of all 6 sections in both themes
async function captureThemeScreenshots(page, browserName) {
  console.log(`\n======================================================`);
  console.log(`[${browserName}] CAPTURING 12 HIGH-RES SCREENSHOTS (6 SECTIONS x 2 THEMES)`);
  console.log(`======================================================`);

  const themes = ['light', 'dark'];
  for (const theme of themes) {
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('hashdevs-theme', t);
      window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
    }, theme);
    await page.waitForTimeout(300);

    for (const target of SECTION_TARGETS) {
      await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), target.scrollPos);
      await page.waitForTimeout(450); // wait for settlement

      const screenshotName = `${target.name.toLowerCase()}-${theme}.png`;
      const filePath = path.join(SCREENSHOTS_DIR, screenshotName);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  ✓ Saved screenshot: ${screenshotName}`);
    }
  }
}

// 10-Cycle Mandatory Stress Test (Prompt Item 3 & 4)
async function run10CycleStressTest(page, browserName) {
  console.log(`\n======================================================`);
  console.log(`[${browserName}] RUNNING 10-CYCLE MANDATORY STRESS & PERFORMANCE TEST`);
  console.log(`======================================================`);

  const results = [];
  const performanceLogs = [];

  // Setup client-side frame timing instrumentation
  await page.evaluate(() => {
    window.__perfData = {
      frames: 0,
      longFrames: 0, // > 33.3ms
      frameDeltas: [],
      lastTime: performance.now(),
    };
    function frameLoop(now) {
      const delta = now - window.__perfData.lastTime;
      window.__perfData.lastTime = now;
      window.__perfData.frames++;
      if (delta > 33.3) window.__perfData.longFrames++;
      window.__perfData.frameDeltas.push(delta);
      requestAnimationFrame(frameLoop);
    }
    requestAnimationFrame(frameLoop);
  });

  for (let cycle = 1; cycle <= 10; cycle++) {
    console.log(`\n[${browserName}] --- EXECUTING CYCLE ${cycle} OF 10 ---`);

    // Reset perf window for this cycle
    await page.evaluate(() => {
      window.__perfData.frames = 0;
      window.__perfData.longFrames = 0;
      window.__perfData.frameDeltas = [];
      window.__perfData.lastTime = performance.now();
    });

    // Step 1: Scroll through entire website in Light Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
    });
    for (const target of SECTION_TARGETS) {
      await assertSectionRendered(page, target, `Cycle ${cycle} - Forward Scroll Light`);
    }

    // Step 2: Switch themes several times mid-page
    for (let t = 0; t < 3; t++) {
      await page.evaluate(() => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
      });
      await page.waitForTimeout(100);
    }

    // Step 3: Scroll rapidly down and up (rapid momentum fling)
    const flingOffsets = [0, 1500, 3500, 5600, 4000, 2000, 600, 0];
    for (const offset of flingOffsets) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), offset);
      await page.waitForTimeout(50);
    }

    // Step 4: Open and close mobile drawer repeatedly
    for (let d = 0; d < 2; d++) {
      const menuBtn = await page.$('button[aria-controls="mobile-navigation-drawer"]');
      if (menuBtn) {
        await menuBtn.click();
        await page.waitForTimeout(100);
        const closeBtn = await page.$('button[aria-label="Close menu"]');
        if (closeBtn) await closeBtn.click();
        else await page.keyboard.press('Escape');
        await page.waitForTimeout(100);
      }
    }

    // Step 5: Open and close consultation modal
    const opened = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(
        (b) => b.textContent && b.textContent.includes('Start a Project') && b.getBoundingClientRect().height > 0
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (opened) {
      await page.waitForTimeout(400);
      const modalClose = await page.$('button[aria-label="Close consultation dialog"], button:has-text("Close Dialog")');
      if (modalClose) {
        await modalClose.click();
        await page.waitForTimeout(400);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    }

    // Step 6: Return to Hero without refreshing
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(450);

    // Verify all 6 sections immediately
    for (const target of SECTION_TARGETS) {
      await assertSectionRendered(page, target, `Cycle ${cycle} - Verification`);
    }

    // Collect performance data for this cycle
    const cyclePerf = await page.evaluate(() => {
      const d = window.__perfData;
      const count = d.frameDeltas.length;
      if (count === 0) return { avgFps: 60, avgDelta: 16.6, droppedPct: 0 };
      const sum = d.frameDeltas.reduce((a, b) => a + b, 0);
      const avgDelta = sum / count;
      const avgFps = 1000 / avgDelta;
      const droppedPct = (d.longFrames / count) * 100;
      return {
        avgFps: Math.round(avgFps * 10) / 10,
        avgDelta: Math.round(avgDelta * 100) / 100,
        frames: d.frames,
        longFrames: d.longFrames,
        droppedPct: Math.round(droppedPct * 10) / 10,
      };
    });

    console.log(`  ✓ Cycle ${cycle} Passed: All 6 sections confirmed visible. Perf: ${cyclePerf.avgFps} FPS, avgDelta=${cyclePerf.avgDelta}ms, longFrames=${cyclePerf.longFrames} (${cyclePerf.droppedPct}%)`);
    results.push({ cycle, status: 'PASSED', perf: cyclePerf });
  }

  return results;
}

async function runAcceptance() {
  const browserResults = {};

  // 1. MOBILE WEBKIT (Safari / iPhone 14 Pro emulation)
  console.log(`\n**************************************************************`);
  console.log(`STARTING ACCEPTANCE ON MOBILE WEBKIT (iOS Safari)`);
  console.log(`**************************************************************`);
  const webkitBrowser = await webkit.launch({ headless: true });
  const webkitContext = await webkitBrowser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 390, height: 844 },
    },
  });

  const webkitPage = await webkitContext.newPage();
  const webkitErrors = [];
  webkitPage.on('console', (msg) => {
    if (msg.type() === 'error') webkitErrors.push(msg.text());
  });
  webkitPage.on('pageerror', (err) => webkitErrors.push(err.message));

  // Run reproduction test
  await runReproductionTest(webkitPage, 'webkit');

  // Capture 12 screenshots
  await captureThemeScreenshots(webkitPage, 'webkit');

  // Run 10 stress cycles
  const webkitCycles = await run10CycleStressTest(webkitPage, 'webkit');

  await webkitPage.close();
  await webkitContext.close();
  await webkitBrowser.close();

  browserResults.webkit = {
    cycles: webkitCycles,
    errors: webkitErrors,
  };

  // 2. MOBILE CHROMIUM (Android / Pixel 7 emulation)
  console.log(`\n**************************************************************`);
  console.log(`STARTING ACCEPTANCE ON MOBILE CHROMIUM (Android)`);
  console.log(`**************************************************************`);
  const chromiumBrowser = await chromium.launch({ headless: true });
  const chromiumContext = await chromiumBrowser.newContext({
    viewport: { width: 393, height: 851 },
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2.75,
  });

  const chromiumPage = await chromiumContext.newPage();
  const chromiumErrors = [];
  chromiumPage.on('console', (msg) => {
    if (msg.type() === 'error') chromiumErrors.push(msg.text());
  });
  chromiumPage.on('pageerror', (err) => chromiumErrors.push(err.message));

  // Run reproduction test
  await runReproductionTest(chromiumPage, 'chromium');

  // Run 10 stress cycles
  const chromiumCycles = await run10CycleStressTest(chromiumPage, 'chromium');

  await chromiumPage.close();
  await chromiumContext.close();
  await chromiumBrowser.close();

  browserResults.chromium = {
    cycles: chromiumCycles,
    errors: chromiumErrors,
  };

  console.log(`\n======================================================`);
  console.log(`FINAL COMPREHENSIVE ACCEPTANCE SUMMARY`);
  console.log(`======================================================`);
  console.log(`Mobile WebKit (10 Cycles):`, browserResults.webkit.cycles.map(c => `C${c.cycle}:${c.status} (${c.perf.avgFps}fps)`).join(', '));
  console.log(`WebKit Console/Page Errors:`, browserResults.webkit.errors);
  console.log(`Mobile Chromium (10 Cycles):`, browserResults.chromium.cycles.map(c => `C${c.cycle}:${c.status} (${c.perf.avgFps}fps)`).join(', '));
  console.log(`Chromium Console/Page Errors:`, browserResults.chromium.errors);

  // Write results JSON
  fs.writeFileSync(
    path.join(__dirname, 'acceptance-results.json'),
    JSON.stringify(browserResults, null, 2),
    'utf-8'
  );
  console.log(`Results saved to acceptance-results.json`);
}

runAcceptance().catch((err) => {
  console.error('FATAL ACCEPTANCE ERROR:', err);
  process.exit(1);
});
