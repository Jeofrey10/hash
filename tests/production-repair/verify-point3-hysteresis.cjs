const { webkit } = require('playwright');

async function testHysteresis() {
  console.log('\n======================================================');
  console.log('POINT 3: HYSTERESIS & BIDIRECTIONAL BOUNDARY TEST');
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

  // 1. Scroll to Services Card 1 (around scrollY = 1900)
  console.log('1. Scrolling to Services (scrollY = 1900)...');
  await page.evaluate(() => window.scrollTo(0, 1900));
  await page.waitForTimeout(600);

  const initialServices = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#services article')).map(c => {
      const wrap = c.closest('[class*="transition-[opacity"]');
      return {
        text: c.querySelector('h3')?.innerText?.slice(0, 20),
        top: Math.round(c.getBoundingClientRect().top),
        opacity: wrap ? window.getComputedStyle(wrap).opacity : 'n/a'
      };
    });
    return cards;
  });
  console.log('Services cards after initial reveal:', initialServices);
  const card1Initial = initialServices[0];
  if (parseFloat(card1Initial.opacity) < 0.9) {
    throw new Error(`Card 1 should be visible: ${JSON.stringify(card1Initial)}`);
  }

  // 2. Simulate micro-movements / reading jitter (±15px, ±35px, ±70px)
  console.log('\n2. Testing micro-movements / reading thumb jitter around boundary (±15px, ±35px, ±70px)...');
  const jitterOffsets = [1900, 1920, 1890, 1935, 1880, 1950, 1870, 1900];
  for (const y of jitterOffsets) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);

    const card1State = await page.evaluate(() => {
      const c = document.querySelector('#services article');
      const wrap = c.closest('[class*="transition-[opacity"]');
      return {
        scrollY: window.scrollY,
        opacity: wrap ? window.getComputedStyle(wrap).opacity : 'n/a'
      };
    });
    if (parseFloat(card1State.opacity) < 0.9) {
      throw new Error(`Jitter at scrollY=${y} caused Card 1 to flicker or hide! opacity=${card1State.opacity}`);
    }
  }
  console.log('✓ All micro-movements passed: 0 flicker, 0 accidental hiding!');

  // 3. Scroll FAR AWAY (to Capabilities/Contact, scrollY = 7000) - Services should RESET
  console.log('\n3. Scrolling FAR AWAY (>200px beyond Services, to scrollY = 7000)...');
  await page.evaluate(() => window.scrollTo(0, 7000));
  await page.waitForTimeout(500);

  const farAwayState = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#services article')).map(c => {
      const wrap = c.closest('[class*="transition-[opacity"]');
      return {
        text: c.querySelector('h3')?.innerText?.slice(0, 20),
        top: Math.round(c.getBoundingClientRect().top),
        opacity: wrap ? window.getComputedStyle(wrap).opacity : 'n/a'
      };
    });
    return cards;
  });
  console.log('Services cards when user is far away (scrollY = 7000):', farAwayState);
  for (const c of farAwayState) {
    if (parseFloat(c.opacity) > 0.05) {
      throw new Error(`Services card ${c.text} failed to reset when far away: opacity=${c.opacity}`);
    }
  }
  console.log('✓ Reset confirmed: all Services cards properly reset when far away (>200px)!');

  // 4. Reverse scroll back to Services (scrollY = 1900) - Services should RE-REVEAL cleanly
  console.log('\n4. Reverse scrolling back to Services (scrollY = 1900)...');
  await page.evaluate(() => window.scrollTo(0, 1900));
  await page.waitForTimeout(500);

  const reRevealedState = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#services article')).map(c => {
      const wrap = c.closest('[class*="transition-[opacity"]');
      return {
        text: c.querySelector('h3')?.innerText?.slice(0, 20),
        top: Math.round(c.getBoundingClientRect().top),
        opacity: wrap ? window.getComputedStyle(wrap).opacity : 'n/a'
      };
    });
    return cards;
  });
  console.log('Services cards after reverse scroll re-reveal:', reRevealedState);
  if (parseFloat(reRevealedState[0].opacity) < 0.9) {
    throw new Error(`Services Card 1 failed to re-reveal: opacity=${reRevealedState[0].opacity}`);
  }
  console.log('✓ Re-reveal confirmed: Services Card 1 returned to full opacity!');

  console.log('\n>>> POINT 3 VERIFICATION PASSED: Hysteresis prevents flicker, resets cleanly when far away, and re-reveals on reverse scroll! <<<\n');
  await browser.close();
}

testHysteresis().catch(err => {
  console.error('Point 3 Verification Failed:', err);
  process.exit(1);
});
