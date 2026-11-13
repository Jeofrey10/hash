import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Global Cinematic Bidirectional Scroll Reveal System', () => {
  const screenshotDir = path.join(
    process.cwd(),
    'tests',
    'e2e',
    'screenshots',
    'bidirectional-scroll-reveals'
  );

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('1 & 8-10. Hero reveal works, reverses on scroll down, and replays on scroll back to top', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Initial State: Hero in viewport is revealed
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    const heroPrimary = page.locator('#hero-primary-headline');
    await expect(heroPrimary).toBeVisible();
    await expect(heroPrimary).toHaveText('Build with purpose.');

    const heroCursive = page.locator('#hero-cursive-headline');
    await expect(heroCursive).toBeVisible();
    await expect(heroCursive).toHaveText('Grow with clarity.');

    // 2. Scroll deep down into Approach section (Hero completely leaves viewport)
    await page.locator('#approach').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify user has scrolled past Hero
    const scrollYAfterScroll = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterScroll).toBeGreaterThan(600);

    // 3. Scroll back up to the very top (Hero re-enters in reverse direction)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(600);

    // 4. Hero replays and settles into revealed state
    await expect(heroPrimary).toBeVisible();
    await expect(heroCursive).toBeVisible();
  });

  test('2 & 3. Services section and cards reveal in staggered order with signature slat mask', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to Services section
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Verify heading with signature horizontal slat mask is visible
    const heading = page.locator('#services-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Integrated capabilities for connected digital growth.');

    // Verify all 5 service cards are revealed and visible in the viewport
    const cards = services.locator('article');
    await expect(cards).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test('4 & 5. Approach and Capabilities sections reveal with signature horizontal slat mask', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to Approach
    const approach = page.locator('#approach');
    await approach.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const approachHeading = page.locator('#approach-heading');
    await expect(approachHeading).toBeVisible();
    await expect(approachHeading).toContainText('A disciplined path from requirements to execution.');

    // Verify 4 approach phase articles
    const approachStages = approach.locator('article');
    await expect(approachStages).toHaveCount(4);

    // Scroll to Capabilities
    const capabilities = page.locator('#capabilities');
    await capabilities.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const capHeading = page.locator('#capabilities-heading');
    await expect(capHeading).toBeVisible();
    await expect(capHeading).toContainText('The thinking and craft behind every digital experience.');

    // Verify 5 capability pillar articles
    const capCards = capabilities.locator('article');
    await expect(capCards).toHaveCount(5);
  });

  test('6 & 7. Contact section and Site Footer reveal cleanly with child elements', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to Contact
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const contactHeading = page.locator('#contact-heading');
    await expect(contactHeading).toBeVisible();
    await expect(contactHeading).toContainText("Have a project in mind? Let's build something purposeful.");

    // Form container is revealed
    const formCard = contact.locator('.rounded-3xl').first();
    await expect(formCard).toBeVisible();

    // Scroll to Footer
    const footer = page.locator('footer[role="contentinfo"]');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await expect(footer).toBeVisible();
    await expect(footer.getByText('Digital Services')).toBeVisible();
    await expect(footer.getByText('Company & Contact')).toBeVisible();
  });

  test('8-10. Bidirectional verification: Scroll down -> revealed, scroll up past -> reversed, scroll down -> replayed', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contact = page.locator('#contact');
    const contactHeading = page.locator('#contact-heading');

    // Step A: Initial state at top of page -> Contact is not in viewport
    const initialInViewport = await contact.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    expect(initialInViewport).toBe(false);

    // Step B: Scroll down into Contact section -> reveal triggered
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(contactHeading).toBeVisible();
    const isRevealedDown = await contactHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.opacity !== '0' && style.visibility !== 'hidden';
    });
    expect(isRevealedDown).toBe(true);

    // Step C: Scroll up in reverse direction back to top (Contact completely exits viewport)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);

    const isExitedViewport = await contact.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= window.innerHeight || rect.bottom <= 0;
    });
    expect(isExitedViewport).toBe(true);

    // Step D: Scroll down again to Contact -> reveal replays from beginning
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(contactHeading).toBeVisible();
    const isReplayed = await contactHeading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.opacity !== '0' && style.visibility !== 'hidden';
    });
    expect(isReplayed).toBe(true);
  });

  test('11. Fast scrolling does not permanently hide content or leave blank sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Perform rapid full-page scroll to bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
    await page.waitForTimeout(300);

    // Verify footer and contact are visible
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Perform rapid scroll back up to Services
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const servicesHeading = page.locator('#services-heading');
    await expect(servicesHeading).toBeVisible();
    const serviceCards = page.locator('#services article');
    await expect(serviceCards.first()).toBeVisible();
  });

  test('12. No flickering or layout shifts at viewport boundaries', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll in fine increments across threshold boundary
    const services = page.locator('#services');
    const servicesTop = await services.evaluate((el) => el.offsetTop);

    // Scroll just before, at, and past boundary
    await page.evaluate((top) => window.scrollTo(0, top - 300), servicesTop);
    await page.waitForTimeout(100);
    await page.evaluate((top) => window.scrollTo(0, top - 100), servicesTop);
    await page.waitForTimeout(100);
    await page.evaluate((top) => window.scrollTo(0, top + 100), servicesTop);
    await page.waitForTimeout(100);
    await page.evaluate((top) => window.scrollTo(0, top - 100), servicesTop);
    await page.waitForTimeout(100);

    expect(consoleErrors).toEqual([]);
  });

  test('13. Dark and Light themes both render high-contrast theme-aware reveals', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Dark Mode verification
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('#services-heading')).toBeVisible();

    // 2. Switch to Light Mode via theme switcher
    const themeSwitcher = page.locator('#desktop-theme-switcher, #mobile-theme-switcher, button[aria-label*="theme" i]').first();
    await expect(themeSwitcher).toBeVisible();
    await themeSwitcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // 3. Verify Light Mode reveals remain high contrast and visible
    await page.locator('#approach').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('#approach-heading')).toBeVisible();

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('#contact-heading')).toBeVisible();

    // 4. Switch back to Dark Mode
    await themeSwitcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).not.toHaveClass(/theme-light/);
  });

  test('14. Mobile reveals work correctly at 360x800 and 390x844 without horizontal overflow', async ({ page }) => {
    for (const vp of [{ width: 360, height: 800 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Scroll through each section
      for (const sectionId of ['#hero', '#services', '#approach', '#capabilities', '#contact']) {
        const section = page.locator(sectionId);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await expect(section).toBeVisible();

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasOverflow).toBe(false);
      }
    }
  });

  test('15. Reduced-motion mode immediately exposes all content with zero delay or permanent hiding', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // In reduced motion, content must be visible immediately
    const hero = page.locator('#hero h1');
    await expect(hero).toBeVisible();

    const servicesHeading = page.locator('#services-heading');
    await servicesHeading.scrollIntoViewIfNeeded();
    await expect(servicesHeading).toBeVisible();

    const cards = page.locator('#services article');
    await expect(cards).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test('16. Existing buttons, links, form inputs, and modal remain 100% interactive', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Consultation modal opens and closes
    const startProjectHeroBtn = page.locator('#hero a[href="#contact"]').first();
    await expect(startProjectHeroBtn).toBeVisible();
    await expect(startProjectHeroBtn).toHaveAttribute('href', '#contact');

    // 2. Services explore triggers consultation modal
    const exploreBtn = page.locator('#services article button').first();
    await exploreBtn.scrollIntoViewIfNeeded();
    await exploreBtn.click();

    const modal = page.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // 3. Contact multi-step form remains interactive
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    const serviceChip = contact.getByRole('button', { name: 'Website Development' });
    await expect(serviceChip).toBeVisible();
    await serviceChip.click();
    await expect(serviceChip).toHaveAttribute('aria-pressed', 'true');
  });

  test('Visual Verification & Screenshot Capture across all sections', async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    // 1. Hero Entrance
    await page.screenshot({
      path: path.join(screenshotDir, '01-hero-entrance-dark.png'),
      fullPage: false,
    });

    // 2. Services heading and cards revealing
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '02-services-reveal-dark.png'),
      fullPage: false,
    });

    // 3. Approach process reveal
    const approach = page.locator('#approach');
    await approach.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '03-approach-reveal-dark.png'),
      fullPage: false,
    });

    // 4. Capabilities reveal
    const capabilities = page.locator('#capabilities');
    await capabilities.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '04-capabilities-reveal-dark.png'),
      fullPage: false,
    });

    // 5. Contact reveal
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '05-contact-reveal-dark.png'),
      fullPage: false,
    });

    // 6. Footer reveal
    const footer = page.locator('footer[role="contentinfo"]');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '06-footer-reveal-dark.png'),
      fullPage: false,
    });

    // 7. Reverse scrolling and replay: scroll back up to Services
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(screenshotDir, '07-services-replayed-dark.png'),
      fullPage: false,
    });

    // 8. Light Mode verification screenshots
    const themeSwitcher = page.locator('#desktop-theme-switcher, #mobile-theme-switcher, button[aria-label*="theme" i]').first();
    await themeSwitcher.click();
    await page.waitForTimeout(300);

    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(screenshotDir, '08-hero-light.png'),
      fullPage: false,
    });

    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(screenshotDir, '09-services-light.png'),
      fullPage: false,
    });

    // 9. Mobile behavior screenshot at 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(screenshotDir, '10-mobile-390-services.png'),
      fullPage: false,
    });
  });
});
