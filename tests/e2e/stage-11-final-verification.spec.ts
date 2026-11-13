import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'tests/e2e/screenshots/stage-11-final-verification');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('Stage 11.1: Mobile Navigation Verification (360x800 & 390x844)', () => {
  for (const viewport of [
    { name: '360x800', width: 360, height: 800 },
    { name: '390x844', width: 390, height: 844 },
  ]) {
    test.describe(`Viewport ${viewport.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      test('1. Mobile header displays brand logo, theme switcher, and hamburger', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Logo
        const logo = page.locator('header a:has-text("HASH.DEVS")');
        await expect(logo).toBeVisible();

        // Theme switcher
        const mobileSwitcher = page.locator('#mobile-theme-switcher');
        await expect(mobileSwitcher).toBeVisible();

        // Hamburger button
        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await expect(hamburger).toBeVisible();
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      });

      test('2 & 3. Hamburger opens full-screen drawer displaying all 4 section links and Start a Project CTA', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await hamburger.click();

        const drawer = page.locator('#mobile-navigation-drawer');
        await expect(drawer).toBeVisible();
        await expect(drawer).toHaveAttribute('role', 'dialog');
        await expect(drawer).toHaveAttribute('aria-modal', 'true');

        // Check 4 links
        await expect(drawer.getByRole('link', { name: /Services/i })).toBeVisible();
        await expect(drawer.getByRole('link', { name: /Approach/i })).toBeVisible();
        await expect(drawer.getByRole('link', { name: /Capabilities/i })).toBeVisible();
        await expect(drawer.getByRole('link', { name: /Contact/i })).toBeVisible();

        // Check CTA
        const cta = drawer.getByRole('button', { name: /Start a Project/i });
        await expect(cta).toBeVisible();
      });

      test('4 & 10. Background scrolling is locked when open and restored when closed', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await hamburger.click();

        const drawer = page.locator('#mobile-navigation-drawer');
        await expect(drawer).toBeVisible();

        // Locked
        const lockedOverflow = await page.locator('body').evaluate((el) => window.getComputedStyle(el).overflow);
        expect(lockedOverflow).toBe('hidden');

        // Close drawer
        const closeBtn = drawer.getByRole('button', { name: 'Close menu' });
        await closeBtn.click();
        await expect(drawer).toBeHidden();

        // Restored
        const restoredOverflow = await page.locator('body').evaluate((el) => window.getComputedStyle(el).overflow);
        expect(restoredOverflow).not.toBe('hidden');
      });

      test('5. Theme switching works while the drawer is open', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await hamburger.click();

        const drawer = page.locator('#mobile-navigation-drawer');
        await expect(drawer).toBeVisible();

        // Switch to light inside drawer
        const drawerSwitcher = drawer.locator('#drawer-theme-switcher');
        await expect(drawerSwitcher).toBeVisible();
        await drawerSwitcher.click();

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

        // Switch back to dark inside drawer
        await drawerSwitcher.click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      });

      test('6. Selecting Services, Approach, Capabilities, or Contact closes drawer and navigates', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        for (const target of [
          { name: /Services/i, id: '#services' },
          { name: /Approach/i, id: '#approach' },
          { name: /Capabilities/i, id: '#capabilities' },
          { name: /Contact/i, id: '#contact' },
        ]) {
          const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
          await hamburger.click();

          const drawer = page.locator('#mobile-navigation-drawer');
          await expect(drawer).toBeVisible();

          const link = drawer.getByRole('link', { name: target.name });
          await link.click();

          await expect(drawer).toBeHidden();
          await expect(page.locator(target.id)).toBeVisible();
        }
      });

      test('7. Close button and backdrop close the drawer', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test close button
        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await hamburger.click();
        const drawer = page.locator('#mobile-navigation-drawer');
        await expect(drawer).toBeVisible();

        const closeBtn = drawer.getByRole('button', { name: 'Close menu' });
        await closeBtn.click();
        await expect(drawer).toBeHidden();

        // Test backdrop click
        await hamburger.click();
        await expect(drawer).toBeVisible();
        // Click on the empty drawer container padding
        await drawer.click({ position: { x: 10, y: 10 } });
        await expect(drawer).toBeHidden();
      });

      test('8 & 9. Escape key closes the drawer and restores focus to hamburger trigger', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
        await hamburger.click();

        const drawer = page.locator('#mobile-navigation-drawer');
        await expect(drawer).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(drawer).toBeHidden();
        await expect(hamburger).toBeFocused();
      });

      test('Verify no clipping, overflow, or content hidden behind mobile header', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasOverflow).toBe(false);

        // Header height and main content padding
        const main = page.locator('#main-content');
        const paddingTop = await main.evaluate((el) => window.getComputedStyle(el).paddingTop);
        // Header is fixed at top with ~74px offset
        expect(parseInt(paddingTop, 10)).toBeGreaterThanOrEqual(70);
      });
    });
  }
});

test.describe('Stage 11.1: Visual Artifacts Generation & Theme Inspection', () => {
  test('Capture all required visual artifacts', async ({ page }) => {
    // Only capture once (on desktop runner)
    const isDesktopProject = test.info().project.name === 'chromium-desktop';
    if (!isDesktopProject) {
      return;
    }

    // 1. Desktop Dark Mode (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('hashdevs-theme', 'dark');
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-desktop-dark-hero.png') });

    // 2. Desktop Light Mode (1440x900)
    const desktopSwitcher = page.locator('#desktop-theme-switcher');
    await desktopSwitcher.click();
    await page.waitForTimeout(400);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-desktop-light-hero.png') });

    // 3. Mobile Dark Mode with drawer open (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Ensure clean dark theme on fresh visit
    const currentTheme = await page.locator('html').getAttribute('data-theme');
    if (currentTheme === 'light') {
      await page.locator('#mobile-theme-switcher').click();
      await page.waitForTimeout(300);
    }

    // Drawer closed dark mode
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-mobile-dark-drawer-closed-390.png') });

    // Open drawer
    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-mobile-dark-drawer-open-390.png') });

    // 4. Mobile Light Mode with drawer open (390x844)
    const drawerSwitcher = page.locator('#drawer-theme-switcher');
    await drawerSwitcher.click();
    await page.waitForTimeout(350);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-mobile-light-drawer-open-390.png') });

    // Close drawer in light mode
    await page.locator('#mobile-navigation-drawer').getByRole('button', { name: 'Close menu' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-mobile-light-drawer-closed-390.png') });

    // 5. Mobile 360x800 Hero in both themes
    await page.setViewportSize({ width: 360, height: 800 });
    // Light mode 360
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-mobile-light-hero-360.png') });

    // Dark mode 360
    const mobileSwitcher360 = page.locator('#mobile-theme-switcher');
    await mobileSwitcher360.click();
    await page.waitForTimeout(350);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-mobile-dark-hero-360.png') });
  });
});
