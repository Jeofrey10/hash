import { test, expect } from '@playwright/test';

test.describe('Cinematic Preloader & Brand Experience', () => {
  test('should render official brand logo, progress indicator, and exit cleanly', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Preloader element should be present initially
    const preloader = page.locator('[data-testid="cinematic-preloader"]');
    await expect(preloader).toBeVisible();

    // Verify it renders the official brand logo SVG inside preloader
    const preloaderLogo = preloader.locator('svg[viewBox="0 0 822 211"]');
    await expect(preloaderLogo).toBeVisible();

    // Verify progress bar is present
    const progressBar = preloader.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();

    // Verify preloader exits within normal timeout (under 3 seconds)
    await expect(preloader).toBeHidden({ timeout: 4000 });

    // Verify hero is accessible after preloader exits
    const heroH1 = page.locator('#hero-primary-headline');
    await expect(heroH1).toBeVisible();
  });

  test('should bypass smoothly with prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const preloader = page.locator('[data-testid="cinematic-preloader"]');
    // With reduced motion, preloader should detach or hide almost immediately
    await expect(preloader).toBeHidden({ timeout: 1500 });

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
  });

  test('should maintain dark theme during preloading with no white flash', async ({ page }) => {
    await page.goto('/');
    const preloader = page.locator('[data-testid="cinematic-preloader"]');
    if (await preloader.isVisible()) {
      const bgColor = await preloader.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      // rgb(5, 5, 5) is #050505
      expect(bgColor).toMatch(/^rgba?\(5,\s*5,\s*5/);
    }
  });
});

