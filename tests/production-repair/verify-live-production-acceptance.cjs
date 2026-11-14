const { webkit, chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LIVE_URL = 'https://hashdev-ten.vercel.app/';
const SCREENSHOTS_DIR = path.join(__dirname, 'live-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIDEO_DIR = path.join(__dirname, 'live-video');
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

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
  await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), target.scrollPos);
  await page.waitForTimeout(450);

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

    const centerX = Math.floor(contentRect.left + contentRect.width / 2);
    const centerY = Math.floor(contentRect.top + contentRect.height / 2);
    let hitOk = false;
    let hitTag = 'none';

    if (centerX >= 0 && centerX <= window.innerWidth && centerY >= 0 && centerY <= window.innerHeight) {
      const hitEl = document.elementFromPoint(centerX, centerY);
      hitTag = hitEl ? hitEl.tagName + (hitEl.id ? '#' + hitEl.id : '') : 'none';
      hitOk = hitEl ? (content.contains(hitEl) || hitEl.contains(content)) : false;
    } else {
      hitOk = true;
    }

    const text = (content.textContent || '').trim();
    const textMatches = text.toLowerCase().includes(t.expectedText.toLowerCase());

    return {
      found: true,
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
    throw new Error(`[LIVE ASSERT FAIL - ${contextMsg}] ${info.error}`);
  }

  const opVal = parseFloat(info.contentOpacity);
  if (opVal < 0.95) {
    throw new Error(`[LIVE ASSERT FAIL - ${contextMsg}] ${target.name} opacity is ${info.contentOpacity} (expected >= 0.95)`);
  }
  if (info.contentVis === 'hidden' || info.contentDisplay === 'none') {
    throw new Error(`[LIVE ASSERT FAIL - ${contextMsg}] ${target.name} is hidden/none`);
  }
  if (info.contentBox.width === 0 || info.contentBox.height === 0) {
    throw new Error(`[LIVE ASSERT FAIL - ${contextMsg}] ${target.name} has zero bounding box`);
  }
  if (!info.textMatches) {
    throw new Error(`[LIVE ASSERT FAIL - ${contextMsg}] ${target.name} text mismatch: got "${info.actualText}"`);
  }

  return info;
}

