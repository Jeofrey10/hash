import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'tests/e2e/screenshots/theme-and-mobile-navigation');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

/**
 * Helper to get the currently visible header theme switcher (desktop or mobile)
 */
function getActiveThemeSwitcher(page: any) {
  return page.locator('#desktop-theme-switcher, #mobile-theme-switcher').filter({ visible: true }).first();
}

test.describe('Stage 11: Global Theme System (Light / Dark)', () => {
  test('should default to Dark Mode on initial visit', async ({ page }) => {
    // Clear localStorage to simulate fresh visitor
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify root attribute
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Verify body background color is obsidian black (#050505 -> rgb(5, 5, 5))
    const bodyBg = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bodyBg).toBe('rgb(5, 5, 5)');

    // Verify theme toggle button exists and has accessible label
    const switcher = getActiveThemeSwitcher(page);
    await expect(switcher).toBeVisible();
    await expect(switcher).toHaveAttribute('aria-label', /Switch to light mode/i);
  });

  test('should toggle smoothly to Light Mode and back to Dark Mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const switcher = getActiveThemeSwitcher(page);
    await expect(switcher).toBeVisible();

    // 1. Click to switch to Light Mode
    await switcher.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Poll for background transition completion (#F5F6F2 -> rgb(245, 246, 242))
    await expect.poll(async () => {
      return page.locator('body').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    }, { timeout: 4000 }).toBe('rgb(245, 246, 242)');

    // Toggle label should now offer switching to dark mode
    await expect(switcher).toHaveAttribute('aria-label', /Switch to dark mode/i);

    // 2. Click again to return to Dark Mode
    await switcher.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Poll for background transition completion (#050505 -> rgb(5, 5, 5))
    await expect.poll(async () => {
      return page.locator('body').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    }, { timeout: 4000 }).toBe('rgb(5, 5, 5)');
  });

  test('should persist theme selection in localStorage across reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const switcher = getActiveThemeSwitcher(page);
    await switcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Verify localStorage item
    const storedTheme = await page.evaluate(() => localStorage.getItem('hashdevs-theme'));
    expect(storedTheme).toBe('light');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Theme should still be light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await expect.poll(async () => {
      return page.locator('body').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    }, { timeout: 4000 }).toBe('rgb(245, 246, 242)');
  });

  test('should apply high-contrast editorial styling in Light Mode across sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Switch to Light Mode
    const switcher = getActiveThemeSwitcher(page);
    await switcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Verify Hero headline contrast
    const heroH1 = page.locator('#hero-primary-headline');
    await expect(heroH1).toBeVisible();
    await expect.poll(async () => {
      return heroH1.evaluate((el) => window.getComputedStyle(el).color);
    }, { timeout: 3000 }).toBe('rgb(17, 21, 18)');

    // Verify cursive line color in Light Mode (#168B39 -> rgb(22, 139, 57))
    const cursiveLine = page.locator('#hero-cursive-headline');
    await expect(cursiveLine).toBeVisible();
    await expect.poll(async () => {
      return cursiveLine.evaluate((el) => window.getComputedStyle(el).color);
    }, { timeout: 3000 }).toBe('rgb(22, 139, 57)');

    // Verify Services section cards exist and have light background
    await page.locator('#services').scrollIntoViewIfNeeded();
    const serviceCards = page.locator('#services article');
    await expect(serviceCards.first()).toBeVisible();
    const cardBg = await serviceCards.first().evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(cardBg).toMatch(/rgb\(2[4-5][0-9],\s*2[4-5][0-9],\s*2[4-5][0-9]\)|rgba\(2[4-5][0-9],\s*2[4-5][0-9],\s*2[4-5][0-9],\s*0\.8[1-9]\)/);

    // Verify Footer background (#F5F6F2 -> rgb(245, 246, 242))
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
    await expect.poll(async () => {
      return footer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    }, { timeout: 3000 }).toBe('rgb(245, 246, 242)');
  });
});

