const { webkit } = require('playwright');

async function testRapidScrollFling() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // Scroll down to 6000 over 10 steps of 600px each with 30ms delay (rapid fling)
  console.log('--- Flinging down to 6000 ---');
  for (let y = 0; y <= 6000; y += 600) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(200);

  console.log('--- Flinging up from 6000 to 0 ---');
  const snapshots = [];
  for (let y = 6000; y >= 0; y -= 400) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);

    const state = await page.evaluate((currY) => {
      const hero = document.getElementById('hero');
      const heroH1 = document.getElementById('hero-primary-headline');
      const heroH1Style = heroH1 ? window.getComputedStyle(heroH1.closest('.animate-hero-2')?.parentElement || heroH1) : null;
      
      const services = document.getElementById('services');
      const servicesH2 = document.getElementById('services-heading');
      const servicesCards = Array.from(document.querySelectorAll('#services article')).map(c => {
        const wrap = c.closest('[class*="transition-[opacity"]');
        return wrap ? window.getComputedStyle(wrap).opacity : 'n/a';
      });

      return {
        scrollY: currY,
        heroDataVisible: hero?.getAttribute('data-hero-visible'),
        heroCompOpacity: heroH1Style ? heroH1Style.opacity : 'n/a',
        servicesCardsOpacities: servicesCards
      };
    }, y);
    snapshots.push(state);
  }

  for (const s of snapshots) {
    console.log(`scrollY=${s.scrollY.toString().padStart(4)} | heroVisible=${s.heroDataVisible} (opacity=${s.heroCompOpacity}) | servicesCards=[${s.servicesCardsOpacities.join(', ')}]`);
  }

  await browser.close();
}

testRapidScrollFling().catch(console.error);

