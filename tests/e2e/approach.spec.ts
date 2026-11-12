import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Stage 08 Approach Section Validation', () => {
  const screenshotDir = path.join(process.cwd(), 'tests', 'e2e', 'screenshots', 'stage-08');

  test('should render approach section after services with correct ID and heading structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verify section exists with id="approach"
    const approachSection = page.locator('#approach');
    await expect(approachSection).toBeVisible();

    // 2. Verify section comes directly after services in DOM
    const isAfterServices = await page.evaluate(() => {
      const services = document.getElementById('services');
      const approach = document.getElementById('approach');
      if (!services || !approach) return false;
      return Boolean(services.compareDocumentPosition(approach) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(isAfterServices).toBe(true);

    // 3. Verify heading accessibility and hierarchy
    const sectionHeading = approachSection.getByRole('heading', { level: 2 });
    await expect(sectionHeading).toBeVisible();
    await expect(sectionHeading).toHaveAttribute('id', 'approach-heading');
    await expect(sectionHeading).toContainText('A disciplined path from requirements to execution');

    // 4. Verify technical markers
    await expect(approachSection.getByText('SEC // 03.APPROACH')).toBeAttached();
    await expect(approachSection.getByText('PROCESS // 04.PHASES')).toBeAttached();
  });

  test('should render all four stages with exact confirmed content and themes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const approachSection = page.locator('#approach');
    await approachSection.scrollIntoViewIfNeeded();

    const expectedPhases = [
      {
        number: '01',
        title: 'Discover',
        description: 'Understand the business, audience, goals, and challenges before deciding what to build.',
        themes: ['Business objectives', 'Audience understanding', 'Research and discovery'],
      },
      {
        number: '02',
        title: 'Define',
        description: 'Establish a clear direction, project structure, and experience strategy.',
        themes: ['Project direction', 'Information architecture', 'Experience planning'],
      },
      {
        number: '03',
        title: 'Design & Build',
        description: 'Translate the defined direction into a considered, functional digital experience.',
        themes: ['Interface design', 'Development', 'Performance and usability'],
      },
      {
        number: '04',
        title: 'Refine & Grow',
        description: 'Test, refine, and improve the experience so it can support evolving business needs.',
        themes: ['Quality assurance', 'Optimization', 'Continuous improvement'],
      },
    ];

    const articles = approachSection.locator('article');
    await expect(articles).toHaveCount(4);

    for (let i = 0; i < expectedPhases.length; i++) {
      const phase = expectedPhases[i];
      const article = articles.nth(i);

      // Verify step number
      await expect(article.getByText(`STEP ${phase.number}`)).toBeVisible();

      // Verify title as H3
      const h3 = article.getByRole('heading', { level: 3 });
      await expect(h3).toContainText(phase.title);

      // Verify description
      await expect(article.getByText(phase.description)).toBeVisible();

      // Verify each supporting theme
      for (const theme of phase.themes) {
        await expect(article.getByText(theme)).toBeVisible();
      }
    }
  });

  test('should verify navigation link scrolls cleanly to #approach without header overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Approach link in desktop navigation
    const navLink = page.getByRole('link', { name: 'Approach' });
    await expect(navLink).toBeVisible();
    await navLink.click();

    // Allow smooth scroll to settle
    await page.waitForTimeout(600);

    // Verify section heading is in viewport and below the header
    const heading = page.locator('#approach-heading');
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();
    // Header height is approx 64-74px; headingBox.y must be greater than header height to prevent overlap
    expect(headingBox!.y).toBeGreaterThan(60);
    expect(headingBox!.y).toBeLessThan(300);
  });

  test('should verify keyboard accessibility and focus navigation across stage articles', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const approachSection = page.locator('#approach');
    await approachSection.scrollIntoViewIfNeeded();

    const articles = approachSection.locator('article');
    await expect(articles).toHaveCount(4);

    // Focus first article directly and verify active element
    await articles.first().focus();
    const isFirstFocused = await articles.first().evaluate((el) => document.activeElement === el);
    expect(isFirstFocused).toBe(true);

    // Press Tab to navigate to the second article
    await page.keyboard.press('Tab');
    const isSecondFocused = await articles.nth(1).evaluate((el) => document.activeElement === el);
    expect(isSecondFocused).toBe(true);
  });

  test('should verify reduced motion preference support in approach section', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const approachSection = page.locator('#approach');
    await approachSection.scrollIntoViewIfNeeded();

    // Headings and articles must be immediately visible without transition delays
    const heading = approachSection.locator('#approach-heading');
    await expect(heading).toBeVisible();

    const articles = approachSection.locator('article');
    await expect(articles).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(articles.nth(i)).toBeVisible();
    }

    // Capture reduced-motion screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '05-approach-reduced-motion.png'),
      fullPage: false,
    });
  });

  test('should verify zero horizontal overflow across all 5 standard viewports', async ({ page }) => {
    const viewports = [
      { width: 360, height: 800, name: '360x800' },
      { width: 390, height: 844, name: '390x844' },
      { width: 768, height: 1024, name: '768x1024' },
      { width: 1280, height: 800, name: '1280x800' },
      { width: 1440, height: 900, name: '1440x900' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Scroll to approach section
      const approachSection = page.locator('#approach');
      await approachSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('should capture required visual screenshots at desktop, tablet, and mobile', async ({ page }) => {
    // 1. Desktop full section (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const approachSection = page.locator('#approach');
    await approachSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // Wait for entrance reveal to settle

    await page.screenshot({
      path: path.join(screenshotDir, '01-approach-desktop-full.png'),
      fullPage: false,
    });

    // 2. Desktop section during reveal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      const approach = document.getElementById('approach');
      approach?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(100); // Mid-transition snapshot
    await page.screenshot({
      path: path.join(screenshotDir, '02-approach-desktop-reveal.png'),
      fullPage: false,
    });

    // 3. Tablet layout (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const tabletApproach = page.locator('#approach');
    await tabletApproach.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    await page.screenshot({
      path: path.join(screenshotDir, '04-approach-tablet-layout.png'),
      fullPage: false,
    });

    // 4. Mobile full section (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const mobileApproach = page.locator('#approach');
    await mobileApproach.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    await page.screenshot({
      path: path.join(screenshotDir, '03-approach-mobile-full.png'),
      fullPage: false,
    });
  });

  test('should verify zero browser console errors during full approach interaction', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const approachSection = page.locator('#approach');
    await approachSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Hover over each stage card
    const articles = approachSection.locator('article');
    const count = await articles.count();
    for (let i = 0; i < count; i++) {
      await articles.nth(i).hover();
      await page.waitForTimeout(100);
    }

    expect(consoleErrors).toEqual([]);
  });
});