test.describe('Stage 11: Responsive Mobile Navigation & Drawer', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure viewport is mobile sized even if run under desktop project
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should display mobile header with logo, theme switcher, and hamburger button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Header logo should be visible
    const logo = page.locator('header a:has-text("HASH.DEVS")');
    await expect(logo).toBeVisible();

    // Mobile theme switcher should be visible
    const mobileSwitcher = page.locator('#mobile-theme-switcher');
    await expect(mobileSwitcher).toBeVisible();

    // Hamburger button should be visible with 44x44px minimum target
    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(hamburger).toBeVisible();
    const box = await hamburger.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should open drawer on hamburger click and lock background scrolling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();

    // Drawer should become visible
    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');

    // Body should have overflow: hidden
    const bodyOverflow = await page.locator('body').evaluate((el) => window.getComputedStyle(el).overflow);
    expect(bodyOverflow).toBe('hidden');

    // Drawer should contain numbered links
    await expect(drawer.getByRole('link', { name: /Services/i })).toBeVisible();
    await expect(drawer.getByRole('link', { name: /Approach/i })).toBeVisible();
    await expect(drawer.getByRole('link', { name: /Capabilities/i })).toBeVisible();
    await expect(drawer.getByRole('link', { name: /Contact/i })).toBeVisible();

    // Drawer should contain CTA button
    const ctaButton = drawer.getByRole('button', { name: /Start a Project/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should close drawer on close button click and restore focus to hamburger trigger', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // Click close button inside drawer
    const closeBtn = drawer.getByRole('button', { name: 'Close menu' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Drawer should close
    await expect(drawer).toBeHidden();

    // Body overflow should be restored
    const bodyOverflow = await page.locator('body').evaluate((el) => window.getComputedStyle(el).overflow);
    expect(bodyOverflow).not.toBe('hidden');

    // Trigger should receive focus
    await expect(hamburger).toBeFocused();
  });

  test('should close drawer on Escape key press and restore focus', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Drawer should close
    await expect(drawer).toBeHidden();
    await expect(hamburger).toBeFocused();
  });

  test('should close drawer when clicking a navigation link and scroll to target', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // Click "Services" link
    const servicesLink = drawer.getByRole('link', { name: /Services/i });
    await servicesLink.click();

    // Drawer should close
    await expect(drawer).toBeHidden();

    // Section should be in view
    await expect(page.locator('#services')).toBeVisible();
  });

  test('should toggle theme from inside mobile drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // Click theme switcher inside drawer
    const drawerSwitcher = drawer.locator('#drawer-theme-switcher');
    await expect(drawerSwitcher).toBeVisible();
    await drawerSwitcher.click();

    // Root should have data-theme="light"
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Drawer text color should adapt to dark charcoal in light mode (#111512 -> rgb(17, 21, 18))
    await expect.poll(async () => {
      return drawer.evaluate((el) => window.getComputedStyle(el).color);
    }, { timeout: 3000 }).toBe('rgb(17, 21, 18)');
  });
});

test.describe('Visual Screenshots & Cross-Theme Verification', () => {
  test('should capture high-resolution screenshots for desktop and mobile in both themes', async ({ page }) => {
    // Only capture once (on desktop runner)
    const isDesktopProject = test.info().project.name === 'chromium-desktop';
    if (!isDesktopProject) {
      return;
    }

    // 1. Desktop Dark Hero
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-desktop-dark-hero.png') });

    // 2. Desktop Light Hero
    const desktopSwitcher = page.locator('#desktop-theme-switcher');
    await desktopSwitcher.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-desktop-light-hero.png') });

    // 3. Desktop Light Services
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-desktop-light-services.png') });

    // 4. Desktop Light Contact
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-desktop-light-contact.png') });

    // 5. Desktop Light Consultation Modal
    const ctaButton = page.locator('nav button:has-text("Start a Project")');
    await ctaButton.click();
    await page.waitForTimeout(300);
    const modal = page.locator('div[role="dialog"][aria-label="Project Consultation Inbound"]');
    await expect(modal).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-desktop-light-modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // 6. Mobile Dark Menu Open
    await page.setViewportSize({ width: 390, height: 844 });
    // Reset to Dark Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('hashdevs-theme', 'dark');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hamburger = page.getByRole('button', { name: 'Open navigation menu' });
    await hamburger.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-mobile-dark-drawer-open.png') });

    // 7. Mobile Light Menu Open
    const drawerSwitcher = page.locator('#drawer-theme-switcher');
    await drawerSwitcher.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-mobile-light-drawer-open.png') });
  });
});
