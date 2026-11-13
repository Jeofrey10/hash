import { test, expect } from '@playwright/test';

test.describe('Stage 05 Cinematic Hero Section Validation', () => {
  test('should render hero with exactly one primary H1 and correct brand headline', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // Verify exactly one H1 exists on the page
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Verify brand headline text
    const h1 = h1Elements.first();
    await expect(h1).toContainText('Build with purpose.');
    await expect(h1).toContainText('Grow with clarity.');

    // Verify overline badge
    const badge = hero.getByText('Digital Experience Studio').first();
    await expect(badge).toBeVisible();

    // Verify non-geographic technical node identifier (Stage 05.1)
    const nodeIdentifier = hero.getByText('NODE // HD.CORE.01');
    await expect(nodeIdentifier).toBeAttached();

    // Verify geographic coordinate marker is removed
    const geoCoordinate = page.locator('text=40.7128');
    await expect(geoCoordinate).toHaveCount(0);

    // Verify supporting description
    const description = hero.getByText(
      'Connected digital experiences that help businesses get discovered, communicate their value and convert visitors into customers.',
    );
    await expect(description).toBeVisible();
  });

  test('should verify both CTAs exist with correct anchors and attributes', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('#hero');

    // Primary CTA
    const primaryCta = hero.locator('a[href="#contact"], button:has-text("Start a Project")').first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute('href', '#contact');

    // Secondary CTA
    const secondaryCta = hero.locator('a[href="#services"]').first();
    await expect(secondaryCta).toBeVisible();
    await expect(secondaryCta).toHaveAttribute('href', '#services');
    await expect(secondaryCta).toContainText('Explore Our Services');
  });

  test('should render dimensional capabilities card with all 5 core disciplines', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('#hero');
    const capabilitiesCard = hero.locator('text=Capabilities').first();
    await expect(capabilitiesCard).toBeVisible();

    const expectedServices = [
      'Website Development',
      'Application Development',
      'SEO Optimization',
      'Meta Advertising',
      'Creative Design & Video',
    ];

    for (const service of expectedServices) {
      await expect(hero.getByText(service).first()).toBeVisible();
    }
  });

  test('should capture required responsive screenshots at all 5 viewports without horizontal overflow', async ({ page }) => {
    test.setTimeout(60000);
    const viewports = [
      { name: '01-hero-desktop-1440.png', width: 1440, height: 900 },
      { name: '02-hero-laptop-1280.png', width: 1280, height: 800 },
      { name: '03-hero-tablet-768.png', width: 768, height: 1024 },
      { name: '04-hero-mobile-390.png', width: 390, height: 844 },
      { name: '05-hero-mobile-360.png', width: 360, height: 800 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Wait for entrance animation to settle
      await page.waitForTimeout(600);

      // Verify no horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow, `Overflow detected on ${vp.width}px`).toBe(false);

      // Verify headline does not clip
      const h1Rect = await page.locator('h1').boundingBox();
      expect(h1Rect).not.toBeNull();
      expect(h1Rect!.width).toBeGreaterThan(0);
      expect(h1Rect!.height).toBeGreaterThan(0);

      // Capture screenshot
      await page.screenshot({
        path: `tests/e2e/screenshots/stage-05/${vp.name}`,
        fullPage: false,
      });
    }

    // Capture settled hero desktop view
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'tests/e2e/screenshots/stage-05/06-hero-settled-desktop.png',
      fullPage: false,
    });
  });

  test('should verify reduced motion preference turns off entrance animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const heroAnimatedEl = page.locator('.animate-hero-2').first();
    const animName = await heroAnimatedEl.evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });
    expect(animName).toBe('none');
  });

  test('should verify zero browser console errors on hero page load and interaction', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(600);

    // Verify primary CTA interaction inside hero
    const primaryCta = page.locator('#hero a[href="#contact"]').first();
    await expect(primaryCta).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });
});
