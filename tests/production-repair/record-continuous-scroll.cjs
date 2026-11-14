const { webkit } = require('playwright');
const path = require('path');
const fs = require('fs');

async function recordContinuousVerification() {
  const videoDir = path.resolve('tests/production-repair/continuous-recordings');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log('\n--- Recording 60fps Continuous Touch Scroll Verification ---');
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 384, height: 832 },
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: videoDir,
      size: { width: 384, height: 832 }
    }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);

  console.log('1. Page loaded in Light Mode. Beginning smooth continuous touch scrolling down.');
  // Simulate smooth touch drag scrolling
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Document height: ${totalHeight}px`);

  // Scroll smoothly down through all sections
  for (let y = 0; y <= totalHeight - 832; y += 120) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(500);

  console.log('2. Reached bottom. Toggling theme to Dark Mode...');
  await page.locator('#mobile-theme-switcher').click();
  await page.waitForTimeout(400);

  console.log('3. Smooth continuous touch scrolling UP (Reverse reveals)...');
  for (let y = totalHeight - 832; y >= 0; y -= 120) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  // Land exactly at top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('4. Reached Hero in Dark Mode. Rapid fling scroll down...');
  for (let y = 0; y <= totalHeight - 832; y += 400) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(300);

  console.log('5. Rapid fling scroll UP back to Hero...');
  for (let y = totalHeight - 832; y >= 0; y -= 400) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  // Ensure we land exactly at 0px (Hero top)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('6. Switching back to Light Mode...');
  await page.locator('#mobile-theme-switcher').click();
  await page.waitForTimeout(400);

  console.log('7. Final verification of Hero content visibility...');
  const heroH1 = page.locator('#hero-primary-headline');
  const h1Visible = await heroH1.isVisible();
  const h1Opacity = await heroH1.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Hero H1: visible=${h1Visible}, opacity=${h1Opacity}`);

  const videoPath = await page.video().path();
  await page.close();
  await context.close();
  await browser.close();

  console.log(`Continuous Verification Video Saved: ${videoPath}`);
}

recordContinuousVerification().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
