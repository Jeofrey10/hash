const { webkit } = require('playwright');

async function testModal() {
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
  });

  const page = await context.newPage();
  await page.goto('http://localhost:4173');
  await page.waitForTimeout(1600);

  console.log('1. Initial #root inert:', await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));

  const testPositions = [
    { name: 'Hero', y: 0, selector: '#hero' },
    { name: 'Services', y: 1000, selector: '#services' },
    { name: 'Approach', y: 2200, selector: '#approach' },
    { name: 'Capabilities', y: 3400, selector: '#capabilities' },
    { name: 'Contact', y: 4700, selector: '#contact' },
  ];

  for (const pos of testPositions) {
    console.log(`\n=== Testing ${pos.name} (y=${pos.y}) ===`);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pos.y);
    await page.waitForTimeout(400);

    const menuBtn = await page.$('button[aria-controls="mobile-navigation-drawer"]');
    console.log(`[${pos.name}] MenuBtn found:`, !!menuBtn);
    console.log(`[${pos.name}] #root inert before drawer:`, await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));
    await menuBtn.click();
    await page.waitForTimeout(200);

    // Switch theme in drawer
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

    const closeBtn = await page.$('button[aria-label="Close menu"]');
    await closeBtn.click();
    await page.waitForTimeout(200);

    console.log(`[${pos.name}] #root inert after drawer:`, await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));

    // Modal
    const opened = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent && b.textContent.includes('Start a Project') && b.getBoundingClientRect().height > 0);
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log(`[${pos.name}] Modal opened:`, opened);
    await page.waitForTimeout(400);
    console.log(`[${pos.name}] #root inert during modal:`, await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));

    if (opened) {
      const mClose = await page.$('button[aria-label="Close consultation dialog"], button:has-text("Close Dialog")');
      console.log(`[${pos.name}] Modal close button found:`, !!mClose);
      if (mClose) await mClose.click();
      await page.waitForTimeout(400);
    }

    console.log(`[${pos.name}] #root inert after modal:`, await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));
  }

  await browser.close();
}

testModal().catch(console.error);
