import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Hero Central Symbol Replacement Verification', () => {
  const screenshotDir = path.resolve('tests/e2e/screenshots/hero-central-symbol-replacement');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 800 },
  ];

  for (const vp of viewports) {
    test(`should verify new HASH.DEVS brand symbol at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();

      // 1. Verify symbol element exists with correct accessible label
      const symbolSvg = hero.locator('svg[aria-label="HASH.DEVS brand symbol"]');
      await expect(symbolSvg).toBeVisible();

      // 2. Verify neon-green segment exists and has correct fill
      const greenSegment = symbolSvg.locator('#green-accent-segment');
      await expect(greenSegment).toBeAttached();
      const greenFill = await greenSegment.evaluate((el) => {
        return window.getComputedStyle(el).fill;
      });
      // Should match neon green rgb(53, 232, 91)
      expect(greenFill).toMatch(/rgb\(53,\s*232,\s*91\)|#35e85b/i);

      // 3. Verify white segments exist
      const whiteSegment0 = symbolSvg.locator('#white-segment-0');
      await expect(whiteSegment0).toBeAttached();
      const whiteFill = await whiteSegment0.evaluate((el) => {
        return window.getComputedStyle(el).fill;
      });
      expect(whiteFill).toMatch(/rgb\(255,\s*255,\s*255\)|#ffffff/i);

      // 4. Verify HD.CORE.01 tag is completely removed from the central core
      const coreLabel = hero.getByTestId('hd-core-label');
      await expect(coreLabel).toHaveCount(0);

      // 5. Verify the symbol is centered inside the core disk
      const coreDisk = hero.locator('div:has(> div > svg[aria-label="HASH.DEVS brand symbol"])').first();
      const symbolCenterY = await symbolSvg.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const diskCenterY = await coreDisk.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      // Symbol center should closely align with the circular disk vertical center
      expect(Math.abs(symbolCenterY - diskCenterY)).toBeLessThan(6);

      // 6. Capture closeup screenshot of circular monolith core
      await coreDisk.screenshot({
        path: path.join(screenshotDir, `core-disk-${vp.name}.png`),
      });

      // Capture hero overview screenshot
      await hero.screenshot({
        path: path.join(screenshotDir, `hero-overview-${vp.name}.png`),
      });
    });
  }

  test('should verify symbol in Light Mode and Dark Mode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('#hero');
    const symbolSvg = hero.locator('svg[aria-label="HASH.DEVS brand symbol"]');
    const coreDisk = hero.locator('div:has(> div > svg[aria-label="HASH.DEVS brand symbol"])').first();

    // Dark Mode capture
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await coreDisk.screenshot({
      path: path.join(screenshotDir, 'core-disk-dark.png'),
    });

    // Toggle Light Mode
    const themeSwitcher = page.locator('#desktop-theme-switcher, #mobile-theme-switcher, button[aria-label*="theme" i]').first();
    await themeSwitcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Verify symbol remains visible, crisp, and high-contrast in Light Mode
    await expect(symbolSvg).toBeVisible();
    await coreDisk.screenshot({
      path: path.join(screenshotDir, 'core-disk-light.png'),
    });
  });
});

