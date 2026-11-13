const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const outputDir = path.resolve('tests/final-audit/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // 1. Capture Preloader
  const preloaderPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Intercept fonts or slow down to capture preloader cleanly
  await preloaderPage.goto('http://localhost:5173/');
  // Preloader is visible immediately
  try {
    await preloaderPage.waitForSelector('[data-testid="cinematic-preloader"]', { timeout: 3000 });
    await preloaderPage.screenshot({ path: path.join(outputDir, '01-cinematic-preloader.png') });
  } catch (e) {
    console.log('Preloader snapshot skipped or already completed:', e.message);
  }
  await preloaderPage.close();

  // 2. Desktop Dark Mode (Full page & Nav close-up)
  const desktopDark = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopDark.goto('http://localhost:5173/');
  await desktopDark.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await desktopDark.waitForTimeout(600);
  await desktopDark.screenshot({ path: path.join(outputDir, '02-desktop-dark-hero.png') });

  // Navigation close-up
  const desktopNav = desktopDark.locator('header');
  await desktopNav.screenshot({ path: path.join(outputDir, '03-desktop-header-logo-dark.png') });

  // Footer close-up
  const footerDark = desktopDark.locator('footer');
  await footerDark.scrollIntoViewIfNeeded();
  await desktopDark.waitForTimeout(600);
  await footerDark.screenshot({ path: path.join(outputDir, '04-desktop-footer-logo-dark.png') });
  await desktopDark.close();

  // 3. Desktop Light Mode
  const desktopLight = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopLight.goto('http://localhost:5173/');
  await desktopLight.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  // Toggle theme
  await desktopLight.locator('#desktop-theme-switcher').click();
  await desktopLight.waitForTimeout(600);
  await desktopLight.screenshot({ path: path.join(outputDir, '05-desktop-light-hero.png') });

  // Light Nav close-up
  await desktopLight.locator('header').screenshot({ path: path.join(outputDir, '06-desktop-header-logo-light.png') });

  // Light Footer close-up
  const footerLight = desktopLight.locator('footer');
  await footerLight.scrollIntoViewIfNeeded();
  await desktopLight.waitForTimeout(600);
  await footerLight.screenshot({ path: path.join(outputDir, '07-desktop-footer-logo-light.png') });
  await desktopLight.close();

  // 4. Mobile Dark Mode & Drawer
  const mobileDark = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobileDark.goto('http://localhost:5173/');
  await mobileDark.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await mobileDark.waitForTimeout(600);
  await mobileDark.screenshot({ path: path.join(outputDir, '08-mobile-dark-hero.png') });

  // Open drawer
  await mobileDark.locator('button[aria-label="Open navigation menu"]').click();
  await mobileDark.waitForTimeout(400);
  await mobileDark.screenshot({ path: path.join(outputDir, '09-mobile-dark-drawer.png') });
  await mobileDark.close();

  // 5. Mobile Light Mode & Drawer
  const mobileLight = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobileLight.goto('http://localhost:5173/');
  await mobileLight.waitForSelector('[data-testid="cinematic-preloader"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  // Toggle theme
  await mobileLight.locator('#mobile-theme-switcher').click();
  await mobileLight.waitForTimeout(400);
  await mobileLight.screenshot({ path: path.join(outputDir, '10-mobile-light-hero.png') });

  // Open drawer
  await mobileLight.locator('button[aria-label="Open navigation menu"]').click();
  await mobileLight.waitForTimeout(400);
  await mobileLight.screenshot({ path: path.join(outputDir, '11-mobile-light-drawer.png') });
  await mobileLight.close();

  await browser.close();
  console.log('All final deliverable screenshots captured successfully in:', outputDir);
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});

