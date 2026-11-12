import { test, expect } from '@playwright/test';

test.describe('Stage 04 Core UI Components & Layout Shell', () => {
  test('should render global application layout shell with landmarks', async ({ page }) => {
    await page.goto('/');

    // Verify landmarks
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();

    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Verify Brand Mark in Header
    const brandLink = header.locator('a[href="/"]').first();
    await expect(brandLink).toContainText('HASH.DEVS');
  });

  test('should verify desktop navigation and CTA button', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop navigation links are tested on desktop project');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main Navigation' });
    await expect(nav).toBeVisible();

    // Verify desktop links
    await expect(nav.getByText('Services')).toBeVisible();
    await expect(nav.getByText('Approach')).toBeVisible();
    await expect(nav.getByText('Capabilities')).toBeVisible();
    await expect(nav.getByText('Contact')).toBeVisible();

    // Verify CTA button inside nav
    const ctaButton = nav.getByRole('button', { name: 'Start a Project' });
    await expect(ctaButton).toBeVisible();

    // Click CTA button and verify dialog opens
    await ctaButton.click();
    const dialog = page.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Start a Project');

    // Close dialog
    const closeBtn = dialog.getByRole('button', { name: 'Close Dialog' });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();

    // Take screenshot of desktop layout
    await page.screenshot({ path: 'tests/e2e/screenshots/stage-04/01-desktop-shell.png', fullPage: false });
  });

  test('should verify mobile navigation toggle and drawer interaction', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Verify hamburger button is visible on mobile
    const menuBtn = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(menuBtn).toBeVisible();

    // Open mobile menu
    await menuBtn.click();

    // Verify drawer opens
    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText('Services')).toBeVisible();
    await expect(drawer.getByText('Approach')).toBeVisible();

    // Take screenshot of open drawer
    await page.screenshot({ path: 'tests/e2e/screenshots/stage-04/02-mobile-drawer.png' });

    // Close via close button
    const closeBtn = drawer.getByRole('button', { name: 'Close menu' });
    await closeBtn.click();
    await expect(drawer).not.toBeVisible();

    // Reopen and test Escape key closes drawer
    await menuBtn.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });

  test('should render all five official services across components', async ({ page }) => {
    await page.goto('/');

    const expectedServices = [
      'Website Development',
      'Application Development',
      'SEO Optimization',
      'Meta Advertising',
      'Creative Design & Video',
    ];

    for (const service of expectedServices) {
      const item = page.getByText(service).first();
      await expect(item).toBeVisible();
    }
  });

  test('should verify button variants, states, and keyboard accessibility', async ({ page }) => {
    await page.goto('/');

    // Primary button in hero
    const primaryBtn = page.getByRole('button', { name: 'Start a Project' }).first();
    await expect(primaryBtn).toBeVisible();

    // Secondary button in hero
    const secondaryBtn = page.getByRole('button', { name: 'Explore Our Services' }).first();
    await expect(secondaryBtn).toBeVisible();

    // Test keyboard focus navigation
    await primaryBtn.focus();
    await expect(primaryBtn).toBeFocused();

    // Trigger click on primary CTA to test dialog
    await primaryBtn.click();
    const dialog = page.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('should verify zero horizontal overflow across all 5 viewports', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900, name: 'desktop' },
      { width: 1280, height: 800, name: 'laptop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 390, height: 844, name: 'mobile-390' },
      { width: 360, height: 800, name: 'mobile-360' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForTimeout(300);

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow, `Overflow detected on ${vp.name} (${vp.width}px)`).toBe(false);
    }
  });

  test('should verify rendered color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');

    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Obsidian Black #050505 -> rgb(5, 5, 5)
    expect(bodyBg).toBe('rgb(5, 5, 5)');

    const primaryBtn = page.getByRole('button', { name: 'Start a Project' }).first();
    const btnStyles = await primaryBtn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        bg: style.backgroundColor,
        color: style.color,
      };
    });

    // Neon Green #35E85B -> rgb(53, 232, 91)
    expect(btnStyles.bg).toBe('rgb(53, 232, 91)');
    // Obsidian text #050505 -> rgb(5, 5, 5)
    expect(btnStyles.color).toBe('rgb(5, 5, 5)');
  });

  test('should verify reduced motion preference support', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const marquee = page.locator('.animate-marquee');
    if (await marquee.count() > 0) {
      const animationName = await marquee.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });
      expect(animationName).toBe('none');
    }
  });

  test('should verify zero unhandled console errors during full interaction', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    expect(consoleErrors).toEqual([]);
  });
});
