const { webkit } = require('playwright');

async function testUnifiedAlgorithm() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 384, height: 832 } });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000);

  const results = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const logs = [];
    const buffer = 80;
    const hysteresis = 200;
    const innerHeight = window.innerHeight;

    for (let y = 0; y <= 3000; y += 100) {
      window.scrollTo(0, y);
      const rect = hero.getBoundingClientRect();
      const inBuffer = rect.bottom > -buffer && rect.top < innerHeight + buffer;
      const farOutside = rect.bottom < -hysteresis || rect.top > innerHeight + hysteresis;
      logs.push({ y, rectTop: Math.round(rect.top), rectBottom: Math.round(rect.bottom), inBuffer, farOutside });
    }
    return logs;
  });

  console.log('--- Hero Bounding Rect & Buffer Evaluation across scrollY ---');
  for (const r of results) {
    if (r.y <= 600 || (r.y >= 1600 && r.y <= 2100)) {
      console.log(`scrollY=${r.y.toString().padStart(4)} | top=${r.rectTop.toString().padStart(5)} | bottom=${r.rectBottom.toString().padStart(5)} | inBuffer=${r.inBuffer.toString().padEnd(5)} | farOutside=${r.farOutside}`);
    }
  }
  await browser.close();
}

testUnifiedAlgorithm().catch(console.error);