async function testLiveProduction(browserType, browserName) {
  console.log(`\n**************************************************************`);
  console.log(`TESTING LIVE PRODUCTION DEPLOYMENT ON ${browserName.toUpperCase()}`);
  console.log(`URL: ${LIVE_URL}`);
  console.log(`**************************************************************`);

  const browser = await browserType.launch({ headless: true });
  const isWebKit = browserName.toLowerCase() === 'webkit';
  const context = await browser.newContext({
    viewport: isWebKit ? { width: 390, height: 844 } : { width: 393, height: 851 },
    userAgent: isWebKit
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    isMobile: true,
    hasTouch: true,
    ...(isWebKit ? {
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 390, height: 844 },
      }
    } : {}),
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // 1. Initial Load in Light Mode
  console.log(`\nStep 1: Navigating to live production URL...`);
  const response = await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(`HTTP Response Status: ${response.status()}`);

  await page.waitForTimeout(1600); // allow cinematic preloader to complete

  // Force Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.setItem('hashdevs-theme', 'light'); } catch (e) {}
    window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
  });
  await page.waitForTimeout(200);

  // 2. Scroll through all six sections in Light Mode
  console.log(`\nStep 2: Scrolling through all six sections in Light Mode...`);
  for (const target of SECTION_TARGETS) {
    const res = await assertSectionRendered(page, target, 'Light Mode Full Page Scroll');
    console.log(`  ✓ [${target.name}] Content verified: "${res.actualText}..." (opacity=${res.contentOpacity}, box=${res.contentBox.width}x${res.contentBox.height})`);
  }

  // Capture 12 Screenshots on WebKit
  if (isWebKit) {
    console.log(`\nCapturing 12 live screenshots across Light and Dark themes...`);
    for (const theme of ['light', 'dark']) {
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
      }, theme);
      await page.waitForTimeout(300);

      for (const target of SECTION_TARGETS) {
        await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), target.scrollPos);
        await page.waitForTimeout(400);

        const screenshotPath = path.join(SCREENSHOTS_DIR, `live-${target.name.toLowerCase()}-${theme}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`  ✓ Saved live screenshot: live-${target.name.toLowerCase()}-${theme}.png`);
      }
    }

    // Reset to Light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      window.dispatchEvent(new CustomEvent('hashdevs-viewport-check'));
    });
    await page.waitForTimeout(200);
  }

  // 3-9. Test Drawer & Modal sequence at Hero, Services, Approach, Capabilities, and Contact
  const testPositions = [
    { name: 'Hero', y: 0, selector: '#hero' },
    { name: 'Services', y: 1000, selector: '#services' },
    { name: 'Approach', y: 2200, selector: '#approach' },
    { name: 'Capabilities', y: 3400, selector: '#capabilities' },
    { name: 'Contact', y: 4700, selector: '#contact' },
  ];

  for (const pos of testPositions) {
    console.log(`\nStep 3-9: Testing Drawer & Modal Sequence at ${pos.name} (scrollY=${pos.y})...`);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pos.y);
    await page.waitForTimeout(400);

    // 3. Open mobile navigation drawer
    const menuBtn = await page.$('button[aria-controls="mobile-navigation-drawer"]');
    if (!menuBtn) throw new Error('Menu button not found on live site');
    await menuBtn.click();
    await page.waitForTimeout(200);

    // 4. Switch Light -> Dark -> Light
    await page.evaluate(() => {
      const btn = document.querySelector('#drawer-theme-switcher');
      if (btn) btn.click();
    });
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const btn = document.querySelector('#drawer-theme-switcher');
      if (btn) btn.click();
    });
    await page.waitForTimeout(150);

    // 5. Close drawer
    const closeBtn = await page.$('button[aria-label="Close menu"]');
    if (closeBtn) await closeBtn.click();
    else await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 6. Wait without scrolling (500ms)
    await page.waitForTimeout(500);

    // 7. Verify all visible content remains present
    const visibleCheck = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { found: false };
      const st = window.getComputedStyle(el);
      return { found: true, opacity: st.opacity, vis: st.visibility };
    }, pos.selector);

    if (parseFloat(visibleCheck.opacity) < 0.95) {
      throw new Error(`[LIVE REPRO FAIL] ${pos.name} content disappeared after drawer close on production! Opacity: ${visibleCheck.opacity}`);
    }
    console.log(`  ✓ ${pos.name} content remained solid after drawer close (opacity=${visibleCheck.opacity})`);

    // 8. Open and close consultation modal
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
      const dialog = page.locator('div[role="dialog"]');
      const appeared = await dialog.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
      if (appeared) {
        const modalClose = page.locator('button[aria-label="Close consultation dialog"], button:has-text("Close Dialog")').first();
        if (await modalClose.count() > 0) {
          await modalClose.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await dialog.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
      }
    }

    // Wait without scrolling
    await page.waitForTimeout(400);
    const postModalCheck = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? window.getComputedStyle(el).opacity : '0';
    }, pos.selector);

    if (parseFloat(postModalCheck) < 0.95) {
      throw new Error(`[LIVE REPRO FAIL] ${pos.name} disappeared after modal close on production! Opacity: ${postModalCheck}`);
    }
    console.log(`  ✓ ${pos.name} content remained solid after modal close (opacity=${postModalCheck})`);
  }

  // 10. Rapidly scroll up and down through the entire page
  console.log(`\nStep 10: Rapidly scrolling up and down through the entire page (fling)...`);
  const flingOffsets = [0, 1200, 2500, 4200, 5600, 3800, 1800, 600, 0];
  for (const y of flingOffsets) {
    await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(500);

  // Return to Hero and assert all 6 sections
  console.log(`\nFinal Verification across all 6 sections post-fling...`);
  for (const target of SECTION_TARGETS) {
    const res = await assertSectionRendered(page, target, 'Post-Fling Final Verification');
    console.log(`  ✓ [${target.name}] Content verified: "${res.actualText}..." (opacity=${res.contentOpacity})`);
  }

  await page.close();
  await context.close();
  await browser.close();

  console.log(`\n>>> [${browserName.toUpperCase()}] LIVE PRODUCTION TEST PASSED COMPLETELY <<<`);
  console.log(`Console Errors:`, consoleErrors);
  console.log(`Page Errors:`, pageErrors);

  return {
    browser: browserName,
    status: 'PASSED',
    consoleErrors,
    pageErrors,
  };
}

async function runLiveVerification() {
  console.log(`======================================================`);
  console.log(`HASH.DEVS LIVE PRODUCTION ACCEPTANCE SUITE`);
  console.log(`Deployed URL: ${LIVE_URL}`);
  console.log(`======================================================`);

  const webkitResult = await testLiveProduction(webkit, 'webkit');
  const chromiumResult = await testLiveProduction(chromium, 'chromium');

  const finalSummary = {
    url: LIVE_URL,
    timestamp: new Date().toISOString(),
    results: [webkitResult, chromiumResult],
  };

  fs.writeFileSync(
    path.join(__dirname, 'live-acceptance-results.json'),
    JSON.stringify(finalSummary, null, 2),
    'utf-8'
  );
  console.log(`\nFinal live verification results saved to live-acceptance-results.json`);
}

runLiveVerification().catch((err) => {
  console.error('FATAL LIVE VERIFICATION ERROR:', err);
  process.exit(1);
});
