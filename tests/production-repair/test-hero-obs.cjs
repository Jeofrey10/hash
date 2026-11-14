const { webkit } = require('playwright');

async function testHeroObserver() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true
  });
  const page = await context.newPage();

  // Inject logger into page before load
  await page.addInitScript(() => {
    window.__heroLogs = [];
    window.__revealLogs = [];
  });

  await page.goto('http://localhost:4173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // Set up tracking on #hero
  await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        window.__heroLogs.push({
          time: performance.now(),
          scrollY: window.scrollY,
          isIntersecting: e.isIntersecting,
          intersectionRatio: e.intersectionRatio,
          boundingClientRect: {
            top: e.boundingClientRect.top,
            bottom: e.boundingClientRect.bottom,
            height: e.boundingClientRect.height
          }
        });
      }
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
    obs.observe(hero);
  });

  console.log('1. Scroll down to scrollY=2500');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(300);

  console.log('2. Scroll up to scrollY=600');
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);

  console.log('3. Scroll up to scrollY=300');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);

  console.log('4. Scroll up to scrollY=0');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const logs = await page.evaluate(() => window.__heroLogs);
  console.log('Hero Observer Logs:', JSON.stringify(logs, null, 2));

  const heroAttr = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    return {
      dataHeroVisible: hero.getAttribute('data-hero-visible'),
      compOpacity: window.getComputedStyle(hero.querySelector('.animate-hero-1').parentElement).opacity
    };
  });
  console.log('Hero final state:', heroAttr);

  await browser.close();
}

testHeroObserver().catch(console.error);

