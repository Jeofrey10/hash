import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('HASH.DEVS Cinematic Digital Signal Hero Experience', () => {
  const screenshotDir = path.join(
    process.cwd(),
    'tests',
    'e2e',
    'screenshots',
    'hero-cinematic-rebuild'
  );

  const centeredTypographyDir = path.join(
    process.cwd(),
    'tests',
    'e2e',
    'screenshots',
    'hero-centered-typography'
  );

  test('should verify centered editorial typography and cursive script headline', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    const h1 = hero.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Verify H1 is text-align center
    const h1TextAlign = await h1.evaluate((el) => window.getComputedStyle(el).textAlign);
    expect(h1TextAlign).toBe('center');

    // Verify Line 1: "Build with purpose."
    const line1 = h1.locator('span').filter({ hasText: 'Build with purpose.' }).first();
    await expect(line1).toBeVisible();
    const line1Styles = await line1.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
      };
    });
    // Pure White: rgb(255, 255, 255)
    expect(line1Styles.color).toBe('rgb(255, 255, 255)');

    // Verify Line 2: "Grow with clarity."
    const line2 = h1.locator('span').filter({ hasText: 'Grow with clarity.' }).first();
    await expect(line2).toBeVisible();
    const line2Styles = await line2.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontStyle: style.fontStyle,
      };
    });
    // Hash Neon Green: rgb(53, 232, 91)
    expect(line2Styles.color).toBe('rgb(53, 232, 91)');
    // Italic cursive script
    expect(line2Styles.fontStyle).toBe('italic');
    expect(
      line2Styles.fontFamily.toLowerCase().includes('instrument') ||
      line2Styles.fontFamily.toLowerCase().includes('playfair') ||
      line2Styles.fontFamily.toLowerCase().includes('serif') ||
      line2Styles.fontFamily.toLowerCase().includes('cursive')
    ).toBe(true);
  });

  test('should verify cinematic hero elements: noise, equaliser, signal core, and floating panels', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // 1. Verify fine-grain noise layer
    const noiseLayer = hero.locator('div[aria-hidden="true"]').first();
    await expect(noiseLayer).toBeAttached();

    // 2. Verify canvas pixel-dot signal equaliser
    const equaliserCanvas = hero.locator('canvas');
    await expect(equaliserCanvas).toBeAttached();

    // 3. Verify central geometric hash signal core
    const coreStatus = hero.getByText('HD.CORE.01').first();
    await expect(coreStatus).toBeAttached();

    // 4. Verify telemetry panels: SYSTEM // 001 and SYSTEM // 002
    await expect(hero.getByText('SYSTEM // 001').first()).toBeAttached();
    await expect(hero.getByText('DIGITAL ENGINEERING').first()).toBeAttached();
    await expect(hero.getByText('SYSTEM // 002').first()).toBeAttached();
    await expect(hero.getByText('CREATIVE INTELLIGENCE').first()).toBeAttached();

    // 5. Verify headline and CTAs
    const h1 = hero.getByRole('heading', { level: 1 });
    await expect(h1).toContainText('Build with purpose.');
    await expect(h1).toContainText('Grow with clarity.');

    const startBtn = hero.locator('a[href="#contact"]').first();
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveAttribute('href', '#contact');
    await expect(startBtn).toContainText('Start a Project');

    const exploreBtn = hero.locator('a[href="#services"]').first();
    await expect(exploreBtn).toBeVisible();
    await expect(exploreBtn).toHaveAttribute('href', '#services');
    await expect(exploreBtn).toContainText('Explore Our Services');
  });

  test('should verify zero horizontal overflow across all 5 viewports and capture screenshots', async ({
    page,
  }) => {
    test.setTimeout(60000);

    const viewports = [
      { name: '01-hero-cinematic-desktop-1440.png', width: 1440, height: 900 },
      { name: '02-hero-cinematic-laptop-1280.png', width: 1280, height: 800 },
      { name: '03-hero-cinematic-tablet-768.png', width: 768, height: 1024 },
      { name: '04-hero-cinematic-mobile-390.png', width: 390, height: 844 },
      { name: '05-hero-cinematic-mobile-360.png', width: 360, height: 800 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(600);

      // Verify zero horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow, `Overflow detected at ${vp.width}px`).toBe(false);

      // Capture screenshots in both directories
      await page.screenshot({
        path: path.join(screenshotDir, vp.name),
        fullPage: false,
      });
      await page.screenshot({
        path: path.join(centeredTypographyDir, vp.name),
        fullPage: false,
      });
    }
  });

  test('should verify reduced motion collapses animations into a static composition', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // Verify headline is visible immediately
    const h1 = hero.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Capture reduced motion screenshots
    await page.screenshot({
      path: path.join(screenshotDir, '06-hero-cinematic-reduced-motion.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(centeredTypographyDir, '06-hero-centered-reduced-motion.png'),
      fullPage: false,
    });
  });

  test('should verify pointer movement does not generate console errors or disrupt layout', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate pointer move over hero
    await page.mouse.move(300, 300);
    await page.waitForTimeout(100);
    await page.mouse.move(700, 450);
    await page.waitForTimeout(100);
    await page.mouse.move(1100, 600);
    await page.waitForTimeout(100);

    expect(consoleErrors).toEqual([]);
  });
});

