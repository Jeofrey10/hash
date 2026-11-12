import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Stage 07 Global Animation Engineering & Motion System', () => {
  const screenshotDir = path.join(process.cwd(), 'tests', 'e2e', 'screenshots', 'stage-07');

  test('should verify hero entrance sequence and settled state', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify hero elements are visible
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    const heroH1 = hero.getByRole('heading', { level: 1 });
    await expect(heroH1).toBeVisible();
    await expect(heroH1).toContainText('Build with purpose.');

    // Wait for cinematic entrance animation to settle
    await page.waitForTimeout(900);

    // Capture settled hero screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '01-hero-motion-settled.png'),
      fullPage: false,
    });

    expect(consoleErrors).toEqual([]);
  });

  test('should verify scroll reveal triggers and settles for services section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to services section
    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();

    // Verify section heading is revealed and visible
    const heading = page.getByRole('heading', { name: /Integrated capabilities for connected digital growth/i });
    await expect(heading).toBeVisible();

    // Wait for staggered reveals to complete
    await page.waitForTimeout(800);

    // Verify all 5 cards are visible in viewport
    const cards = servicesSection.locator('article');
    await expect(cards).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }

    // Capture settled services screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '02-services-motion-settled.png'),
      fullPage: false,
    });
  });

  test('should verify navigation interaction and sticky state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Scroll down past the threshold (50px) to trigger sticky navigation glass styling
    await page.evaluate(() => window.scrollTo(0, 150));
    await page.waitForTimeout(300);

    // Verify header remains fixed at top
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThanOrEqual(5);

    // Hover navigation link to verify micro-interaction
    const navLink = page.getByRole('link', { name: 'Services' }).first();
    await navLink.hover();
    await page.waitForTimeout(150);

    // Capture navigation interaction screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '03-navigation-interaction.png'),
      fullPage: false,
    });
  });

  test('should verify service card hover lift and accent line transition', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const firstCard = servicesSection.locator('article').first();
    await expect(firstCard).toBeVisible();

    // Hover card
    await firstCard.hover();
    await page.waitForTimeout(350);

    // Capture card hover screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '04-service-card-hover.png'),
      fullPage: false,
    });
  });

  test('should verify consultation modal enter animation and accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click CTA to open modal
    const startProjectBtn = page.getByRole('button', { name: 'Start a Project' }).first();
    await startProjectBtn.click();

    const dialog = page.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(dialog).toBeVisible();

    // Wait for entrance pop-in animation to complete
    await page.waitForTimeout(300);

    // Capture open modal screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '05-consultation-modal-open.png'),
      fullPage: false,
    });

    // Close modal
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('should verify mobile navigation drawer animation and viewport responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuBtn = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();
    await page.waitForTimeout(350);

    // Capture mobile drawer motion screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '06-mobile-motion.png'),
      fullPage: false,
    });

    // Close drawer
    const closeBtn = drawer.getByRole('button', { name: 'Close menu' });
    await closeBtn.click();
    await expect(drawer).not.toBeVisible();
  });

  test('should verify reduced motion preference collapses animations and preserves visibility', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero and cards must be immediately visible without waiting
    const heroH1 = page.locator('#hero h1');
    await expect(heroH1).toBeVisible();

    // Scroll to services
    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();

    const heading = page.getByRole('heading', { name: /Integrated capabilities for connected digital growth/i });
    await expect(heading).toBeVisible();

    const cards = servicesSection.locator('article');
    await expect(cards).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }

    // Capture reduced motion screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '07-reduced-motion.png'),
      fullPage: false,
    });

    // Verify computed animation and transition durations are effectively zero
    const cardTransitionDuration = await cards.first().evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });
    const parsedDuration = parseFloat(cardTransitionDuration);
    expect(parsedDuration).toBeLessThanOrEqual(0.01);
  });

  test('should verify zero horizontal overflow across 5 standard viewports', async ({ page }) => {
    const viewports = [
      { width: 360, height: 740, name: '360px-compact-mobile' },
      { width: 390, height: 844, name: '390px-standard-mobile' },
      { width: 768, height: 1024, name: '768px-tablet' },
      { width: 1280, height: 800, name: '1280px-desktop' },
      { width: 1440, height: 900, name: '1440px-large-desktop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Scroll top to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('should verify zero browser console errors across all motion interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll through the entire page
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(400);

    expect(errors).toEqual([]);
  });
});
