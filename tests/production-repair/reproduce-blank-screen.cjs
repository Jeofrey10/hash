const { webkit } = require('playwright');
const path = require('path');
const fs = require('fs');

async function reproduce() {
  const screenshotDir = path.resolve('tests/production-repair/reproduction-evidence');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('--- Phase 1: Mobile WebKit Reproduction Sequence ---');
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // Step 1: Open in Dark Mode
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);

  console.log('1. Page loaded in Dark Mode.');
  await page.screenshot({ path: path.join(screenshotDir, '01-webkit-dark-hero.png') });

  // Step 2: Scroll through every section
  const sections = ['services', 'approach', 'capabilities', 'contact'];
  for (const sec of sections) {
    console.log(`Scrolling to #${sec}...`);
    await page.locator(`#${sec}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Check visibility of section heading and content
    const heading = page.locator(`#${sec} h2`);
    const isHeadingVisible = await heading.isVisible();
    const opacity = await heading.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`Section #${sec} heading: visible=${isHeadingVisible}, opacity=${opacity}`);

    await page.screenshot({ path: path.join(screenshotDir, `02-webkit-dark-${sec}.png`) });
  }

  // Step 3: Switch to Light Mode while at the bottom
  console.log('3. Switching to Light Mode while in Contact section...');
  // Open mobile drawer to toggle theme
  await page.locator('button[aria-label="Open navigation menu"]').click();
  await page.waitForTimeout(300);
  await page.locator('#drawer-theme-switcher').click();
  await page.waitForTimeout(300);
  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(400);

  const themeAfterSwitch = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme is now:', themeAfterSwitch);
  await page.screenshot({ path: path.join(screenshotDir, '03-webkit-light-contact-after-toggle.png') });

  // Step 4: Scroll back up rapidly to Hero
  console.log('4. Rapid scrolling upward to Hero in Light Mode...');
  for (let y = 3000; y >= 0; y -= 500) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '04-webkit-light-hero-after-scrollup.png') });

  // Check Hero elements in Light Mode
  const heroH1 = page.locator('#hero-primary-headline');
  const heroVisible = await heroH1.isVisible();
  const heroOpacity = await heroH1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Hero H1 after rapid scrollup in Light Mode: visible=${heroVisible}, opacity=${heroOpacity}`);

  // Step 5: Switch back to Dark Mode and repeat rapid scrolling down and up
  console.log('5. Toggling theme repeatedly while scrolling...');
  for (let i = 0; i < 3; i++) {
    await page.locator('#mobile-theme-switcher').click();
    await page.waitForTimeout(200);
    const t = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Cycle ${i + 1}: toggled to ${t}`);

    // rapid scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(200);

    // check services cards
    const cardOpacities = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services article'));
      return cards.map(c => ({
        text: c.querySelector('h3')?.innerText,
        opacity: window.getComputedStyle(c).opacity,
        display: window.getComputedStyle(c).display,
        visibility: window.getComputedStyle(c).visibility
      }));
    });
    console.log(`Services cards state at cycle ${i + 1}:`, cardOpacities);
  }

  // Step 6: Rapid scroll down to footer then rapid scroll to top
  console.log('6. Final rapid scroll down and up sequence...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '05-webkit-bottom-state.png') });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '06-webkit-top-state.png') });

  // Inspect any blank / hidden elements
  const blankStateAudit = await page.evaluate(() => {
    const checks = [];
    const elementsToCheck = [
      { selector: '#hero', name: 'Hero' },
      { selector: '#hero-primary-headline', name: 'Hero Headline' },
      { selector: '#services', name: 'Services' },
      { selector: '#services-heading', name: 'Services Heading' },
      { selector: '#services-offerings-grid', name: 'Services Grid' },
      { selector: '#approach', name: 'Approach' },
      { selector: '#approach-heading', name: 'Approach Heading' },
      { selector: '#capabilities', name: 'Capabilities' },
      { selector: '#capabilities-heading', name: 'Capabilities Heading' },
      { selector: '#contact', name: 'Contact' },
      { selector: '#contact-heading', name: 'Contact Heading' },
    ];

    for (const item of elementsToCheck) {
      const el = document.querySelector(item.selector);
      if (!el) {
        checks.push({ name: item.name, exists: false });
        continue;
      }
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      checks.push({
        name: item.name,
        exists: true,
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        width: rect.width,
        height: rect.height,
        top: rect.top,
      });
    }
    return checks;
  });

  console.log('Blank-screen / Content Audit:', JSON.stringify(blankStateAudit, null, 2));
  console.log('Console Errors caught:', consoleErrors);

  await browser.close();
}

reproduce().catch(err => {
  console.error('Reproduction sequence failed:', err);
  process.exit(1);
});

