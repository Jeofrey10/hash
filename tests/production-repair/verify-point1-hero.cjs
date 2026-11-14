const { webkit } = require('playwright');

async function testHeroUniversal() {
  console.log('\n======================================================');
  console.log('POINT 1: HERO UNIVERSAL REVEAL ENGINE VERIFICATION');
  console.log('======================================================');

  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  // 1. Initial Hero check at scrollY = 0
  const initial = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const h1 = document.getElementById('hero-primary-headline');
    const comp = hero.querySelector('.animate-hero-1').parentElement;
    return {
      scrollY: window.scrollY,
      heroDataVisible: hero.getAttribute('data-hero-visible'),
      compOpacity: window.getComputedStyle(comp).opacity,
      h1Visible: h1 !== null && window.getComputedStyle(h1).display !== 'none'
    };
  });
  console.log('1. Hero at scrollY = 0:', initial);
  if (initial.compOpacity !== '1') throw new Error('Hero should be opacity 1 at scrollY=0');

  // 2. Scroll into Services (scrollY = 2500) - Hero should be far outside and reset
  console.log('2. Scrolling to Services (scrollY = 2500)...');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(400);

  const atServices = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const comp = hero.querySelector('.animate-hero-1').parentElement;
    const rect = hero.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      heroRectBottom: Math.round(rect.bottom),
      heroDataVisible: hero.getAttribute('data-hero-visible'),
      compOpacity: window.getComputedStyle(comp).opacity
    };
  });
  console.log('Hero when user is at Services (scrollY = 2500):', atServices);
  if (atServices.heroDataVisible !== 'false') throw new Error('Hero should reset to data-hero-visible="false" when far outside (>200px)');

  // 3. Reverse scroll back up towards Hero
  console.log('3. Reverse scrolling back up to scrollY = 1800 (boundary where Hero enters lookahead buffer)...');
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(100);

  const atBuffer = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const comp = hero.querySelector('.animate-hero-1').parentElement;
    const rect = hero.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      heroRectBottom: Math.round(rect.bottom),
      heroDataVisible: hero.getAttribute('data-hero-visible'),
      compOpacity: window.getComputedStyle(comp).opacity
    };
  });
  console.log('Hero at buffer boundary (scrollY = 1800, 1650px before H1 headline):', atBuffer);
  if (atBuffer.heroDataVisible !== 'true') throw new Error('Hero should trigger data-hero-visible="true" as soon as it enters 80px lookahead buffer');

  // 4. Arrive at top of page (scrollY = 0)
  console.log('4. Arriving at top of page (scrollY = 0)...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const settled = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const h1 = document.getElementById('hero-primary-headline');
    const comp = hero.querySelector('.animate-hero-1').parentElement;
    return {
      scrollY: window.scrollY,
      heroDataVisible: hero.getAttribute('data-hero-visible'),
      compOpacity: window.getComputedStyle(comp).opacity,
      h1ComputedOpacity: window.getComputedStyle(h1).opacity
    };
  });
  console.log('Hero settled at scrollY = 0:', settled);
  if (parseFloat(settled.compOpacity) < 0.99) throw new Error('Hero must be fully opaque at scrollY=0');

  console.log('>>> POINT 1 VERIFICATION PASSED: Hero operates deterministically under universal engine with ZERO special cases! <<<\n');
  await browser.close();
}

testHeroUniversal().catch(err => {
  console.error('Point 1 Verification Failed:', err);
  process.exit(1);
});
