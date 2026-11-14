const { webkit } = require('playwright');

async function testTouchFling() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  // wait for preloader to finish
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // We test scrolling down and scrolling back up rapidly
  const scrollTargets = [
    0, 200, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3200,
    // reverse fling:
    2800, 2300, 1900, 1500, 1100, 800, 500, 200, 0
  ];
  
  for (const y of scrollTargets) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    // wait 150ms (realistic perception window for human eye during scrolling)
    await page.waitForTimeout(150);
    
    const inViewportStates = await page.evaluate(() => {
      // Find all reveal containers and wrappers
      const reveals = Array.from(document.querySelectorAll('[class*="transition-[opacity"], [data-hero-visible] > div, [class*="overflow-hidden"] > div.transition-all'));
      const viewportHeight = window.innerHeight;
      const results = [];
      for (const el of reveals) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 20 && rect.top < viewportHeight - 20) {
          const style = window.getComputedStyle(el);
          const opacity = parseFloat(style.opacity);
          results.push({
            classes: el.className.slice(0, 50),
            text: (el.innerText || '').slice(0, 40).replace(/\n/g, ' '),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            opacity: opacity,
            transform: style.transform
          });
        }
      }
      return results;
    });

    const hidden = inViewportStates.filter(r => r.opacity < 0.2);
    console.log(`scrollY=${y.toString().padStart(4)} | in-view reveals: ${inViewportStates.length} | hidden reveals: ${hidden.length}`);
    if (hidden.length > 0) {
      console.log('   -> HIDDEN in viewport:', hidden.map(h => `"${h.text.slice(0, 25)}" (top=${h.top}, opacity=${h.opacity.toFixed(2)})`));
    }
  }

  await browser.close();
}

testTouchFling().catch(console.error);
