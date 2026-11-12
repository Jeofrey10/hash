import { test, expect } from '@playwright/test';

test.describe('HASH.DEVS Foundation & Environment Verification', () => {
  test('should load the application shell with correct brand title and identity', async ({ page }) => {
    // Navigate to local dev server
    await page.goto('/');

    // Verify title
    await expect(page).toHaveTitle(/HASH\.DEVS/);

    // Verify brand heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('HASH.DEVS');

    // Verify brand messaging
    const message = page.locator('text=Build with purpose. Grow with clarity.');
    await expect(message).toBeVisible();

    // Verify foundation status indicator
    const statusIndicator = page.locator('text=Stage 01 Foundation Ready');
    await expect(statusIndicator).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'tests/e2e/screenshots/foundation-smoke.png', fullPage: true });
  });

  test('should verify body styling uses brand dark theme', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify background color is Obsidian Black (#050505 -> rgb(5, 5, 5))
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgb(5, 5, 5)');
  });
});

