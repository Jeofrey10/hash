const { webkit } = require('playwright');

async function diagnose() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
  });

  const targetUrl = process.argv[2] || 'https://hashdev-ten.vercel.app/';
  const page = await context.newPage();
  await page.goto(targetUrl);
  await page.waitForTimeout(2000);

  const report = await page.evaluate(() => {
    // 1. Audit all will-change elements
    const willChangeElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const st = window.getComputedStyle(el);
      return st.willChange && st.willChange !== 'auto';
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className ? String(el.className).substring(0, 50) : '',
      willChange: window.getComputedStyle(el).willChange,
      rect: {
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
      }
    }));

    // 2. Audit all backdrop-filter elements
    const backdropFilterElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const st = window.getComputedStyle(el);
      return (st.backdropFilter && st.backdropFilter !== 'none') || 
             (st.webkitBackdropFilter && st.webkitBackdropFilter !== 'none');
    }).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className ? String(el.className).substring(0, 50) : '',
      filter: window.getComputedStyle(el).backdropFilter || window.getComputedStyle(el).webkitBackdropFilter,
      rect: {
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
      }
    }));

    // 3. Audit all CSS blur filters
    const blurFilterElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const st = window.getComputedStyle(el);
      return st.filter && st.filter.includes('blur');
    }).map(el => ({
      tag: el.tagName,
      className: el.className ? String(el.className).substring(0, 50) : '',
      filter: window.getComputedStyle(el).filter,
      rect: {
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
      }
    }));

    // 4. Calculate approximate GPU memory for layer textures
    // Each composited layer on 3x DPR takes: (width * 3) * (height * 3) * 4 bytes
    let totalLayerBytes = 0;
    willChangeElements.forEach(item => {
      const w = item.rect.width * 3;
      const h = item.rect.height * 3;
      totalLayerBytes += w * h * 4;
    });

    return {
      willChangeCount: willChangeElements.length,
      willChangeElements: willChangeElements.slice(0, 10),
      backdropFilterCount: backdropFilterElements.length,
      backdropFilterElements,
      blurFilterCount: blurFilterElements.length,
      blurFilterElements,
      approxGpuVramMb: Math.round((totalLayerBytes / (1024 * 1024)) * 10) / 10,
    };
  });

  console.log('=== PHYSICAL iOS COMPOSITING & MEMORY DIAGNOSTIC ===');
  console.log(`Will-Change Elements: ${report.willChangeCount}`);
  console.log(`Estimated will-change Layer VRAM: ${report.approxGpuVramMb} MB`);
  console.log(`Backdrop Filter Elements: ${report.backdropFilterCount}`);
  console.log('Backdrop filters:', report.backdropFilterElements);
  console.log(`Large Blur Filter Elements: ${report.blurFilterCount}`);
  console.log('Blur filters:', report.blurFilterElements);

  await browser.close();
}

diagnose().catch(console.error);

